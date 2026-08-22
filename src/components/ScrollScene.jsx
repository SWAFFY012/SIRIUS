import { useEffect, useRef } from "react"
import { SCENES } from "@/data/site"

/**
 * Фиксированный фоновый слой страницы.
 *
 * На герое играет зацикленное видео. По мере ухода героя вверх видео
 * гаснет и затемняется, а под ним проявляется 4K-фотография. Дальше
 * фотографии сменяют друг друга кроссфейдом: каждая секция с атрибутом
 * `data-scene` объявляет свой индекс в SCENES.
 *
 * @param {boolean} withVideo — показывать ли видео-слой (только главная).
 * @param {number}  startScene — индекс сцены для страниц без видео.
 */
export default function ScrollScene({ withVideo = false, startScene = 0 }) {
  const sceneRef = useRef(null)
  const videoRef = useRef(null)
  const layerARef = useRef(null)
  const layerBRef = useRef(null)

  // предзагрузка кадров, чтобы кроссфейд не мигал
  useEffect(() => {
    SCENES.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  // зацикливание видео + перезапуск при возврате на вкладку
  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    const kick = () => {
      video.play().catch(() => {})
    }
    const onVisibility = () => {
      if (!document.hidden) kick()
    }
    const onEnded = () => {
      video.currentTime = 0
      kick()
    }

    kick()
    video.addEventListener("ended", onEnded)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      video.removeEventListener("ended", onEnded)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [withVideo])

  useEffect(() => {
    const scene = sceneRef.current
    const layerA = layerARef.current
    const layerB = layerBRef.current
    if (!scene || !layerA || !layerB) return undefined

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")

    let active = layerA
    let idle = layerB
    let currentIndex = -1
    let raf = 0

    const showScene = (index, immediate) => {
      const next = Math.max(0, Math.min(SCENES.length - 1, index))
      if (next === currentIndex) return
      currentIndex = next

      idle.style.backgroundImage = `url("${SCENES[next]}")`

      if (immediate || reduced.matches) {
        idle.style.transition = "none"
        active.style.transition = "none"
        idle.style.opacity = "1"
        active.style.opacity = "0"
        // возвращаем переходы следующим кадром
        requestAnimationFrame(() => {
          idle.style.transition = ""
          active.style.transition = ""
        })
      } else {
        idle.style.opacity = "1"
        active.style.opacity = "0"
      }

      const swap = active
      active = idle
      idle = swap
    }

    const update = () => {
      raf = 0
      const video = videoRef.current
      const vh = window.innerHeight || 1

      // прогресс ухода героя: 0 — герой на весь экран, 1 — герой ушёл
      let heroProgress = 1
      const hero = document.querySelector("[data-hero]")
      if (hero) {
        const rect = hero.getBoundingClientRect()
        heroProgress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.72 || vh)))
      }
      const eased = heroProgress * heroProgress * (3 - 2 * heroProgress) // smoothstep

      if (video) {
        video.style.opacity = String(Math.max(0, 1 - eased * 1.12))
        video.style.filter = `brightness(${1 - eased * 0.55}) saturate(${1 - eased * 0.2})`
      }
      scene.style.setProperty("--scene-opacity", String(Math.min(1, eased * 1.25)))

      // какая секция ближе всего к центру экрана — её сцена и активна
      const sections = document.querySelectorAll("[data-scene]")
      let bestIndex = startScene
      let bestDistance = Infinity
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const distance = Math.abs(rect.top + rect.height / 2 - vh / 2)
        if (distance < bestDistance) {
          bestDistance = distance
          bestIndex = Number(section.dataset.scene || 0)
        }
      })
      showScene(bestIndex, false)
    }

    const request = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }

    // первый кадр — без анимации, чтобы не было вспышки
    showScene(startScene, true)
    if (!withVideo) scene.style.setProperty("--scene-opacity", "1")
    request()

    window.addEventListener("scroll", request, { passive: true })
    window.addEventListener("resize", request)
    reduced.addEventListener?.("change", request)
    return () => {
      window.removeEventListener("scroll", request)
      window.removeEventListener("resize", request)
      reduced.removeEventListener?.("change", request)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [withVideo, startScene])

  return (
    <div className="scroll-scene" ref={sceneRef} aria-hidden="true">
      {withVideo && (
        <video
          ref={videoRef}
          className="scroll-scene__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/backgrounds/scene-01.jpg"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      )}
      <div className="scroll-scene__image" ref={layerARef} />
      <div className="scroll-scene__image" ref={layerBRef} />
      <div className="scroll-scene__overlay" />
      <div className="scroll-scene__grain" />
    </div>
  )
}
