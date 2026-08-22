import { Link } from "react-router-dom"
import { SERVICES } from "@/data/services"
import ServiceCard from "@/components/ServiceCard"

/**
 * Секция услуг: четыре карточки квадратом 2×2 и плашка прайс-листа
 * под ними — всё умещается в один экран.
 */
export default function ServicesSection({ scene = 0, withCta = true, withHeading = true }) {
  return (
    <section className="section services" id="services" data-nav="/services" data-scene={scene}>
      <div className="container">
        {withHeading && (
          <header className="section__head reveal">
            <h2 className="section__title">Услуги компании</h2>
            <p className="section__lead">
              Работаем по Санкт-Петербургу и Ленинградской области: от подготовки основания
              до финишного покрытия и благоустройства. Своя техника, договор и гарантия.
            </p>
          </header>
        )}

        <div className="services__grid">
          {/* сверху — услуги с прайс-комплексом, они переворачиваются */}
          {[...SERVICES]
            .sort((a, b) => Number(Boolean(b.flip)) - Number(Boolean(a.flip)))
            .map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
        </div>

        {withCta && (
          <Link to="/price" className="services__price-plate reveal">
            <span className="services__price-body">
              <b>Прайс-лист</b>
              <i>Все разделы работ со стоимостью, калькулятор сметы и условия сотрудничества</i>
            </span>
            <span className="services__price-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        )}
      </div>
    </section>
  )
}
