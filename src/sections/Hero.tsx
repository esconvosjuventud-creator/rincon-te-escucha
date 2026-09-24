import { ArrowRight, Heart, MessageCircle, Sparkles } from 'lucide-react'
import campaign from '../assets/campaign-que-es.jpeg'

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-b from-white via-pale/50 to-white pt-10 sm:pt-14 lg:pt-20">
      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-sky/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-sunshine/20 blur-3xl" />
      <div className="container-rte grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative z-10 pb-4 lg:pb-14">
          <span className="eyebrow"><MessageCircle size={16} /> Oficina de la Juventud · Flores</span>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-sky/25 bg-white px-4 py-2 text-sm font-extrabold text-ink shadow-sm">
            <Heart size={16} className="fill-sunshine text-sunshine" /> Acá tu voz importa.
          </div>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[.92] tracking-[-.055em] text-navy sm:text-6xl lg:text-7xl">
            RINCÓN <span className="marker">TE ESCUCHA</span>
          </h1>
          <p className="mt-6 max-w-xl text-xl font-extrabold leading-tight text-ink">Un espacio pensado para las juventudes.</p>
          <p className="mt-3 max-w-xl text-lg leading-8 text-slate-600">Queremos generar espacios de cercanía, confianza y participación donde tu voz también sea parte.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#tu-idea" className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-navy px-6 py-4 text-base font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-ink">
              CONTANOS TU IDEA <ArrowRight size={19} />
            </a>
            <a href="#que-es" className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-navy bg-white px-6 py-4 text-base font-black text-navy transition hover:-translate-y-1 hover:bg-pale">
              CONOCÉ EL RINCÓN <Sparkles size={18} />
            </a>
          </div>
          <p className="mt-5 text-sm font-semibold text-slate-500">Podés participar de forma anónima. Dejar tu idea lleva menos de dos minutos.</p>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -left-5 -top-5 z-10 rounded-3xl bg-sunshine px-5 py-3 text-sm font-black text-navy shadow-soft -rotate-3">Tus ideas también suman 💛</div>
          <div className="overflow-hidden rounded-[2.25rem] border-[8px] border-white bg-white shadow-2xl rotate-[1deg]">
            <img src={campaign} alt="Pieza de la campaña Rincón Te Escucha con jóvenes reunidos en un espacio de participación" className="aspect-[4/5] w-full object-cover object-top" />
          </div>
          <div className="float-soft absolute -bottom-5 -right-2 rounded-3xl bg-sky px-5 py-4 font-black text-navy shadow-soft sm:right-4">Hablar también es participar.</div>
        </div>
      </div>
      <div className="container-rte mt-16 grid gap-3 pb-10 sm:grid-cols-3 lg:mt-6">
        {['Escucha sin vueltas', 'Ideas que se transforman', 'Más comunidad'].map((item, idx) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl border border-sky/20 bg-white px-4 py-3 font-extrabold text-navy shadow-sm">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-pale text-sm">{['💬','💡','🙌'][idx]}</span>{item}
          </div>
        ))}
      </div>
    </section>
  )
}
