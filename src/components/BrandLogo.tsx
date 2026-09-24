import logo from '../assets/logo-es-con-vos.png'

export function BrandLogo({ className = '' }: { className?: string }) {
  return <img src={logo} alt="#Es Con Vos – Oficina de la Juventud – Intendencia de Flores" className={className} />
}
