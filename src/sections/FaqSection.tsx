import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { SectionTitle } from '../components/SectionTitle'
import type { FaqItem } from '../types'

export function FaqSection({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null)
  return (
    <section id="preguntas" className="section-rte scroll-mt-24 bg-white">
      <div className="container-rte grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <SectionTitle eyebrow="Preguntas frecuentes" title={<>Lo importante, <span className="marker">sin vueltas</span></>}>
          <p>Si algo no te queda claro, también podés acercarte y preguntar.</p>
        </SectionTitle>
        <div className="space-y-3">
          {items.map((item) => {
            const active = open === item.id
            return (
              <article key={item.id} className="overflow-hidden rounded-3xl border border-sky/20 bg-white shadow-sm">
                <button onClick={() => setOpen(active ? null : item.id)} className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-black text-navy" aria-expanded={active}>
                  <span>{item.question}</span><ChevronDown className={`shrink-0 transition ${active ? 'rotate-180' : ''}`} />
                </button>
                {active && <div className="border-t border-sky/15 bg-pale/35 px-5 py-5 leading-7 text-slate-600">{item.answer}</div>}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
