import ScrollScene from "@/components/ScrollScene"
import ServicesSection from "@/components/ServicesSection"
import PageHead from "@/components/PageHead"
import { useReveal } from "@/lib/hooks"

export default function Services() {
  const ref = useReveal()

  return (
    <>
      <ScrollScene startScene={1} />
      <main className="page page--tight" ref={ref}>
        <PageHead title="Услуги компании" />
        <ServicesSection scene={1} withHeading={false} />
      </main>
    </>
  )
}
