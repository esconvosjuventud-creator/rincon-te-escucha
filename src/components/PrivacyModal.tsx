import { X, ShieldCheck } from 'lucide-react'
import { useEffect } from 'react'

export function PrivacyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-navy/65 p-4" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-4xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pale text-ink"><ShieldCheck /></span>
            <div><p className="text-sm font-black uppercase tracking-wider text-sky-700">Tu privacidad</p><h2 id="privacy-title" className="text-3xl font-black text-navy">Podés participar sin poner tu nombre.</h2></div>
          </div>
          <button onClick={onClose} className="focus-ring rounded-xl p-2" aria-label="Cerrar"><X /></button>
        </div>
        <div className="mt-6 space-y-5 text-slate-600">
          <p>Rincón Te Escucha reúne ideas e intereses de adolescentes y jóvenes para orientar acciones de la Oficina de la Juventud.</p>
          <div><h3 className="font-black text-navy">¿Qué guardamos?</h3><p>Tu rango de edad, localidad, tema y el texto de tu propuesta. Nombre, email y celular son opcionales y solo aparecen si elegís compartirlos.</p></div>
          <div><h3 className="font-black text-navy">¿Para qué?</h3><p>Para conocer necesidades e intereses, analizar tendencias y evaluar propuestas de actividades, espacios y oportunidades.</p></div>
          <div><h3 className="font-black text-navy">¿Se publica lo que escribo?</h3><p>No. Las propuestas no se publican automáticamente. El acceso a los mensajes completos queda restringido al equipo autorizado.</p></div>
          <div><h3 className="font-black text-navy">Datos que no pedimos</h3><p>No solicitamos cédula, dirección particular, fecha de nacimiento exacta ni información médica.</p></div>
        </div>
        <button onClick={onClose} className="focus-ring mt-8 w-full rounded-2xl bg-navy px-5 py-3.5 font-black text-white">Entendido</button>
      </div>
    </div>
  )
}
