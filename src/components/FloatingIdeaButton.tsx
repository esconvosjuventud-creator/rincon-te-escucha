import { MessageCircle } from 'lucide-react'

export function FloatingIdeaButton() {
  return (
    <a href="#tu-idea" className="focus-ring fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3.5 text-sm font-black text-white shadow-2xl transition hover:-translate-y-1 sm:bottom-6 sm:right-6" aria-label="Ir al formulario para contar una idea">
      <MessageCircle size={19} /> <span className="hidden sm:inline">Contanos tu idea</span><span className="sm:hidden">Tu idea</span>
    </a>
  )
}
