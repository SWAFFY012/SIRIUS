import { useState } from "react"
import { Link } from "react-router-dom"
import { HERO_BENEFITS, HERO_SLOGAN } from "@/data/site"
import TextDisperse from "@/components/ui/TextDisperse"

export default function Hero() {
  const [phraseDispersed, setPhraseDispersed] = useState(false)

  const handlePhraseEnter = (event) => {
    if (event.pointerType === "mouse") setPhraseDispersed(true)
  }

  const handlePhraseLeave = (event) => {
    if (event.pointerType === "mouse") setPhraseDispersed(false)
  }

  return (
    <section className="hero" data-hero data-nav="/" id="hero">
      <div className="container hero__inner">
        <h1 className="hero__title">
          <span className="visually-hidden">
            {HERO_SLOGAN.typeword} {HERO_SLOGAN.lines.join(" ")}
          </span>

          <span className="hero__type-line" aria-hidden="true">
            <span className="accent hero__typeword">{HERO_SLOGAN.typeword}</span>
          </span>

          <span
            className="hero__disperse-phrase"
            aria-hidden="true"
            onPointerEnter={handlePhraseEnter}
            onPointerLeave={handlePhraseLeave}
          >
            {HERO_SLOGAN.lines.map((line, index) => (
              <TextDisperse
                key={line}
                className="hero__line is-in"
                active={phraseDispersed}
                transformOffset={HERO_SLOGAN.lines.slice(0, index).join("").length}
              >
                {line}
              </TextDisperse>
            ))}
          </span>
        </h1>

        <div className="hero__cta reveal" style={{ "--reveal-delay": "620ms" }}>
          <Link to="/booking" className="btn btn--gold">
            Оставить заявку
          </Link>
          <Link to="/services" className="btn btn--ghost">
            Наши услуги
          </Link>
        </div>

        <ul className="hero__benefits" aria-label="Преимущества компании">
          {HERO_BENEFITS.map((benefit, index) => (
            <li key={benefit} className="hero__benefit reveal" style={{ "--reveal-delay": `${700 + index * 90}ms` }}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{benefit}</span>
            </li>
          ))}
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
