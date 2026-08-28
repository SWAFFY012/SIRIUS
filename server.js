import { createReadStream, existsSync } from "node:fs"
import { stat } from "node:fs/promises"
import { createServer } from "node:http"
import { extname, join, normalize, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const APP_ROOT = fileURLToPath(new URL(".", import.meta.url))
const DIST_ROOT = resolve(APP_ROOT, "dist")
const INDEX_FILE = join(DIST_ROOT, "index.html")
const MAX_BODY_LENGTH = 12_000
const PORT = Number(process.env.PORT) || 3000
const localConfigPath = join(APP_ROOT, "config.local.js")
const localConfig = existsSync(localConfigPath)
  ? (await import(`${new URL("./config.local.js", import.meta.url).href}?v=${Date.now()}`)).default
  : {}

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
}

const clean = (value, maxLength = 500) =>
  String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength)

const escapeHtml = (value) =>
  clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

const formatServices = (services) => {
  if (!Array.isArray(services) || services.length === 0) return "Не выбраны"
  return services
    .slice(0, 8)
    .map((service) => `• ${escapeHtml(clean(service, 120))}`)
    .join("\n")
}

const sendJson = (response, status, body) => {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  })
  response.end(JSON.stringify(body))
}

const readJsonBody = (request) =>
  new Promise((resolveBody, reject) => {
    let raw = ""
    request.setEncoding("utf8")
    request.on("data", (chunk) => {
      raw += chunk
      if (raw.length > MAX_BODY_LENGTH) {
        reject(Object.assign(new Error("Payload too large"), { status: 413 }))
        request.destroy()
      }
    })
    request.on("end", () => {
      if (raw.length > MAX_BODY_LENGTH) return
      try {
        resolveBody(raw ? JSON.parse(raw) : {})
      } catch {
        reject(Object.assign(new Error("Invalid JSON"), { status: 400 }))
      }
    })
    request.on("error", reject)
  })

const handleTelegram = async (request, response) => {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST")
    return sendJson(response, 405, { ok: false, error: "Метод не поддерживается" })
  }

  let body
  try {
    body = await readJsonBody(request)
  } catch (error) {
    if (!response.headersSent) {
      return sendJson(response, error?.status || 400, {
        ok: false,
        error: error?.status === 413 ? "Слишком большой запрос" : "Некорректный запрос",
      })
    }
    return
  }

  if (clean(body.company, 120)) return sendJson(response, 200, { ok: true })

  const name = clean(body.name, 100)
  const phone = clean(body.phone, 40)
  if (!name || phone.replace(/\D/g, "").length < 10 || body.privacy !== true) {
    return sendJson(response, 400, { ok: false, error: "Проверьте обязательные поля" })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN || localConfig.telegramBotToken
  const chatId = process.env.TELEGRAM_CHAT_ID || localConfig.telegramChatId
  if (!token || !chatId) {
    console.error("Telegram environment variables are not configured")
    return sendJson(response, 503, { ok: false, error: "Приём заявок временно не настроен" })
  }

  const submittedAt = new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Moscow",
  }).format(new Date())

  const text = [
    "🚧 <b>Новая заявка с сайта СИРИУС</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    "",
    "<b>Услуги:</b>",
    formatServices(body.services),
    "",
    `<b>Объём работ:</b> ${escapeHtml(clean(body.volume, 300) || "Не указан")}`,
    `<b>Адрес объекта:</b> ${escapeHtml(clean(body.place, 300) || "Не указан")}`,
    `<b>Комментарий:</b> ${escapeHtml(clean(body.comment, 1200) || "Нет")}`,
    "",
    `<b>Отправлено:</b> ${escapeHtml(submittedAt)} (МСК)`,
  ].join("\n")

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8_000),
    })
    const telegramResult = await telegramResponse.json().catch(() => null)
    if (!telegramResponse.ok || !telegramResult?.ok) {
      console.error("Telegram API rejected the request", telegramResponse.status)
      return sendJson(response, 502, { ok: false, error: "Не удалось передать заявку" })
    }
    return sendJson(response, 200, { ok: true })
  } catch (error) {
    console.error("Telegram request failed", error instanceof Error ? error.message : "Unknown error")
    return sendJson(response, 502, { ok: false, error: "Не удалось передать заявку" })
  }
}

const sendFile = async (response, filePath) => {
  const fileStat = await stat(filePath)
  const headers = {
    "Content-Type": MIME_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream",
    "Content-Length": fileStat.size,
    "X-Content-Type-Options": "nosniff",
  }
  if (filePath.includes(`${sep}assets${sep}`)) {
    headers["Cache-Control"] = "public, max-age=31536000, immutable"
  } else {
    headers["Cache-Control"] = "no-cache"
  }
  response.writeHead(200, headers)
  createReadStream(filePath).pipe(response)
}

const handleStatic = async (request, response, pathname) => {
  const decodedPath = decodeURIComponent(pathname)
  const normalizedPath = normalize(decodedPath).replace(/^([/\\])+/, "")
  const requestedFile = resolve(DIST_ROOT, normalizedPath)
  const isInsideDist = requestedFile === DIST_ROOT || requestedFile.startsWith(`${DIST_ROOT}${sep}`)

  if (isInsideDist && existsSync(requestedFile)) {
    const fileStat = await stat(requestedFile)
    if (fileStat.isFile()) return sendFile(response, requestedFile)
  }

  if (!existsSync(INDEX_FILE)) {
    return sendJson(response, 503, { ok: false, error: "Сайт не собран: выполните npm run build" })
  }
  return sendFile(response, INDEX_FILE)
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`)
    if (url.pathname === "/api/telegram") return await handleTelegram(request, response)
    if (request.method !== "GET" && request.method !== "HEAD") {
      return sendJson(response, 405, { ok: false, error: "Метод не поддерживается" })
    }
    return await handleStatic(request, response, url.pathname)
  } catch (error) {
    console.error("Request failed", error instanceof Error ? error.message : "Unknown error")
    if (!response.headersSent) sendJson(response, 500, { ok: false, error: "Внутренняя ошибка сервера" })
    else response.end()
  }
})

server.listen(PORT, "0.0.0.0", () => {
  console.log(`SIRIUS is listening on port ${PORT}`)
})

