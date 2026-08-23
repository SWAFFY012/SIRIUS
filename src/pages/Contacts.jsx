import { Link } from "react-router-dom"
import ScrollScene from "@/components/ScrollScene"
import PageHead from "@/components/PageHead"
import { COMPANY, SOCIALS } from "@/data/site"
import { useReveal } from "@/lib/hooks"

export default function Contacts() {
  const ref = useReveal()

  return (
    <>
      <ScrollScene startScene={5} />
      <main className="page page--contacts" ref={ref}>
        <PageHead title="Контакты" />

        <section className="section contacts" data-nav="/contacts" data-scene={5}>
          <div className="container contacts__grid">
            <div className="contacts__info reveal">
              <div className="contacts__item">
                <b>Телефон</b>
                <p>
                  <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
                </p>
              </div>

              <div className="contacts__item">
                <b>Электронная почта</b>
                <p>
                  <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                </p>
              </div>

              <div className="contacts__item">
                <b>Адрес</b>
                <p>
                  <a href={COMPANY.mapUrl} target="_blank" rel="noopener noreferrer">
                    {COMPANY.address}
                  </a>
                </p>
              </div>

              <div className="contacts__item">
                <b>Режим работы</b>
                <p>{COMPANY.hours}</p>
              </div>

              <div className="contacts__item">
                <b>Социальные сети</b>
                <ul className="contacts__socials">
                  {SOCIALS.map((social) => (
                    <li key={social.label}>
                      <a href={social.href}>
                        <span>{social.label}</span>
                        <i>{social.handle}</i>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/booking" className="btn btn--gold">
                Оставить заявку
              </Link>
            </div>

            <div className="contacts__map reveal">
              <iframe
                src={COMPANY.mapEmbed}
                title="Расположение ООО «Сириус» на Яндекс Картах"
                loading="lazy"
                allowFullScreen
              />
              <a
                className="contacts__map-link"
                href={COMPANY.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть в Яндекс Картах →
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
