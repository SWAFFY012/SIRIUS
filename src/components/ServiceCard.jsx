import { useId, useState } from "react"

const money = (value) => value.toLocaleString("ru-RU")

/**
 * Компактная карточка услуги: фото на всю плашку, снизу светлая дымка
 * с названием. У двух услуг по кнопке карточка переворачивается
 * и показывает состав комплекса со стоимостью.
 */
export default function ServiceCard({ service, index }) {
  const [flipped, setFlipped] = useState(false)
  const backId = useId()
  const canFlip = Boolean(service.flip)

  return (
    <article
      className={`svc${canFlip ? " svc--flippable" : ""}${flipped ? " is-flipped" : ""} reveal is-visible`}
      style={{ "--reveal-delay": `${index * 80}ms` }}
    >
      <div className="svc__inner">
        <div
          className="svc__face svc__face--front"
          role={canFlip ? "button" : undefined}
          tabIndex={canFlip && !flipped ? 0 : undefined}
          aria-hidden={canFlip ? flipped : undefined}
          aria-expanded={canFlip ? flipped : undefined}
          aria-controls={canFlip ? backId : undefined}
          onClick={canFlip ? () => setFlipped(true) : undefined}
          onKeyDown={canFlip ? (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              setFlipped(true)
            }
          } : undefined}
        >
          <img
            className="svc__photo"
            src={service.image}
            alt=""
            loading="lazy"
            decoding="async"
            width="1600"
            height="900"
          />

          <div className="svc__plate">
            <h3 className="svc__title">{service.title}</h3>
            <p className="svc__text">{service.text}</p>

            {canFlip && (
              <span className="svc__action">
                Посмотреть цену
                <span aria-hidden="true">→</span>
              </span>
            )}
          </div>
        </div>

        {canFlip && (
          <div className="svc__face svc__face--back" id={backId} aria-hidden={!flipped}>
            <div className="svc__back-head">
              <h3>{service.flip.title}</h3>
              <button
                type="button"
                className="svc__close"
                onClick={() => setFlipped(false)}
                aria-label="Вернуться к описанию услуги"
                tabIndex={flipped ? 0 : -1}
              >
                ×
              </button>
            </div>

            <div className="svc__price-sheet">
              <div className="svc__mobile-total" aria-hidden="true">
                <span>{service.flip.unit}</span>
                <b>{money(service.flip.total)} ₽</b>
              </div>
              <div className="svc__price-head" aria-hidden="true">
                <span>№</span>
                <span>Наименование работ</span>
                <span>Ед. изм.</span>
                <span>Стоимость за комплекс</span>
              </div>
              <ol className="svc__rows">
                {service.flip.rows.map((row, i) => (
                  <li key={row}>
                    <span className="svc__row-num">{i + 1}</span>
                    <span>{row}</span>
                    <i>{i === 0 ? service.flip.unit : ""}</i>
                    <b>{i === 0 ? money(service.flip.total) : ""}</b>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
