import { SectionTitle } from '../components/SectionTitle'
import img1 from '../assets/campaign-que-es.jpeg'
import img2 from '../assets/campaign-tu-voz.jpeg'
import img3 from '../assets/campaign-acercate.jpeg'

const images = [
  [img1, '¿Qué es el Rincón Te Escucha?'],
  [img2, 'Acá tu voz importa'],
  [img3, 'Acercate al Rincón Te Escucha'],
]

export function CampaignGallery() {
  return (
    <section className="section-rte bg-pale/50">
      <div className="container-rte">
        <SectionTitle align="center" eyebrow="Rincón en acción" title={<>Una identidad hecha para <span className="marker">encontrarnos</span></>}>
          <p>La web continúa la misma campaña visual y el mismo mensaje que acompaña los espacios presenciales.</p>
        </SectionTitle>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {images.map(([src, alt], i) => <figure key={src} className={`overflow-hidden rounded-[2rem] border-[6px] border-white bg-white shadow-soft ${i === 1 ? 'md:-translate-y-4' : ''}`}><img src={src} alt={alt} className="aspect-[4/5] w-full object-cover object-top" /></figure>)}
        </div>
      </div>
    </section>
  )
}
