import { BookOpen, BriefcaseBusiness, HeartHandshake, Laptop, Rocket, UsersRound, WalletCards, X, Bookmark } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SectionTitle } from '../components/SectionTitle'
import { RESOURCE_CATEGORIES, WELLBEING_NOTICE } from '../lib/constants'
import type { Resource } from '../types'

const icons = { BookOpen, BriefcaseBusiness, HeartHandshake, Laptop, Rocket, UsersRound, WalletCards }

type IconName = keyof typeof icons

export function ResourcesSection({ resources }: { resources: Resource[] }) {
  const [filter, setFilter] = useState<string>('TODAS')
  const [selected, setSelected] = useState<Resource | null>(null)
  const filtered = useMemo(() => filter === 'TODAS' ? resources : resources.filter((r) => r.category === filter), [resources, filter])

  return (
    <section id="recursos" className="section-rte scroll-mt-24 bg-white">
      <div id="guias" className="container-rte scroll-mt-24">
        <SectionTitle eyebrow="Un rincón para vos" title={<>Tips, herramientas y <span className="marker">guías útiles</span></>}>
          <p>Contenido corto y práctico para estudio, trabajo, dinero, bienestar, participación, tecnología y emprendimientos.</p>
        </SectionTitle>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2" aria-label="Filtrar recursos por categoría">
          {['TODAS', ...RESOURCE_CATEGORIES.map((c) => c.name)].map((name) => (
            <button key={name} onClick={() => setFilter(name)} className={`focus-ring shrink-0 rounded-full px-4 py-2.5 text-sm font-black ${filter === name ? 'bg-navy text-white' : 'bg-pale text-navy hover:bg-sky/30'}`} aria-pressed={filter === name}>{name}</button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => {
            const Icon = icons[(resource.icon || 'BookOpen') as IconName] || BookOpen
            return (
              <article key={resource.id} className="card-rte flex min-h-72 flex-col transition hover:-translate-y-1">
                <div className="flex items-start justify-between gap-3"><span className="grid h-13 w-13 place-items-center rounded-2xl bg-pale p-3 text-navy"><Icon /></span><span className="rounded-full bg-cream px-3 py-1 text-[11px] font-black tracking-wide text-navy">{resource.category}</span></div>
                <h3 className="mt-5 text-2xl font-black tracking-tight text-navy">{resource.title}</h3>
                <p className="mt-3 flex-1 leading-7 text-slate-600">{resource.summary}</p>
                <button onClick={() => setSelected(resource)} className="focus-ring mt-5 inline-flex items-center gap-2 self-start rounded-xl font-black text-ink underline decoration-sunshine decoration-4 underline-offset-4">Abrir guía <span aria-hidden="true">→</span></button>
              </article>
            )
          })}
        </div>

        <p className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">{WELLBEING_NOTICE}</p>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-navy/70 p-4" role="dialog" aria-modal="true" aria-labelledby="resource-title">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-4xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><span className="eyebrow">{selected.category}</span><h2 id="resource-title" className="mt-4 text-3xl font-black tracking-tight text-navy sm:text-4xl">{selected.title}</h2></div>
              <button onClick={() => setSelected(null)} className="focus-ring rounded-xl p-2" aria-label="Cerrar guía"><X /></button>
            </div>
            <div className="mt-6 space-y-4 text-base leading-8 text-slate-600">
              {selected.content.split('\n').filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            <div className="mt-7 flex items-center gap-2 rounded-2xl bg-cream p-4 text-sm font-bold text-navy"><Bookmark size={18} /> Guardá este consejo o compartilo con alguien a quien le pueda servir.</div>
            <button onClick={() => setSelected(null)} className="focus-ring mt-7 w-full rounded-2xl bg-navy px-5 py-3.5 font-black text-white">Listo</button>
          </div>
        </div>
      )}
    </section>
  )
}
