import { useEffect, useRef, useState } from "react"

const REDUCED = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(REDUCED)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener("change", updatePreference)
    return () => mediaQuery.removeEventListener("change", updatePreference)
  }, [])

  return reducedMotion
}

/**
 * Навешивает класс `is-visible` на все .reveal внутри контейнера,
 * когда они входят в область просмотра. Возвращает ref для контейнера;
 * без ref — работает по всему документу.
 */
export function useReveal(deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current ?? document
    const items = root.querySelectorAll(".reveal")
    if (!items.length) return undefined

    if (REDUCED()) {
      items.forEach((el) => el.classList.add("is-visible"))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )

    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

/**
 * Печатает слово посимвольно, когда элемент появился на экране.
 * @returns {[import("react").RefObject, string, boolean]} ref, набранный текст, флаг завершения
 */
export function useTypewriter(word, { speed = 92, delay = 350 } = {}) {
  const ref = useRef(null)
  const [typed, setTyped] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (REDUCED()) {
      setTyped(word)
      setDone(true)
      return undefined
    }

    let index = 0
    let timer = 0
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        index += 1
        setTyped(word.slice(0, index))
        if (index >= word.length) {
          window.clearInterval(timer)
          setDone(true)
        }
      }, speed)
    }, delay)

    return () => {
      window.clearTimeout(start)
      window.clearInterval(timer)
    }
  }, [word, speed, delay])

  return [ref, typed, done]
}

/**
 * Следит, какая секция сейчас на экране, и отдаёт соответствующий ей
 * маршрут — чтобы в навигации подчёркивался текущий раздел, а не только
 * открытая страница. Секция объявляет себя атрибутом `data-nav="/services"`.
 */
export function useActiveSection(pathname) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    setActive(null)
    let raf = 0

    const update = () => {
      raf = 0
      const sections = document.querySelectorAll("[data-nav]")
      if (!sections.length) return

      const line = window.innerHeight * 0.42 // условная «линия внимания»
      let current = null
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= line && rect.bottom > line) current = section.dataset.nav
      })
      setActive(current)
    }

    const request = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }

    request()
    window.addEventListener("scroll", request, { passive: true })
    window.addEventListener("resize", request)
    return () => {
      window.removeEventListener("scroll", request)
      window.removeEventListener("resize", request)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [pathname])

  return active
}

/**
 * Считает число от 0 до target, когда элемент виден.
 */
export function useCountUp(target, { duration = 1400 } = {}) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (REDUCED()) {
      setValue(target)
      return undefined
    }

    let raf = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()
        const started = performance.now()
        const tick = (now) => {
          const t = Math.min(1, (now - started) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          setValue(Math.round(target * eased))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target, duration])

  return [ref, value]
}
