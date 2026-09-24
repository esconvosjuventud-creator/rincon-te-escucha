import { BriefcaseBusiness, CalendarHeart, GraduationCap, Laptop, Palette, Trophy, UsersRound } from 'lucide-react'
import { SectionTitle } from '../components/SectionTitle'

const items = [
  ['Talleres', GraduationCap], ['Actividades', UsersRound], ['Eventos', CalendarHeart], ['Cultura', Palette], ['Deporte', Trophy], ['Tecnología', Laptop], ['Empleo', BriefcaseBusiness]
] as const

export function IdeasImpact() {
  return (
    <section className="section-rte bg-white">
      <div className="container-rte grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <SectionTitle eyebrow="Ideas que nos ayudan a construir" title={<>Lo que contás puede <span className="marker">abrir caminos</span></>}>
          <p>Las propuestas ayudan a conocer qué temas importan, qué oportunidades faltan y qué actividades pueden tener sentido para las juventudes de Flores.</p>
          <p className="mt-4 text-sm font-bold text-slate-500">Tus mensajes no se publican automáticamente. Analizamos tendencias y propuestas cuidando los datos personales.</p>
        </SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map(([label, Icon], index) => (
            <div key={label} className={`flex items-center gap-4 rounded-3xl p-5 ${index % 3 === 0 ? 'bg-pale' : index % 3 === 1 ? 'bg-cream' : 'bg-mint/45'}`}>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-navy shadow-sm"><Icon size={22} /></span>
              <span className="font-black text-navy">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-4 rounded-3xl bg-navy p-5 text-white sm:col-span-2">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">+</span>
            <span className="font-black">Capacitaciones · espacios juveniles · programas · oportunidades · acciones comunitarias</span>
          </div>
        </div>
      </div>
    </section>
  )
}
