import { ArrowUpRight, MessageCircle, Users } from 'lucide-react'

const siteUrl = 'https://esconvosjuventud-creator.github.io/rincon-te-escucha/'
const shareText = `💛 ¡Conocé Rincón Te Escucha! Un espacio de la Oficina de la Juventud de Flores para compartir ideas, propuestas y opiniones. Tu voz también cuenta. Entrá acá: ${siteUrl}`
const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`

export function ShareSection() {
  return (
    <section id="compartir" className="bg-pale/70 py-12 sm:py-16" aria-labelledby="compartir-titulo">
      <div className="container-rte">
        <div className="flex flex-col items-start gap-6 rounded-4xl border border-sky/25 bg-white p-6 shadow-soft sm:p-9 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-navy"><Users size={18} aria-hidden="true" /> Sumemos más voces</span>
            <h2 id="compartir-titulo" className="mt-3 text-3xl font-black leading-tight tracking-tight text-navy sm:text-4xl">Compartí Rincón Te Escucha</h2>
            <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">Invitá a otras juventudes de Flores a contar sus ideas. Al tocar el botón se abrirá WhatsApp con un mensaje y el enlace a esta página, listo para enviar.</p>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex min-h-14 w-full shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#128C42] px-6 py-4 text-center text-base font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#0c7134] sm:w-auto">
            <MessageCircle size={22} aria-hidden="true" /> Compartir por WhatsApp <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
