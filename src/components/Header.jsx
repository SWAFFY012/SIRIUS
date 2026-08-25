import { useEffect, useState } from "react"
import { NavLink, Link, useLocation } from "react-router-dom"
import { COMPANY, NAV } from "@/data/site"
import { useActiveSection, useReducedMotion } from "@/lib/hooks"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reducedMotion = useReducedMotion()
  const { pathname } = useLocation()
  // секция под «линией внимания» перебивает подсветку по маршруту
  const activeSection = useActiveSection(pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // блокируем прокрутку под открытым мобильным меню
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const isActive = (item, routeActive) =>
    activeSection ? activeSection === item.to : routeActive

  return (
    <header className={`header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header__inner">
        <Link to="/" className="header__logo" aria-label={`${COMPANY.name} — на главную`}>
          {reducedMotion ? (
            <img
              className="header__logo-media"
              src="/logo/sirius-logo.png"
              alt=""
              width="1229"
              height="557"
              decoding="async"
            />
          ) : (
            <video
              className="header__logo-media"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/logo/sirius-logo.png"
              width="640"
              height="360"
              aria-hidden="true"
            >
              <source src="/logo/sirius-logo-animated.webm" type="video/webm" />
              <img src="/logo/sirius-logo.png" alt="" />
            </video>
          )}
        </Link>

        <nav className="header__nav" aria-label="Разделы сайта">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive: routeActive }) =>
                `header__link${isActive(item, routeActive) ? " is-active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <a href={COMPANY.phoneHref} className="header__phone">
            {COMPANY.phone}
          </a>
          <Link to="/booking" className="btn btn--gold btn--sm">
            Оставить заявку
          </Link>
        </div>

        <button
          type="button"
          className={`header__burger${open ? " is-open" : ""}`}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`header__drawer${open ? " is-open" : ""}`}>
        <nav aria-label="Мобильное меню">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive: routeActive }) =>
                `header__drawer-link${isActive(item, routeActive) ? " is-active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header__drawer-foot">
          <a href={COMPANY.phoneHref} className="header__drawer-phone">
            {COMPANY.phone}
          </a>
          <Link to="/booking" className="btn btn--gold" onClick={() => setOpen(false)}>
            Оставить заявку
          </Link>
        </div>
      </div>
    </header>
  )
}
