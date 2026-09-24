import { SectionTitle } from '../components/SectionTitle'
import { Ear, HandHeart, Heart, Lightbulb, Smile, UsersRound } from 'lucide-react'

const values = [
  { label: 'Escucha', icon: Ear, color: 'bg-pale' },
  { label: 'Respeto', icon: UsersRound, color: 'bg-cream' },
  { label: 'Confianza', icon: Smile, color: 'bg-pale' },
  { label: 'Acompañamiento', icon: HandHeart, color: 'bg-blush/45' },
  { label: 'Expresión', icon: Lightbulb, color: 'bg-mint/55' },
  { label: 'Participación', icon: Heart, color: 'bg-lilac/55' },
]

export function VoiceValues() {
  return (
    <section className="section-rte bg-pale/55">
      <div className="container-rte">
        <SectionTitle align="center" eyebrow="Tu voz importa" title={<>Acá hay lugar para <span className="marker">lo que pensás</span></>}>
          <p>No necesitás tener una respuesta preparada. Podés acercarte, conversar, compartir una idea, contar qué pensás o simplemente participar.</p>
        </SectionTitle>
        <div className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {values.map(({ label, icon: Icon, color }) => (
            <div key={label} className={`flex items-center gap-4 rounded-3xl ${color} p-5 font-black text-navy`}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white shadow-sm"><Icon /></span>{label}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-3xl rounded-4xl bg-navy p-7 text-center text-white shadow-soft sm:p-9">
          <p className="text-sm font-black uppercase tracking-[.2em] text-sunshine">Rincón Te Escucha</p>
          <p className="mt-2 text-3xl font-black">UN ESPACIO SEGURO PARA VOS.</p>
        </div>
      </div>
    </section>
  )
}
