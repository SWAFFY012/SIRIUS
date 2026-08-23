import { SERVICES } from "@/data/services"
import ServiceCard from "@/components/ServiceCard"

/** Секция услуг с четырьмя адаптивными карточками и полными сметами. */
export default function ServicesSection({ scene = 0, withHeading = true }) {
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
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
