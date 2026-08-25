import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import ScrollScene from "@/components/ScrollScene"
import { PRICE_META, PRICE_SECTIONS, PRICE_TERMS } from "@/data/price"
import { useReveal } from "@/lib/hooks"

const money = (value) => Math.round(value).toLocaleString("ru-RU")

const SECTION_IMAGES = {
  earthwork: "/cases/lapuhinka/4.jpg",
  base: "/cases/selo-shum/4.jpg",
  asphalt: "/cases/depo-nevskoe/2.jpg",
  drainage: "/cases/fedorovskoe/5.jpg",
  bridges: "/cases/sosnovy-bor/3.jpg",
  safety: "/cases/sosnovy-bor/5.jpg",
  landscaping: "/cases/fedorovskoe/6.jpg",
  design: "/cases/selo-shum/7.jpg",
  rent: "/cases/lapuhinka/6.jpg",
}

function PriceCalculator({ selected, onToggle, onQty }) {
  const [activeId, setActiveId] = useState(PRICE_SECTIONS[0].id)
  const activeSection = PRICE_SECTIONS.find((section) => section.id === activeId) ?? PRICE_SECTIONS[0]
  const picked = useMemo(
    () => PRICE_SECTIONS.flatMap((section) => section.items.map((item) => ({ ...item, section: section.title }))).filter((item) => selected[item.n] !== undefined),
    [selected],
  )
  const total = picked.reduce((sum, item) => sum + item.price * selected[item.n], 0)

  return (
    <div className="price-calc reveal" aria-labelledby="price-calc-title">
      <header className="price-calc__head">
        <h2 id="price-calc-title">Калькулятор стоимости</h2>
      </header>

      <div className="price-calc__layout">
        <nav className="price-calc__categories" aria-label="Разделы прайс-листа">
          <span className="price-calc__legend">Раздел работ</span>
          {PRICE_SECTIONS.map((section) => {
            const count = section.items.filter((item) => selected[item.n] !== undefined).length
            return (
              <button key={section.id} type="button" className={section.id === activeId ? "is-active" : ""} onClick={() => setActiveId(section.id)} aria-pressed={section.id === activeId}>
                <span className="price-calc__category-num">{String(section.num).padStart(2, "0")}</span>
                <span>{section.title}</span>
                {count > 0 && <b aria-label={`Выбрано позиций: ${count}`}>{count}</b>}
              </button>
            )
          })}
        </nav>

        <section className="price-calc__works" aria-label={activeSection.title}>
          <div className="price-calc__works-head">
            <span className="price-calc__legend">Выберите работы</span>
          </div>
          <div className="price-calc__options">
            {activeSection.items.map((item) => {
              const active = selected[item.n] !== undefined
              const selectable = Boolean(item.price)
              return (
                <div className={`price-option${active ? " is-on" : ""}${selectable ? "" : " is-disabled"}`} key={item.n}>
                  <label>
                    <input type="checkbox" checked={active} disabled={!selectable} onChange={() => onToggle(item)} />
                    <span className="price-option__check" aria-hidden="true" />
                    <span className="price-option__body"><b>{item.name}</b><i>{item.n} · {item.unit}</i></span>
                    <strong>{item.price ? `от ${money(item.price)} ₽` : item.note}</strong>
                  </label>
                  {active && (
                    <div className="price-option__qty">
                      <label htmlFor={`qty-${item.n}`}>Объём, {item.unit}</label>
                      <input id={`qty-${item.n}`} type="number" min="0" step="1" inputMode="numeric" value={selected[item.n]} onChange={(event) => onQty(item.n, event.target.value)} />
                      <b>от {money(item.price * selected[item.n])} ₽</b>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <aside className="price-calc__summary" aria-live="polite">
          <figure className="price-calc__visual">
            <img src={SECTION_IMAGES[activeSection.id] ?? "/backgrounds/scene-03.jpg"} alt="" width="1200" height="800" />
            <figcaption>{activeSection.title}</figcaption>
          </figure>
          <div className="price-calc__result">
            <strong className={picked.length ? "" : "is-empty"}>{picked.length ? `от ${money(total)} ₽` : "Выберите работы"}</strong>
            <Link to="/booking" className="btn btn--gold">Запросить смету</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

function FullPriceList() {
  return (
    <section className="full-price reveal" aria-labelledby="full-price-title">
      <header className="full-price__head">
        <h1 id="full-price-title">Полный прайс-лист</h1>
        <a href={PRICE_META.pdf} download target="_blank" rel="noopener noreferrer" className="full-price__pdf">Скачать PDF</a>
      </header>
      <div className="full-price__sections">
        {PRICE_SECTIONS.map((section) => (
          <details className="price-list" key={section.id}>
            <summary><span>{String(section.num).padStart(2, "0")}</span><b>{section.title}</b><i>{section.items.length} позиций</i><em aria-hidden="true">+</em></summary>
            <div className="price-list__body">
              {section.items.map((item) => (
                <div className="price-list__row" key={item.n}><span>{item.n}</span><b>{item.name}</b><i>{item.unit}</i><strong>{item.price ? `от ${money(item.price)} ₽` : item.note}</strong></div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

export default function Price() {
  const ref = useReveal()
  const [selected, setSelected] = useState({})
  const toggle = (item) => setSelected((prev) => {
    const next = { ...prev }
    if (next[item.n] !== undefined) delete next[item.n]
    else next[item.n] = 1
    return next
  })
  const setQty = (key, raw) => setSelected((prev) => ({ ...prev, [key]: Math.max(0, Number(raw) || 0) }))

  return (
    <>
      <ScrollScene startScene={3} />
      <main className="page" ref={ref}>
        <section className="section price" data-nav="/price" data-scene={3}>
          <div className="container">
            <FullPriceList />
            <PriceCalculator selected={selected} onToggle={toggle} onQty={setQty} />
            <section className="terms reveal" aria-labelledby="terms-title">
              <h2 className="terms__title" id="terms-title">Условия сотрудничества</h2>
              <dl className="terms__list">{PRICE_TERMS.map((term) => <div className="terms__row" key={term.label}><dt>{term.label}</dt><dd>{term.value}</dd></div>)}</dl>
              <p className="terms__note">{PRICE_META.vat}. Прайс действителен до {PRICE_META.validUntil}. <a href={PRICE_META.pdf} download target="_blank" rel="noopener noreferrer">Скачать PDF-версию</a></p>
            </section>
          </div>
        </section>
      </main>
    </>
  )
}
