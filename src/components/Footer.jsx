import { Link } from "react-router-dom"
import { COMPANY, NAV, SOCIALS } from "@/data/site"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <img
              src="/logo/sirius-logo.png"
              alt={COMPANY.legal}
              width="1229"
              height="557"
              loading="lazy"
            />
            <p>
              {COMPANY.tagline} · {COMPANY.region}. {COMPANY.motto}
            </p>
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <h4>Разделы</h4>
              {NAV.filter((item) => item.to !== "/").map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="footer__col">
              <h4>Контакты</h4>
              <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              <p>{COMPANY.hours}</p>
            </div>

            <div className="footer__col footer__social-col">
              <h4>Социальные сети</h4>
              <div className="footer__socials">
                {SOCIALS.map((social) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                    <span>{social.label}</span>
                    <i>{social.handle}</i>
                  </a>
                ))}
              </div>
            </div>

            <div className="footer__col">
              <h4>Адрес</h4>
              <a href={COMPANY.mapUrl} target="_blank" rel="noopener noreferrer">
                {COMPANY.address}
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} {COMPANY.legal}. Все права защищены.
          </span>
          
        </div>
      </div>
    </footer>
  )
}
