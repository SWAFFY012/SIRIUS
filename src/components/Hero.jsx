import { Link } from "react-router-dom"
import { HERO_BENEFITS, HERO_SLOGAN } from "@/data/site"

/* Слова слогана со сквозным номером — по нему считается задержка волны. */
const SLOGAN_LINES = (() => {
  let index = 0
  return HERO_SLOGAN.lines.map((line) => line.split(" ").map((word) => ({ word, index: index++ })))
})()

export default function Hero() {
  return (
    <section className="hero" data-hero data-nav="/" id="hero">
      <div className="container hero__inner">
        <h1 className="hero__title">
          <span className="visually-hidden">
            {HERO_SLOGAN.headline.join(" ")} {HERO_SLOGAN.lines.join(" ")}
          </span>

          {HERO_SLOGAN.headline.map((line) => (
            <span key={line} className="hero__type-line" aria-hidden="true">
              <span className="hero__headline">{line}</span>
            </span>
          ))}

          <span className="hero__slogan-lines" aria-hidden="true">
            {SLOGAN_LINES.map((words, lineIndex) => (
              <span key={lineIndex} className="hero__line is-in">
                {words.map(({ word, index }) => (
                  <span key={index}>
                    <span className="hero__word" style={{ "--word-i": index }}>
                      {word}
                    </span>{" "}
                  </span>
                ))}
              </span>
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

        <div className="hero__benefits-row">
          <ul className="hero__benefits" aria-label="Преимущества компании">
            {HERO_BENEFITS.map((benefit, index) => (
              <li key={benefit.title} className="hero__benefit reveal" style={{ "--reveal-delay": `${700 + index * 90}ms` }}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hero__benefit-copy">
                  <b>{benefit.title}</b> {benefit.text}
                </span>
              </li>
            ))}
          </ul>

          <Link to="/price#price-calculator" className="hero__calculator reveal" style={{ "--reveal-delay": "970ms" }}>
            <span>Калькулятор стоимости</span>
            <b>Рассчитать <i aria-hidden="true">→</i></b>
          </Link>
        </div>
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
