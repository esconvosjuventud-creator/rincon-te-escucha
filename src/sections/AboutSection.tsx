import { Heart, MessageCircle, Ear, UsersRound } from 'lucide-react'
import { SectionTitle } from '../components/SectionTitle'

const cards = [
  { title: 'HABLAR', text: 'Un lugar donde podés contar lo que pensás.', icon: MessageCircle, tone: 'bg-pale' },
  { title: 'EXPRESARTE', text: 'Tus ideas y opiniones también importan.', icon: Heart, tone: 'bg-cream' },
  { title: 'COMPARTIR', text: 'Encontrarnos también ayuda a construir comunidad.', icon: UsersRound, tone: 'bg-mint/55' },
  { title: 'SER ESCUCHADO/A', text: 'Queremos conocer qué necesitás y qué proponés.', icon: Ear, tone: 'bg-lilac/50' },
]

export function AboutSection() {
  return (
    <section id="que-es" className="section-rte bg-white">
      <div className="container-rte">
        <SectionTitle eyebrow="¿Qué es Rincón Te Escucha?" title={<>Un lugar para <span className="marker">encontrarnos</span></>}>
          <p>Rincón Te Escucha es una propuesta de la Oficina de la Juventud de la Intendencia Departamental de Flores para generar espacios donde adolescentes y jóvenes puedan encontrarse, conversar, expresarse, compartir ideas y participar.</p>
        </SectionTitle>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ title, text, icon: Icon, tone }) => (
            <article key={title} className={`rounded-4xl p-6 ${tone} border border-white/70 transition hover:-translate-y-1 hover:shadow-soft`}>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-navy shadow-sm"><Icon size={28} /></span>
              <h3 className="mt-5 text-lg font-black text-navy">{title}</h3>
              <p className="mt-2 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
