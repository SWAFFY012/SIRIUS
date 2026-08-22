import { Link } from "react-router-dom"
import { COMPANY, HERO_BADGES, HERO_SLOGAN } from "@/data/site"
import { useCountUp, useTypewriter } from "@/lib/hooks"

function CashbackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v18M8.2 7.4h5.4a2.6 2.6 0 0 1 0 5.2h-3.6a2.6 2.6 0 0 0 0 5.2h5.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.2" opacity=".45" />
    </svg>
  )
}

const ICONS = { cashback: CashbackIcon }

function CountBadge({ badge }) {
  const [ref, value] = useCountUp(badge.count)
  return (
    <li className="hero__badge hero__badge--count reveal" ref={ref}>
      <b>
        {value}
        {badge.suffix}
      </b>
      <span>{badge.label}</span>
    </li>
  )
}

function InfoBadge({ badge, index }) {
  const Icon = ICONS[badge.icon]
  return (
    <li className="hero__badge reveal" style={{ "--reveal-delay": `${index * 110}ms` }}>
      <span className="hero__badge-icon">{Icon ? <Icon /> : null}</span>
      <div className="hero__badge-body">
        <b>{badge.title}</b>
        <span>{badge.label}</span>
      </div>
    </li>
  )
}

export default function Hero() {
  const [, typed, done] = useTypewriter(HERO_SLOGAN.typeword)

  return (
    <section className="hero" data-hero data-nav="/" id="hero">
      <div className="container hero__inner">
        <h1 className="hero__title">
          <span className="visually-hidden">
            {HERO_SLOGAN.typeword} {HERO_SLOGAN.lines.join(" ")}
          </span>

          <span className="hero__type-line" aria-hidden="true">
            <span className="accent hero__typeword">{typed}</span>
            <span className={`hero__caret${done ? " is-done" : ""}`} />
          </span>

          {HERO_SLOGAN.lines.map((line, i) => (
            <span
              key={line}
              className={`hero__line${done ? " is-in" : ""}`}
              style={{ "--line-delay": `${i * 130}ms` }}
              aria-hidden="true"
            >
              {line}
            </span>
          ))}
        </h1>

        <div className="hero__cta reveal" style={{ "--reveal-delay": "620ms" }}>
          <Link to="/booking" className="btn btn--gold">
            Оставить заявку
          </Link>
          <Link to="/services" className="btn btn--ghost">
            Наши услуги
          </Link>
        </div>

        <ul className="hero__badges" aria-label="Преимущества компании">
          {HERO_BADGES.map((badge, i) =>
            badge.count ? (
              <CountBadge key={badge.id} badge={badge} />
            ) : (
              <InfoBadge key={badge.id} badge={badge} index={i} />
            ),
          )}
        </ul>
      </div>

      <a href="#services" className="hero__scroll" aria-label="Пролистать к услугам">
        <span>Листайте вниз</span>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 4v15m0 0 5.5-5.5M12 19l-5.5-5.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  )
}
