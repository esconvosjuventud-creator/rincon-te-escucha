import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { contestConfig as c, contestState } from './config'
export function ContestBanner() {
  const [now,setNow]=useState(new Date())
  useEffect(()=>{const id=setInterval(()=>setNow(new Date()),30000);return()=>clearInterval(id)},[])
  return <aside className="mx-auto my-8 max-w-6xl rounded-3xl bg-navy p-7 text-white"><p className="text-sm font-bold uppercase tracking-wider">{contestState(now)==='open'?'Inscripciones abiertas':contestState(now)==='upcoming'?'Próximamente':'Convocatoria finalizada'}</p><h2 className="mt-2 text-3xl font-black">Diseñá la identidad de las Mujeres Rurales de Flores</h2><p className="my-4">Libre · Gratuito · Sin límite de edad · Premio {c.prize}</p><Link to={c.route} className="focus-ring inline-block rounded-xl bg-sunshine px-6 py-3 font-black text-navy">Conocé el concurso →</Link></aside>
}
