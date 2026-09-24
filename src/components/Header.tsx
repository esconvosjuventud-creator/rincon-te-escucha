import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { BrandLogo } from './BrandLogo'

const links = [
  ['Inicio', '#inicio'],
  ['Tu idea', '#tu-idea'],
  ['Recursos', '#recursos'],
  ['Guías', '#guias'],
  ['Preguntas frecuentes', '#preguntas'],
  ['Contacto', '#contacto'],
]

export function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b border-sky/15 bg-white/95 backdrop-blur">
      <div className="container-rte flex h-20 items-center justify-between gap-4">
        <a href="#inicio" className="focus-ring flex min-w-0 items-center gap-2 rounded-xl" aria-label="Ir al inicio">
          <span className="relative block h-16 w-24 shrink-0 overflow-hidden sm:hidden" aria-hidden="true">
            <BrandLogo className="absolute -left-3 -top-4 h-[94px] w-auto max-w-none" />
          </span>
          <span className="max-w-24 text-[11px] font-black uppercase leading-[1.1] text-navy sm:hidden" aria-hidden="true">
            Oficina de la Juventud<br />Flores
          </span>
          <BrandLogo className="hidden h-16 w-auto sm:block" />
        </a>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="focus-ring rounded-xl px-3 py-2 text-sm font-bold text-ink transition hover:bg-pale">
              {label}
            </a>
          ))}
        </nav>
        <a href="#tu-idea" className="focus-ring hidden rounded-full bg-navy px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-ink sm:inline-flex lg:hidden xl:inline-flex">
          Contanos tu idea
        </a>
        <button className="focus-ring rounded-xl p-2.5 text-navy lg:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="rte-mobile-nav" aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav id="rte-mobile-nav" className="border-t border-sky/15 bg-white px-4 pb-5 pt-3 lg:hidden" aria-label="Navegación móvil">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="focus-ring rounded-xl px-4 py-3 font-bold text-navy hover:bg-pale">
                {label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
