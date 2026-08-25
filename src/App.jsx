import { useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Home from "@/pages/Home"
import Services from "@/pages/Services"
import Cases from "@/pages/Cases"
import Price from "@/pages/Price"
import Booking from "@/pages/Booking"
import Contacts from "@/pages/Contacts"

const TITLES = {
  "/": "СИРИУС — дорожно-строительная компания в СПб и Ленобласти",
  "/services": "Услуги — асфальтирование, ямочный ремонт, благоустройство · СИРИУС",
  "/cases": "Кейсы — выполненные объекты в СПб и Ленобласти · СИРИУС",
  "/price": "Прайс-лист на дорожно-строительные работы · СИРИУС",
  "/booking": "Оставить заявку на дорожные работы · СИРИУС",
  "/contacts": "Контакты · СИРИУС",
}

/** Прокрутка наверх и заголовок вкладки при смене страницы. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = TITLES[pathname] ?? TITLES["/"]
    if (hash) {
      const frame = window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ block: "start" })
      })
      return () => window.cancelAnimationFrame(frame)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/price" element={<Price />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  )
}
