export const contestConfig = {
  title: 'Concurso de Diseño de Logo e Identidad Visual',
  subtitle: 'Día Internacional de las Mujeres Rurales · Flores',
  concept: 'Identidad, raíces y futuro',
  opensAt: '2026-09-28T00:00:00-03:00',
  closesAt: '2026-10-09T23:59:59-03:00',
  evaluationStart: '2026-10-12T00:00:00-03:00',
  evaluationEnd: '2026-10-15T23:59:59-03:00',
  resultAt: '2026-10-18T00:00:00-03:00',
  awardAt: '2026-10-18T00:00:00-03:00',
  prize: 'USD 100', timezone: 'America/Montevideo',
  jury: ['Iliana Garrone', 'Nicolás Lugo', 'Agustín Goday', 'Marisa Ramos', 'María Rosa Curuchet'],
  state: 'automatic' as 'automatic' | 'closed',
  route: '/concurso-mujeres-rurales',
  url: 'https://esconvosjuventud-creator.github.io/rincon-te-escucha/concurso-mujeres-rurales',
  contact: 'Oficina de la Juventud · Intendencia Departamental de Flores',
  contactPath: '/#contacto', bucket: 'rural-women-contest-2026',
  maxFileBytes: 10 * 1024 * 1024, termsVersion: '2026-09-28',
  mimeTypes: ['image/png', 'image/jpeg', 'application/pdf'],
}
export const criteria = [
  ['Representación de las Mujeres Rurales', 20], ['Originalidad y creatividad', 15],
  ['Identidad territorial y vínculo con Flores', 15], ['Pertinencia', 10],
  ['Calidad conceptual', 10], ['Impacto y calidad visual', 10], ['Legibilidad', 5],
  ['Simplicidad', 5], ['Versatilidad', 5], ['Aplicación institucional', 5],
] as const
export const departments = ['Artigas','Canelones','Cerro Largo','Colonia','Durazno','Flores','Florida','Lavalleja','Maldonado','Montevideo','Paysandú','Río Negro','Rivera','Rocha','Salto','San José','Soriano','Tacuarembó','Treinta y Tres']
export const creativeTools = ['Dibujo manual','Ilustración digital','Canva','Adobe Illustrator','Adobe Photoshop','Otra aplicación de diseño','Aplicación móvil','Inteligencia artificial','Otra']
export const statuses: Record<string,string> = {received:'Recibida',under_review:'En revisión',valid:'Válida',needs_review:'Requiere revisión',excluded:'Excluida',evaluated:'Evaluada',winner:'Ganadora',special_mention:'Mención especial'}
export function contestState(now = new Date(), published = false) {
  if (published) return 'result'
  if (contestConfig.state === 'closed') return 'closed'
  if (now < new Date(contestConfig.opensAt)) return 'upcoming'
  if (now <= new Date(contestConfig.closesAt)) return 'open'
  return 'evaluation'
}
export function dateLabel(date: string) { return new Date(date).toLocaleDateString('es-UY',{day:'numeric',month:'long',year:'numeric',timeZone:contestConfig.timezone}) }
export function ageAt(birth: string, now = new Date()) {
  const today = now.toLocaleDateString('en-CA',{timeZone:contestConfig.timezone})
  const [y,m,d] = birth.split('-').map(Number), [ty,tm,td] = today.split('-').map(Number)
  return ty-y-Number(tm<m || (tm===m && td<d))
}
export function safeUrl(value: string) { try { const u = new URL(value); return ['https:','http:'].includes(u.protocol) && !u.username && !u.password } catch { return false } }
export function wordCount(value: string) { return value.trim().split(/\s+/).filter(Boolean).length }
export type Entry = {
  full_name:string; birth_date:string; age:string; city:string; department:string; phone:string; email:string;
  proposal_name:string; proposal_description:string; palette:string; submission_method:'file'|'link';
  external_main_url:string; external_complementary_url:string; tools_used:string[]; ai_details:string;
  guardian_name:string; guardian_document:string; guardian_phone:string; guardian_email:string;
  guardian_accepted:boolean; authorship_accepted:boolean; rights_accepted:boolean; terms_accepted:boolean; institutional_use_accepted:boolean;
}
export const emptyEntry: Entry = {full_name:'',birth_date:'',age:'',city:'',department:'Flores',phone:'',email:'',proposal_name:'',proposal_description:'',palette:'',submission_method:'file',external_main_url:'',external_complementary_url:'',tools_used:[],ai_details:'',guardian_name:'',guardian_document:'',guardian_phone:'',guardian_email:'',guardian_accepted:false,authorship_accepted:false,rights_accepted:false,terms_accepted:false,institutional_use_accepted:false}
export function isMinor(e: Entry, now = new Date()) { return ageAt(e.birth_date,now)<18 || Number(e.age)<18 }
export function validateEntry(e: Entry, step?: number, now = new Date()): Record<string,string> {
  const errors:Record<string,string> = {}
  const required = (key:keyof Entry, message='Completá este campo.') => { if(typeof e[key] !== 'string' || !(e[key] as string).trim()) errors[key]=message }
  const check = (n:number) => step === undefined || step === n
  if(check(0)) {
    ;(['full_name','birth_date','age','city','department','phone','email'] as const).forEach(k=>required(k))
    const birth = new Date(e.birth_date+'T12:00:00Z')
    if(!/^\d{4}-\d{2}-\d{2}$/.test(e.birth_date) || !Number.isFinite(birth.getTime()) || !Number.isFinite(ageAt(e.birth_date,now)) || ageAt(e.birth_date,now)<0 || birth.toISOString().slice(0,10)!==e.birth_date) errors.birth_date='Ingresá una fecha de nacimiento válida.'
    if(!/^\d+$/.test(String(e.age)) || Number(e.age)<0 || Number(e.age)>130) errors.age='Revisá la edad.'
    if(!departments.includes(e.department)) errors.department='Seleccioná un departamento.'
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)) errors.email='Ingresá un correo válido.'
    if(e.phone.replace(/\D/g,'').length<6) errors.phone='Ingresá un teléfono válido.'
  }
  if(check(1)) {required('proposal_description');required('palette');if(wordCount(e.proposal_description)>500) errors.proposal_description='Usá hasta 500 palabras.'}
  if(check(2)) {
    if(!['file','link'].includes(e.submission_method)) errors.submission_method='Elegí una modalidad.'
    if(e.submission_method==='link' && !safeUrl(e.external_main_url)) errors.external_main_url='Ingresá un enlace http o https válido.'
    if(e.submission_method==='link' && e.external_complementary_url && !safeUrl(e.external_complementary_url)) errors.external_complementary_url='Revisá el enlace complementario.'
  }
  if(check(3)) {if(!e.tools_used.length || e.tools_used.some(t=>!creativeTools.includes(t))) errors.tools_used='Seleccioná las herramientas utilizadas.';if(e.tools_used.includes('Inteligencia artificial')) required('ai_details')}
  if(check(4) && isMinor(e,now)) {
    ;(['guardian_name','guardian_document','guardian_phone','guardian_email'] as const).forEach(k=>required(k))
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.guardian_email)) errors.guardian_email='Ingresá un correo válido.'
    if(e.guardian_phone.replace(/\D/g,'').length<6) errors.guardian_phone='Ingresá un teléfono válido.'
    if(e.guardian_accepted!==true) errors.guardian_accepted='Necesitás la autorización del adulto responsable.'
  }
  if(check(5)) (['authorship_accepted','rights_accepted','terms_accepted','institutional_use_accepted'] as const).forEach(k=>{if(e[k]!==true)errors[k]='Esta declaración es obligatoria.'})
  Object.entries(e).forEach(([k,v])=>{if(typeof v==='string' && v.length>(k==='proposal_description'?15000:2000)) errors[k]='El texto es demasiado largo.'})
  return errors
}
