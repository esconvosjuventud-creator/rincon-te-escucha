import { Clock3, Instagram, Mail, MapPin, MessageCircle } from 'lucide-react'
import { SectionTitle } from '../components/SectionTitle'

export function ContactSection({ settings }: { settings: Record<string, string> }) {
  const rows = [
    ['location', 'Ubicación', MapPin],
    ['hours', 'Horarios', Clock3],
    ['whatsapp', 'WhatsApp', MessageCircle],
    ['email', 'Email', Mail],
    ['instagram', 'Instagram', Instagram],
  ] as const
  const available = rows.filter(([key]) => Boolean(settings[key]?.trim()))
  return (
    <section id="contacto" className="section-rte scroll-mt-24 bg-navy text-white">
      <div className="container-rte grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center">
        <div>
          <SectionTitle eyebrow="¿Preferís hablar?" title={<span className="text-white">También podés acercarte.</span>}>
            <p className="text-white/75">La Oficina de la Juventud también es un espacio presencial para conversar, consultar y participar.</p>
          </SectionTitle>
          <p className="mt-6 text-lg font-black text-sunshine">Oficina de la Juventud · Intendencia Departamental de Flores</p>
        </div>
        <div className="rounded-[2rem] bg-white/10 p-6 backdrop-blur sm:p-8">
          {available.length ? <div className="space-y-4">{available.map(([key, label, Icon]) => <div key={key} className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10"><Icon size={20} /></span><div><p className="text-xs font-black uppercase tracking-wider text-sky">{label}</p><p className="mt-1 font-bold text-white">{settings[key]}</p></div></div>)}</div> : <div><p className="text-xl font-black">Información de contacto</p><p className="mt-3 leading-7 text-white/70">Los datos de ubicación, horarios, WhatsApp, email e Instagram se administran desde la configuración del proyecto para publicar únicamente información oficial verificada.</p></div>}
        </div>
      </div>
    </section>
  )
}
