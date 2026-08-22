import { useEffect, useRef, useState } from "react"

/**
 * Лента фотографий одного объекта: непрерывная прокрутка,
 * ручной свайп/перетаскивание и кнопка паузы.
 * Без зума, затемнения и подписей при наведении.
 */
export default function CaseCarousel({ photos, title, reverse = false, speed = 46 }) {
  const trackRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReduced(query.matches)
    apply()
    query.addEventListener?.("change", apply)
    return () => query.removeEventListener?.("change", apply)
  }, [])

  // перетаскивание мышью
  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    let down = false
    let startX = 0
    let startScroll = 0

    const onDown = (event) => {
      down = true
      startX = event.pageX
      startScroll = track.scrollLeft
      track.classList.add("is-dragging")
    }
    const onMove = (event) => {
      if (!down) return
      event.preventDefault()
      track.scrollLeft = startScroll - (event.pageX - startX)
    }
    const onUp = () => {
      down = false
      track.classList.remove("is-dragging")
    }

    track.addEventListener("mousedown", onDown)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      track.removeEventListener("mousedown", onDown)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [])

  const running = !paused && !reduced
  // дублируем ленту, чтобы прокрутка выглядела бесконечной
  const items = [...photos, ...photos]

  return (
    <div className="case-carousel">
      {/* при наведении лента продолжает идти — останавливается только кнопкой */}
      <div className="case-carousel__viewport" ref={trackRef}>
        <ul
          className="case-carousel__track"
          style={{
            animationDuration: `${speed}s`,
            animationDirection: reverse ? "reverse" : "normal",
            animationPlayState: running ? "running" : "paused",
          }}
        >
          {items.map((src, index) => (
            <li key={`${src}-${index}`} aria-hidden={index >= photos.length}>
              <img
                src={src}
                alt={index < photos.length ? `${title} — фото ${index + 1}` : ""}
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="case-carousel__toggle"
        onClick={() => setPaused((v) => !v)}
        aria-label={paused ? `Продолжить прокрутку: ${title}` : `Остановить прокрутку: ${title}`}
      >
        {paused ? "▶" : "❚❚"}
      </button>
    </div>
  )
}
