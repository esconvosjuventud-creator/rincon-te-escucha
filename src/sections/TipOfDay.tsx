import { Lightbulb } from 'lucide-react'
import type { Tip } from '../types'

export function TipOfDay({ tips }: { tips: Tip[] }) {
  const day = Math.floor(Date.now() / 86400000)
  const tip = tips.length ? tips[day % tips.length] : null
  if (!tip) return null
  return (
    <section className="bg-white pb-16 sm:pb-20">
      <div className="container-rte">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-sunshine p-7 text-navy shadow-soft sm:p-10">
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full border-[22px] border-white/30" />
          <div className="relative z-10 flex max-w-4xl flex-col gap-5 sm:flex-row sm:items-center">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-white text-navy shadow-sm"><Lightbulb size={30} /></span>
            <div><p className="text-sm font-black uppercase tracking-[.22em]">Tip del día 💡</p><p className="mt-2 text-2xl font-black leading-tight sm:text-3xl">“{tip.text}”</p></div>
          </div>
        </div>
      </div>
    </section>
  )
}
