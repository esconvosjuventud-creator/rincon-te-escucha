import { Check, ChevronLeft, ChevronRight, Heart, LoaderCircle, Send, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AGE_RANGES, CATEGORIES, LOCATIONS, PARTICIPATION_OPTIONS } from '../lib/constants'
import { submitProposal } from '../services/proposals'
import type { YouthProposalInsert } from '../types'
import { SectionTitle } from '../components/SectionTitle'
import { PrivacyModal } from '../components/PrivacyModal'

const initial = {
  age_range: '', location: '', category: '', proposal: '', importance: '', implementation_idea: '',
  wants_to_participate: '', contact_requested: false, name: '', email: '', phone: '', consent: false, website: ''
}

type FormState = typeof initial

type Errors = Partial<Record<keyof FormState, string>>

export function ProposalForm() {
  const [form, setForm] = useState<FormState>(initial)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')
  const [privacyOpen, setPrivacyOpen] = useState(false)

  const progress = useMemo(() => `${Math.round((step / 3) * 100)}%`, [step])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function validateStep(currentStep: number) {
    const next: Errors = {}
    if (currentStep === 1) {
      if (!form.category) next.category = 'Elegí un tema para tu propuesta.'
    }
    if (currentStep === 2) {
      if (!form.proposal.trim()) next.proposal = 'Contanos tu idea para poder enviarla.'
      if (form.proposal.trim().length > 1500) next.proposal = 'Tu idea puede tener hasta 1500 caracteres.'
      if (form.importance.length > 1200) next.importance = 'Este campo puede tener hasta 1200 caracteres.'
      if (form.implementation_idea.length > 1200) next.implementation_idea = 'Este campo puede tener hasta 1200 caracteres.'
    }
    if (currentStep === 3) {
      if (!form.consent) next.consent = 'Necesitamos que marques esta casilla para enviar la propuesta.'
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Revisá el formato del email.'
      if (form.name.length > 120) next.name = 'El nombre es demasiado largo.'
      if (form.phone.length > 60) next.phone = 'El celular es demasiado largo.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function nextStep() {
    if (!validateStep(step)) return
    setStep((s) => Math.min(3, s + 1))
    document.getElementById('tu-idea')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!validateStep(3) || loading) return
    setServerError('')
    if (form.website) return
    const lastSent = Number(localStorage.getItem('rte:lastSent') || 0)
    if (Date.now() - lastSent < 15000) {
      setServerError('Esperá unos segundos antes de enviar otra propuesta.')
      return
    }
    const payload: YouthProposalInsert = {
      age_range: form.age_range || null,
      location: form.location || null,
      category: form.category,
      proposal: form.proposal.trim(),
      importance: form.importance.trim() || null,
      implementation_idea: form.implementation_idea.trim() || null,
      wants_to_participate: form.wants_to_participate || null,
      contact_requested: form.contact_requested,
      name: form.contact_requested && form.name.trim() ? form.name.trim() : null,
      email: form.contact_requested && form.email.trim() ? form.email.trim() : null,
      phone: form.contact_requested && form.phone.trim() ? form.phone.trim() : null,
    }
    try {
      setLoading(true)
      await submitProposal(payload)
      localStorage.setItem('rte:lastSent', String(Date.now()))
      setSuccess(true)
    } catch {
      setServerError('Ups, no pudimos enviar tu propuesta. Probá nuevamente en unos minutos.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setForm(initial)
    setStep(1)
    setSuccess(false)
    setErrors({})
    setServerError('')
  }

  if (success) {
    return (
      <section id="tu-idea" className="section-rte bg-gradient-to-b from-pale/60 to-white scroll-mt-24">
        <div className="container-rte">
          <div className="pop-in mx-auto max-w-3xl rounded-[2.5rem] border border-sky/20 bg-white p-8 text-center shadow-soft sm:p-12">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-sunshine text-navy shadow-lg"><Heart size={38} className="fill-white" /></div>
            <p className="mt-6 text-sm font-black uppercase tracking-[.2em] text-sky-700">Idea recibida</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-navy">¡Gracias por compartir tu idea! 💛</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">Escuchar también es construir un mejor mañana. Tu propuesta ya llegó a la Oficina de la Juventud.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={reset} className="focus-ring rounded-2xl bg-navy px-6 py-4 font-black text-white">Enviar otra idea</button>
              <a href="#inicio" className="focus-ring rounded-2xl border-2 border-navy px-6 py-4 font-black text-navy">Volver al inicio</a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="tu-idea" className="section-rte scroll-mt-24 bg-gradient-to-b from-pale/60 to-white">
      <div className="container-rte">
        <SectionTitle align="center" eyebrow="Contanos tu idea" title={<>¿Qué te gustaría <span className="marker">cambiar, crear o mejorar?</span></>}>
          <p>Tu propuesta puede ayudar a construir nuevas actividades, espacios y oportunidades para las juventudes de Flores.</p>
        </SectionTitle>

        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-[2.5rem] border border-sky/20 bg-white shadow-soft">
          <div className="border-b border-sky/15 bg-pale/50 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4 text-sm font-black text-navy"><span>Paso {step} de 3</span><span>{step === 1 ? 'Sobre vos y el tema' : step === 2 ? 'Tu propuesta' : 'Participación y envío'}</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-sunshine transition-all duration-300" style={{ width: progress }} /></div>
            <p className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-600"><ShieldCheck size={16} /> Podés participar sin poner tu nombre.</p>
          </div>

          <form onSubmit={onSubmit} className="p-6 sm:p-8" noValidate>
            <input value={form.website} onChange={(e) => update('website', e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" />

            {step === 1 && (
              <div className="space-y-8 pop-in">
                <div>
                  <label htmlFor="age" className="text-lg font-black text-navy">¿Qué edad tenés? <span className="text-sm font-semibold text-slate-400">Opcional</span></label>
                  <select id="age" value={form.age_range} onChange={(e) => update('age_range', e.target.value)} className="field mt-3">
                    <option value="">Elegir rango</option>{AGE_RANGES.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="location" className="text-lg font-black text-navy">¿De qué localidad sos? <span className="text-sm font-semibold text-slate-400">Opcional</span></label>
                  <select id="location" value={form.location} onChange={(e) => update('location', e.target.value)} className="field mt-3">
                    <option value="">Elegir localidad</option>{LOCATIONS.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>
                <fieldset>
                  <legend className="text-lg font-black text-navy">¿De qué tema trata tu idea? *</legend>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {CATEGORIES.map((category) => {
                      const selected = form.category === category
                      return <button key={category} type="button" onClick={() => update('category', category)} className={`focus-ring min-h-14 rounded-2xl border-2 px-3 py-3 text-sm font-extrabold transition ${selected ? 'border-navy bg-navy text-white' : 'border-slate-100 bg-slate-50 text-navy hover:border-sky hover:bg-pale'}`} aria-pressed={selected}>{selected && <Check size={15} className="mr-1 inline" />}{category}</button>
                    })}
                  </div>
                  {errors.category && <p className="mt-2 text-sm font-bold text-red-700" role="alert">{errors.category}</p>}
                </fieldset>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-7 pop-in">
                <div>
                  <label htmlFor="proposal" className="text-lg font-black text-navy">¿Qué idea, propuesta o cambio te gustaría impulsar? *</label>
                  <textarea id="proposal" value={form.proposal} onChange={(e) => update('proposal', e.target.value)} maxLength={1500} rows={7} className="field mt-3 resize-y" placeholder="Contanos con tus palabras. No tiene que estar perfecta: queremos entender qué te gustaría que pasara." aria-describedby="proposal-count proposal-error" />
                  <div className="mt-2 flex justify-between gap-3 text-sm"><span id="proposal-error" className="font-bold text-red-700" role="alert">{errors.proposal || ''}</span><span id="proposal-count" className="font-bold text-slate-400">{form.proposal.length}/1500</span></div>
                </div>
                <div>
                  <label htmlFor="importance" className="font-black text-navy">¿Por qué pensás que sería importante? <span className="text-sm font-semibold text-slate-400">Opcional</span></label>
                  <textarea id="importance" value={form.importance} onChange={(e) => update('importance', e.target.value)} maxLength={1200} rows={4} className="field mt-3 resize-y" placeholder="¿A quiénes ayudaría? ¿Qué mejoraría?" />
                  {errors.importance && <p className="mt-2 text-sm font-bold text-red-700">{errors.importance}</p>}
                </div>
                <div>
                  <label htmlFor="implementation" className="font-black text-navy">¿Cómo te imaginás que podría hacerse? <span className="text-sm font-semibold text-slate-400">Opcional</span></label>
                  <textarea id="implementation" value={form.implementation_idea} onChange={(e) => update('implementation_idea', e.target.value)} maxLength={1200} rows={4} className="field mt-3 resize-y" placeholder="Podés contar un primer paso, un lugar, una actividad o quiénes podrían sumarse." />
                  {errors.implementation_idea && <p className="mt-2 text-sm font-bold text-red-700">{errors.implementation_idea}</p>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 pop-in">
                <fieldset>
                  <legend className="text-lg font-black text-navy">¿Te gustaría participar si esta idea se lleva adelante?</legend>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {PARTICIPATION_OPTIONS.map((option) => <button key={option} type="button" onClick={() => update('wants_to_participate', option)} className={`focus-ring rounded-2xl border-2 px-4 py-3 font-bold ${form.wants_to_participate === option ? 'border-navy bg-pale text-navy' : 'border-slate-100 bg-white text-slate-600 hover:border-sky'}`} aria-pressed={form.wants_to_participate === option}>{option}</button>)}
                  </div>
                </fieldset>

                <div className="rounded-3xl bg-pale/60 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div><p className="font-black text-navy">¿Querés que podamos contactarte?</p><p className="mt-1 text-sm text-slate-600">Es opcional. Tu idea se puede enviar igual sin estos datos.</p></div>
                    <button type="button" onClick={() => update('contact_requested', !form.contact_requested)} className={`focus-ring relative h-8 w-14 shrink-0 rounded-full transition ${form.contact_requested ? 'bg-navy' : 'bg-slate-300'}`} aria-pressed={form.contact_requested} aria-label="Permitir contacto"><span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${form.contact_requested ? 'left-7' : 'left-1'}`} /></button>
                  </div>
                  {form.contact_requested && (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2"><label htmlFor="name" className="text-sm font-black text-navy">Nombre <span className="font-semibold text-slate-400">Opcional</span></label><input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} maxLength={120} className="field mt-2" autoComplete="name" />{errors.name && <p className="mt-1 text-sm font-bold text-red-700">{errors.name}</p>}</div>
                      <div><label htmlFor="email" className="text-sm font-black text-navy">Email <span className="font-semibold text-slate-400">Opcional</span></label><input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} maxLength={180} className="field mt-2" autoComplete="email" />{errors.email && <p className="mt-1 text-sm font-bold text-red-700">{errors.email}</p>}</div>
                      <div><label htmlFor="phone" className="text-sm font-black text-navy">Celular <span className="font-semibold text-slate-400">Opcional</span></label><input id="phone" inputMode="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} maxLength={60} className="field mt-2" autoComplete="tel" />{errors.phone && <p className="mt-1 text-sm font-bold text-red-700">{errors.phone}</p>}</div>
                    </div>
                  )}
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-3xl border border-slate-200 p-5">
                  <input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#073B5C]" />
                  <span className="text-sm leading-6 text-slate-600">Entiendo que mi propuesta será recibida por la Oficina de la Juventud y podrá utilizarse de forma anónima para conocer las necesidades e intereses de las juventudes.</span>
                </label>
                {errors.consent && <p className="-mt-5 text-sm font-bold text-red-700" role="alert">{errors.consent}</p>}

                <div className="rounded-2xl bg-cream p-4 text-sm leading-6 text-slate-600"><Sparkles size={17} className="mr-2 inline text-amber-500" /><strong className="text-navy">Recordatorio:</strong> no necesitás incluir cédula, dirección particular, datos médicos ni otra información sensible.</div>
                <button type="button" onClick={() => setPrivacyOpen(true)} className="focus-ring text-sm font-black text-ink underline decoration-sunshine decoration-4 underline-offset-4">Leer cómo cuidamos tu privacidad</button>
              </div>
            )}

            {serverError && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800" role="alert">{serverError}</div>}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
              {step > 1 ? <button type="button" onClick={() => setStep((s) => Math.max(1, s - 1))} className="focus-ring inline-flex items-center gap-2 rounded-2xl px-4 py-3 font-black text-navy hover:bg-pale"><ChevronLeft size={18} /> Atrás</button> : <span />}
              {step < 3 ? <button type="button" onClick={nextStep} className="focus-ring inline-flex items-center gap-2 rounded-2xl bg-navy px-6 py-3.5 font-black text-white shadow-lg">Seguir <ChevronRight size={18} /></button> : <button type="submit" disabled={loading} className="focus-ring inline-flex min-w-48 items-center justify-center gap-2 rounded-2xl bg-sunshine px-6 py-4 font-black text-navy shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <><LoaderCircle className="animate-spin" size={19} /> Enviando…</> : <><Send size={18} /> ENVIAR MI IDEA 💛</>}</button>}
            </div>
          </form>
        </div>
      </div>
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </section>
  )
}
