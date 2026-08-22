/**
 * Шапка внутренней страницы: заголовок под фиксированной навигацией.
 */
export default function PageHead({ title, lead, children }) {
  return (
    <section className="page-head">
      <div className="container">
        <div className="page-head__inner reveal">
          <h1 className="page-head__title">{title}</h1>
          {lead && <p className="section__lead">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
