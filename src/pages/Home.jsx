import ScrollScene from "@/components/ScrollScene"
import Hero from "@/components/Hero"
import ServicesSection from "@/components/ServicesSection"
import { useReveal } from "@/lib/hooks"

export default function Home() {
  const ref = useReveal()

  return (
    <>
      <ScrollScene withVideo startScene={0} />
      <main className="page" ref={ref}>
        <Hero />
        <ServicesSection scene={0} />
      </main>
    </>
  )
}
