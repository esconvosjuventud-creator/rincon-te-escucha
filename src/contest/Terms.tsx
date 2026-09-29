import sections from './terms.json'
import { contestConfig, criteria, dateLabel } from './config'
import { track } from './api'
function termsText(text:string) {
  return text.replace(/\{\{(\w+)\}\}/g,(_,key:string)=>{
    const v=contestConfig[key as keyof typeof contestConfig]
    return key.endsWith('At') || key.startsWith('evaluation')?dateLabel(String(v)):String(v)
  })
}
export function Terms() {
  return <div className="terms"><p className="muted">Versión {contestConfig.termsVersion} · Bases del proyecto institucional.</p><a className="btn secondary" href={`${import.meta.env.BASE_URL}contest/bases.pdf`} download onClick={()=>void track('download')}>Descargar bases en PDF</a>{sections.map(s=><article key={s.title}><h3>{s.title}</h3>{s.paragraphs.map((p,i)=><p key={i}>{termsText(p)}</p>)}</article>)}<h3>Matriz de evaluación</h3><ul>{criteria.map(([label,max])=><li key={label}>{label}: {max} puntos</li>)}</ul><p><strong>Total: 100 puntos.</strong></p></div>
}
