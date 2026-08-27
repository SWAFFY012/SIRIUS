const MAX_BODY_LENGTH = 12_000
const ALLOWED_ORIGINS = new Set([
  "https://siriuss-nine.vercel.app",
  "https://xn--h1aaxcdl.net",
  "https://www.xn--h1aaxcdl.net",
  "http://localhost:5173",
  "http://localhost:5180",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5180",
])

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
  response.status(status)
  response.setHeader("Content-Type", "application/json; charset=utf-8")
  response.setHeader("Cache-Control", "no-store")
  response.json(body)
}

export default async function handler(request, response) {
  const origin = clean(request.headers.origin, 200)
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return sendJson(response, 403, { ok: false, error: "Источник запроса не разрешён" })
  }

  if (origin) {
    response.setHeader("Access-Control-Allow-Origin", origin)
    response.setHeader("Vary", "Origin")
  }
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  response.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (request.method === "OPTIONS") {
    response.status(204).end()
    return
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS")
    return sendJson(response, 405, { ok: false, error: "Метод не поддерживается" })
  }

  const body = request.body && typeof request.body === "object" ? request.body : {}
  if (JSON.stringify(body).length > MAX_BODY_LENGTH) {
    return sendJson(response, 413, { ok: false, error: "Слишком большой запрос" })
  }

  // Honeypot: реальный посетитель это поле не видит и не заполняет.
  if (clean(body.company, 120)) {
    return sendJson(response, 200, { ok: true })
  }

  const name = clean(body.name, 100)
  const phone = clean(body.phone, 40)
  const phoneDigits = phone.replace(/\D/g, "")
  if (!name || phoneDigits.length < 10 || body.privacy !== true) {
    return sendJson(response, 400, { ok: false, error: "Проверьте обязательные поля" })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
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
