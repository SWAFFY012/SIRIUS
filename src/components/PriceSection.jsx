const money = (value) => Math.round(value).toLocaleString("ru-RU")

/**
 * Один раздел прайса: слева перечень работ, справа калькулятор этого
 * раздела. Клик по строке подсвечивает её и добавляет в расчёт.
 */
export default function PriceSection({ section, selected, onToggle, onQty, scene }) {
  const picked = section.items.filter((item) => selected[item.n] !== undefined)
  const total = picked.reduce((acc, item) => acc + item.price * selected[item.n], 0)

  return (
    <article className="price-block reveal" id={section.id} data-scene={scene}>
      <header className="price-block__head">
        <span className="price-block__num">{section.num}</span>
        <h2>{section.title}</h2>
      </header>

      <div className="price-block__grid">
        <div className="price-block__table-wrap">
          <table className="price-table">
            <caption className="visually-hidden">{section.title}</caption>
            <thead>
              <tr>
                <th scope="col" className="price-table__n">
                  №
                </th>
                <th scope="col">Наименование работ</th>
                <th scope="col" className="price-table__unit">
                  {section.unitLabel || "Ед. изм."}
                </th>
                <th scope="col" className="price-table__price">
                  Цена от, ₽
                </th>
              </tr>
            </thead>
            <tbody>
              {section.items.map((item) => {
                const active = selected[item.n] !== undefined
                const selectable = Boolean(item.price)
                return (
                  <tr
                    key={item.n}
                    className={`${active ? "is-picked" : ""}${selectable ? "" : " is-static"}`}
                    onClick={selectable ? () => onToggle(item) : undefined}
                    role={selectable ? "button" : undefined}
                    tabIndex={selectable ? 0 : undefined}
                    aria-pressed={selectable ? active : undefined}
                    onKeyDown={
                      selectable
                        ? (event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault()
                              onToggle(item)
                            }
                          }
                        : undefined
                    }
                  >
                    <td className="price-table__n">{item.n}</td>
                    <td>{item.name}</td>
                    <td className="price-table__unit">{item.unit}</td>
                    <td className="price-table__price">
                      {item.price ? money(item.price) : item.note}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <aside className="mini-calc" aria-live="polite">
          <div className="mini-calc__inner">
            <span className="mini-calc__label">Расчёт по разделу</span>

            {picked.length === 0 ? (
              <p className="mini-calc__empty">
                Нажмите на строку в таблице — работа добавится в расчёт.
              </p>
            ) : (
              <ul className="mini-calc__list">
                {picked.map((item) => (
                  <li key={item.n}>
                    <span className="mini-calc__name">{item.name}</span>
                    <span className="mini-calc__controls">
                      <label>
                        <span className="visually-hidden">Объём, {item.unit}</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          inputMode="numeric"
                          value={selected[item.n]}
                          onChange={(event) => onQty(item.n, event.target.value)}
                        />
                      </label>
                      <i>{item.unit}</i>
                      <b>{money(item.price * selected[item.n])} ₽</b>
                      <button
                        type="button"
                        className="mini-calc__remove"
                        onClick={() => onToggle(item)}
                        aria-label={`Убрать из расчёта: ${item.name}`}
                      >
                        ×
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mini-calc__sum">
              <span>Итого по разделу</span>
              <b>{money(total)} ₽</b>
            </div>
          </div>
        </aside>
      </div>
    </article>
  )
}
