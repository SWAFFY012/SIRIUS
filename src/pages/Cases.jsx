import ScrollScene from "@/components/ScrollScene"
import PageHead from "@/components/PageHead"
import CaseCarousel from "@/components/CaseCarousel"
import { CASES } from "@/data/cases"
import { useReveal } from "@/lib/hooks"

export default function Cases() {
  const ref = useReveal()

  return (
    <>
      <ScrollScene startScene={2} />
      <main className="page" ref={ref}>
        <PageHead title="Кейсы" />

        <div className="cases">
          {CASES.map((item, index) => (
            <section
              className="case" data-nav="/cases"
              key={item.id}
              data-scene={2 + (index % 4)}
              aria-labelledby={`case-${item.id}`}
            >
              <div className="container">
                <header className="case__head reveal">
                  <h2 className="case__title" id={`case-${item.id}`}>
                    {item.title}
                  </h2>
                  <p className="case__region">{item.region}</p>
                </header>
              </div>

              <CaseCarousel
                photos={item.photos}
                title={item.title}
                reverse={index % 2 === 1}
                speed={44 + index * 4}
              />
            </section>
          ))}
        </div>
      </main>
    </>
  )
}
