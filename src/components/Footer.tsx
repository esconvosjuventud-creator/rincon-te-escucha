import { useState } from 'react'
import { BrandLogo } from './BrandLogo'
import { PrivacyModal } from './PrivacyModal'

export function Footer() {
  const [privacy, setPrivacy] = useState(false)
  return (
    <footer className="border-t border-sky/20 bg-white py-10">
      <div className="container-rte grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div><BrandLogo className="h-16 w-auto max-w-full object-contain object-left" /><p className="mt-4 max-w-md font-bold text-navy">Oficina de la Juventud<br />Intendencia Departamental de Flores</p><p className="mt-3 text-sm text-slate-500">Más jóvenes. Más comunidad. Más oportunidades.</p></div>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-black text-ink md:justify-end"><a href="#inicio">Inicio</a><a href="#tu-idea">Tu idea</a><a href="#recursos">Recursos</a><button onClick={() => setPrivacy(true)}>Privacidad</button><a href="#contacto">Contacto</a></div>
      </div>
      <PrivacyModal open={privacy} onClose={() => setPrivacy(false)} />
    </footer>
  )
}
