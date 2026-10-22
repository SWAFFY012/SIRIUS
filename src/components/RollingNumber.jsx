const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

/**
 * Число, у которого цифры прокручиваются к новому значению, как на счётчике.
 * Ширина каждой цифры фиксирована, поэтому соседние элементы не дёргаются.
 * Новые разряды выезжают слева. Для скринридеров — обычный текст.
 */
export default function RollingNumber({ value }) {
  const text = Math.round(value).toLocaleString("ru-RU")
  const chars = [...text]

  return (
    <span className="roll">
      <span className="visually-hidden">{text}</span>
      <span className="roll__track" aria-hidden="true">
        {chars.map((char, index) => {
          // ключ от правого края: при росте числа новый разряд добавляется слева
          const key = chars.length - index
          if (!/\d/.test(char)) return <span key={key} className="roll__sep">{char}</span>
          return (
            <span key={key} className="roll__digit">
              <span className="roll__strip" style={{ "--digit": Number(char) }}>
                {DIGITS.map((digit) => <span key={digit}>{digit}</span>)}
              </span>
            </span>
          )
        })}
      </span>
    </span>
  )
}
