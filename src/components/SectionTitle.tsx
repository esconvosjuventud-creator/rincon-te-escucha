import type { ReactNode } from 'react'

export function SectionTitle({ eyebrow, title, children, align = 'left' }: { eyebrow?: string; title: ReactNode; children?: ReactNode; align?: 'left' | 'center' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="title-display mt-5">{title}</h2>
      {children && <div className="mt-5 text-lg leading-8 text-slate-600">{children}</div>}
    </div>
  )
}
