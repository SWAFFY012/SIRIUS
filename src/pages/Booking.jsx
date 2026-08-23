import { useState } from "react"
import ScrollScene from "@/components/ScrollScene"
import PageHead from "@/components/PageHead"
import { COMPANY } from "@/data/site"
import { PRICE_SECTIONS } from "@/data/price"
import { useReveal } from "@/lib/hooks"

const BOOKING_LABELS = {
  earthwork: "Земляные работы",
  base: "Дорожное основание",
  asphalt: "Асфальтирование и покрытия",
  drainage: "Бордюры и водоотвод",
  bridges: "Мосты и сооружения",
  safety: "Безопасность дорог",
  design: "Проектирование и изыскания",
  rent: "Аренда спецтехники",
}

const OPTIONS = PRICE_SECTIONS.map((section) => BOOKING_LABELS[section.id] || section.title)

export default function Booking() {
  const ref = useReveal()
  const [picked, setPicked] = useState([])
  const [status, setStatus] = useState({ state: "idle", message: "" })
  const [errors, setErrors] = useState({})

  const togglePick = (value) =>
    setPicked((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))

  const onSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))

    // ловушка для ботов: люди это поле не видят
    if (data.company) return

    const nextErrors = {}
    if (!String(data.name || "").trim()) nextErrors.name = "Укажите, как к вам обращаться"
    const digits = String(data.phone || "").replace(/\D/g, "")
    if (digits.length < 10) nextErrors.phone = "Введите телефон в формате +7 (___) ___-__-__"
    if (!data.privacy) nextErrors.privacy = "Нужно согласие на обработку данных"

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setStatus({ state: "error", message: "Проверьте отмеченные поля — заявка не отправлена." })
      form.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus()
      return
    }

    setStatus({ state: "sending", message: "Отправляем заявку…" })

    // TODO: сюда подключим вебхук админки MAX, чтобы заявки падали в мессенджер
    const payload = { ...data, services: picked, sentAt: new Date().toISOString() }
    console.info("Заявка (черновик, отправка ещё не подключена):", payload)

    await new Promise((resolve) => setTimeout(resolve, 700))
    setStatus({
      state: "ok",
      message: `Заявка принята. Перезвоним по номеру ${data.phone} и обсудим детали напрямую — без колл-центра.`,
    })
    form.reset()
    setPicked([])
  }

  return (
    <>
      <ScrollScene startScene={4} />
      <main className="page page--booking" ref={ref}>
        <PageHead title="Оставить заявку" />

        <section className="section booking" data-nav="/booking" data-scene={4}>
          <div className="container booking__grid">
            <aside className="booking__info reveal">
              <h2>Как проходит работа</h2>
              <ol className="booking__steps">
                <li>
                  <b>Заявка</b>
                  <span>Оставляете контакты и коротко описываете объект.</span>
                </li>
                <li>
                  <b>Звонок напрямую</b>
                  <span>
                    Детали обсуждаете лично с представителем «Сириуса» — без колл-центра и
                    посредников.
                  </span>
                </li>
                <li>
                  <b>Выезд и замер</b>
                  <span>Бесплатный выезд инженера в пределах 100 км от Санкт-Петербурга.</span>
                </li>
                <li>
                  <b>Смета и договор</b>
                  <span>Фиксируем объём, сроки и стоимость. Гарантия по договору до 7 лет.</span>
                </li>
              </ol>

              <div className="booking__contacts">
                <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                <p>{COMPANY.hours}</p>
              </div>
            </aside>

            <form className="form reveal" onSubmit={onSubmit} noValidate>
              <div className="form__row">
                <label className="form__field">
                  <span>
                    Имя <i aria-hidden="true">*</i>
                  </span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Как к вам обращаться"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "err-name" : undefined}
                  />
                  {errors.name && (
                    <em className="form__error" id="err-name">
                      {errors.name}
                    </em>
                  )}
                </label>

                <label className="form__field">
                  <span>
                    Телефон <i aria-hidden="true">*</i>
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="+7 (___) ___-__-__"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "err-phone" : undefined}
                  />
                  {errors.phone && (
                    <em className="form__error" id="err-phone">
                      {errors.phone}
                    </em>
                  )}
                </label>
              </div>

              <fieldset className="form__field form__fieldset">
                <legend>Что нужно сделать</legend>
                <div className="form__chips">
                  {OPTIONS.map((option) => (
                    <label className={`chip${picked.includes(option) ? " is-on" : ""}`} key={option}>
                      <input
                        type="checkbox"
                        checked={picked.includes(option)}
                        onChange={() => togglePick(option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="form__row">
                <label className="form__field">
                  <span>Объём работ</span>
                  <input type="text" name="volume" placeholder="Например: 1 200 м² парковки" />
                </label>
                <label className="form__field">
                  <span>Адрес объекта</span>
                  <input type="text" name="place" placeholder="Город, посёлок или район" />
                </label>
              </div>

              <label className="form__field">
                <span>Комментарий</span>
                <textarea
                  name="comment"
                  rows="2"
                  placeholder="Состояние основания, желаемые сроки, особенности заезда техники"
                />
              </label>

              <input
                type="text"
                name="company"
                className="form__hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <label className={`form__consent${errors.privacy ? " has-error" : ""}`}>
                <input type="checkbox" name="privacy" />
                <span>
                  Согласен на обработку персональных данных и ознакомлен с политикой
                  конфиденциальности.
                </span>
              </label>
              {errors.privacy && <em className="form__error">{errors.privacy}</em>}

              <button type="submit" className="btn btn--gold form__submit" disabled={status.state === "sending"}>
                {status.state === "sending" ? "Отправляем…" : "Отправить заявку"}
              </button>

              {status.message && (
                <p className={`form__status is-${status.state}`} role="status" aria-live="polite">
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
    </>
  )
}
