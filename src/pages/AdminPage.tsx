import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { BarChart3, Eye, Filter, LoaderCircle, LogOut, MessageCircle, RefreshCw, Search, ShieldCheck, UsersRound, X } from 'lucide-react'
import { BrandLogo } from '../components/BrandLogo'
import { CATEGORIES, STATUS_LABELS } from '../lib/constants'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { getAdminProposals, isStaffUser, updateProposal } from '../services/proposals'
import type { ProposalStatus, YouthProposal } from '../types'

const statusOptions: ProposalStatus[] = ['new', 'reviewing', 'considered', 'implemented', 'archived']

type SessionState = 'loading' | 'signed-out' | 'checking' | 'ready' | 'denied'

type Filters = { search: string; category: string; age: string; location: string; status: string; from: string; to: string }
const emptyFilters: Filters = { search: '', category: '', age: '', location: '', status: '', from: '', to: '' }

function countBy(items: YouthProposal[], getValue: (p: YouthProposal) => string | null | undefined) {
  const map = new Map<string, number>()
  items.forEach((p) => { const value = getValue(p)?.trim() || 'Sin dato'; map.set(value, (map.get(value) || 0) + 1) })
  return [...map.entries()].sort((a, b) => b[1] - a[1])
}

function MiniBars({ rows }: { rows: [string, number][] }) {
  const max = Math.max(1, ...rows.map((r) => r[1]))
  return <div className="space-y-3">{rows.slice(0, 7).map(([label, value]) => <div key={label}><div className="mb-1 flex items-center justify-between gap-3 text-xs font-bold"><span className="truncate text-slate-600">{label}</span><span className="text-navy">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky" style={{ width: `${Math.max(7, (value / max) * 100)}%` }} /></div></div>)}</div>
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function login(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    if (!supabase) { setError('Supabase no está configurado.'); setLoading(false); return }
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError('No pudimos iniciar sesión. Revisá tus datos.'); setLoading(false); return }
    const allowed = await isStaffUser()
    if (!allowed) { await supabase.auth.signOut(); setError('Tu cuenta no tiene permisos para este panel.'); setLoading(false); return }
    onSuccess(); setLoading(false)
  }

  return (
    <div className="min-h-screen bg-pale/60 px-4 py-10">
      <div className="mx-auto max-w-md rounded-[2rem] bg-white p-7 shadow-soft sm:p-9">
        <BrandLogo className="mx-auto h-16 w-auto max-w-full object-contain" />
        <div className="mt-8 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-pale text-navy"><ShieldCheck /></span><h1 className="mt-4 text-3xl font-black text-navy">Panel del equipo</h1><p className="mt-2 leading-6 text-slate-500">Acceso reservado a personas autorizadas de la Oficina de la Juventud.</p></div>
        <form onSubmit={login} className="mt-7 space-y-4">
          <div><label htmlFor="admin-email" className="text-sm font-black text-navy">Email</label><input id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field mt-2" autoComplete="email" /></div>
          <div><label htmlFor="admin-password" className="text-sm font-black text-navy">Contraseña</label><input id="admin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field mt-2" autoComplete="current-password" /></div>
          {error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-800" role="alert">{error}</p>}
          <button disabled={loading} className="focus-ring flex w-full items-center justify-center gap-2 rounded-2xl bg-navy px-5 py-4 font-black text-white disabled:opacity-60">{loading ? <LoaderCircle className="animate-spin" /> : <ShieldCheck size={19} />} Entrar</button>
        </form>
        <a href={import.meta.env.BASE_URL} className="mt-5 block text-center text-sm font-black text-ink underline decoration-sunshine decoration-4 underline-offset-4">Volver al sitio público</a>
      </div>
    </div>
  )
}

function ProposalDetail({ proposal, onClose, onSaved }: { proposal: YouthProposal; onClose: () => void; onSaved: () => Promise<void> }) {
  const [status, setStatus] = useState<ProposalStatus>(proposal.status)
  const [notes, setNotes] = useState(proposal.admin_notes || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    setSaving(true); setError('')
    try { await updateProposal(proposal.id, { status, admin_notes: notes.trim() || null }); await onSaved(); onClose() }
    catch { setError('No se pudieron guardar los cambios.') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-navy/70 p-3 sm:p-5" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-wider text-sky-700">{proposal.category} · {new Date(proposal.created_at).toLocaleString('es-UY')}</p><h2 id="detail-title" className="mt-2 text-3xl font-black text-navy">Detalle de la propuesta</h2></div><button onClick={onClose} className="focus-ring rounded-xl p-2" aria-label="Cerrar"><X /></button></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">{[['Edad', proposal.age_range || 'Sin dato'], ['Localidad', proposal.location || 'Sin dato'], ['Participaría', proposal.wants_to_participate || 'Sin dato']].map(([label, value]) => <div key={label} className="rounded-2xl bg-pale/60 p-4"><p className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 font-black text-navy">{value}</p></div>)}</div>
        <div className="mt-6 space-y-5"><div><p className="text-sm font-black text-navy">Idea / propuesta</p><p className="mt-2 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 leading-7 text-slate-700">{proposal.proposal}</p></div>{proposal.importance && <div><p className="text-sm font-black text-navy">¿Por qué es importante?</p><p className="mt-2 whitespace-pre-wrap leading-7 text-slate-600">{proposal.importance}</p></div>}{proposal.implementation_idea && <div><p className="text-sm font-black text-navy">¿Cómo podría hacerse?</p><p className="mt-2 whitespace-pre-wrap leading-7 text-slate-600">{proposal.implementation_idea}</p></div>}</div>
        {proposal.contact_requested && <div className="mt-6 rounded-2xl border border-sky/20 bg-pale/40 p-4"><p className="font-black text-navy">Solicitó contacto</p><div className="mt-2 grid gap-1 text-sm text-slate-600"><span>Nombre: {proposal.name || 'No indicado'}</span><span>Email: {proposal.email || 'No indicado'}</span><span>Celular: {proposal.phone || 'No indicado'}</span></div></div>}
        <div className="mt-7 grid gap-5 sm:grid-cols-2"><div><label htmlFor="status" className="text-sm font-black text-navy">Estado</label><select id="status" value={status} onChange={(e) => setStatus(e.target.value as ProposalStatus)} className="field mt-2">{statusOptions.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}</select></div><div className="sm:row-span-2"><label htmlFor="notes" className="text-sm font-black text-navy">Notas internas</label><textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={3000} rows={6} className="field mt-2 resize-y" placeholder="Seguimiento interno del equipo…" /></div></div>
        {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-800">{error}</p>}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button onClick={onClose} className="focus-ring rounded-2xl px-5 py-3 font-black text-navy hover:bg-pale">Cancelar</button><button onClick={save} disabled={saving} className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-navy px-6 py-3 font-black text-white disabled:opacity-60">{saving && <LoaderCircle size={18} className="animate-spin" />} Guardar cambios</button></div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const [items, setItems] = useState<YouthProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [selected, setSelected] = useState<YouthProposal | null>(null)

  const load = useCallback(async () => { setLoading(true); setError(''); try { setItems(await getAdminProposals()) } catch { setError('No pudimos cargar las propuestas.') } finally { setLoading(false) } }, [])
  useEffect(() => { void load() }, [load])

  const filtered = useMemo(() => items.filter((p) => {
    const q = filters.search.trim().toLowerCase()
    if (q && !`${p.proposal} ${p.importance || ''} ${p.implementation_idea || ''}`.toLowerCase().includes(q)) return false
    if (filters.category && p.category !== filters.category) return false
    if (filters.age && p.age_range !== filters.age) return false
    if (filters.location && p.location !== filters.location) return false
    if (filters.status && p.status !== filters.status) return false
    const d = p.created_at.slice(0, 10)
    if (filters.from && d < filters.from) return false
    if (filters.to && d > filters.to) return false
    return true
  }), [items, filters])

  const stats = useMemo(() => Object.fromEntries(statusOptions.map((s) => [s, items.filter((p) => p.status === s).length])) as Record<ProposalStatus, number>, [items])
  const categoryRows = useMemo(() => countBy(items, (p) => p.category), [items])
  const ageRows = useMemo(() => countBy(items, (p) => p.age_range), [items])
  const locationRows = useMemo(() => countBy(items, (p) => p.location), [items])
  const monthRows = useMemo(() => countBy(items, (p) => p.created_at.slice(0, 7)).sort((a,b) => a[0].localeCompare(b[0])).slice(-8), [items])

  async function logout() { if (supabase) await supabase.auth.signOut(); window.location.reload() }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6"><div className="flex items-center gap-4"><BrandLogo className="h-11 w-auto max-w-[190px] object-contain" /><div className="hidden border-l border-slate-200 pl-4 sm:block"><p className="text-xs font-black uppercase tracking-wider text-sky-700">Rincón Te Escucha</p><p className="font-black text-navy">Panel de gestión</p></div></div><div className="flex items-center gap-2"><button onClick={() => void load()} className="focus-ring rounded-xl p-2.5 text-navy hover:bg-pale" title="Actualizar"><RefreshCw size={19} /></button><a href={import.meta.env.BASE_URL} className="focus-ring hidden rounded-xl px-4 py-2 text-sm font-black text-navy hover:bg-pale sm:inline-flex">Ver sitio</a><button onClick={logout} className="focus-ring inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-black text-white"><LogOut size={17} /> <span className="hidden sm:inline">Salir</span></button></div></div></header>

      <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-black uppercase tracking-[.18em] text-sky-700">Resumen</p><h1 className="mt-1 text-3xl font-black tracking-tight text-navy sm:text-4xl">Lo que están diciendo las juventudes</h1></div><p className="text-sm font-bold text-slate-500">{items.length} propuestas en total</p></div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{statusOptions.map((s) => <div key={s} className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-wider text-slate-400">{STATUS_LABELS[s]}</p><p className="mt-2 text-4xl font-black text-navy">{stats[s]}</p></div>)}</div>

        <div className="mt-7 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm"><div className="mb-5 flex items-center gap-2 font-black text-navy"><BarChart3 size={19} /> Por categoría</div><MiniBars rows={categoryRows} /></div>
          <div className="rounded-3xl bg-white p-5 shadow-sm"><div className="mb-5 flex items-center gap-2 font-black text-navy"><UsersRound size={19} /> Por edad</div><MiniBars rows={ageRows} /></div>
          <div className="rounded-3xl bg-white p-5 shadow-sm"><div className="mb-5 flex items-center gap-2 font-black text-navy"><MessageCircle size={19} /> Por localidad</div><MiniBars rows={locationRows} /></div>
          <div className="rounded-3xl bg-white p-5 shadow-sm"><div className="mb-5 flex items-center gap-2 font-black text-navy"><BarChart3 size={19} /> Evolución mensual</div><MiniBars rows={monthRows} /></div>
        </div>

        <div className="mt-7 rounded-3xl border border-sunshine/60 bg-cream p-5"><p className="text-xs font-black uppercase tracking-[.18em] text-amber-700">Temas más mencionados</p><div className="mt-3 flex flex-wrap gap-2">{categoryRows.slice(0, 6).map(([label, value]) => <span key={label} className="rounded-full bg-white px-4 py-2 text-sm font-black text-navy shadow-sm">{label} · {value}</span>)}</div></div>

        <section className="mt-8 rounded-[2rem] bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div><h2 className="text-2xl font-black text-navy">Propuestas</h2><p className="mt-1 text-sm text-slate-500">{filtered.length} resultados con los filtros actuales</p></div><button onClick={() => setFilters(emptyFilters)} className="focus-ring self-start rounded-xl px-3 py-2 text-sm font-black text-ink hover:bg-pale">Limpiar filtros</button></div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
            <label className="relative md:col-span-2 xl:col-span-2"><Search size={17} className="absolute left-3 top-3.5 text-slate-400" /><input value={filters.search} onChange={(e) => setFilters({...filters, search:e.target.value})} className="field pl-10" placeholder="Buscar en textos…" /></label>
            <select value={filters.category} onChange={(e) => setFilters({...filters, category:e.target.value})} className="field"><option value="">Todos los temas</option>{CATEGORIES.map((c)=><option key={c}>{c}</option>)}</select>
            <select value={filters.age} onChange={(e) => setFilters({...filters, age:e.target.value})} className="field"><option value="">Todas las edades</option>{[...new Set(items.map((p)=>p.age_range).filter(Boolean))].map((v)=><option key={v!}>{v}</option>)}</select>
            <select value={filters.location} onChange={(e) => setFilters({...filters, location:e.target.value})} className="field"><option value="">Todas las localidades</option>{[...new Set(items.map((p)=>p.location).filter(Boolean))].map((v)=><option key={v!}>{v}</option>)}</select>
            <select value={filters.status} onChange={(e) => setFilters({...filters, status:e.target.value})} className="field"><option value="">Todos los estados</option>{statusOptions.map((s)=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}</select>
            <div className="flex gap-2"><input type="date" title="Desde" value={filters.from} onChange={(e) => setFilters({...filters, from:e.target.value})} className="field min-w-0 px-2 text-xs" /><input type="date" title="Hasta" value={filters.to} onChange={(e) => setFilters({...filters, to:e.target.value})} className="field min-w-0 px-2 text-xs" /></div>
          </div>

          {error && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-800">{error}</p>}
          {loading ? <div className="grid min-h-48 place-items-center text-navy"><LoaderCircle className="animate-spin" /></div> : (
            <div className="mt-6 grid gap-3">
              {filtered.length === 0 && <div className="rounded-2xl bg-slate-50 p-8 text-center text-slate-500"><Filter className="mx-auto mb-3" /><p className="font-bold">No hay propuestas que coincidan con estos filtros.</p></div>}
              {filtered.map((p) => <article key={p.id} className="grid gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-sky/40 hover:bg-pale/20 md:grid-cols-[150px_1fr_155px_90px] md:items-center"><div><span className="rounded-full bg-pale px-3 py-1 text-xs font-black text-navy">{p.category}</span><p className="mt-2 text-xs text-slate-400">{new Date(p.created_at).toLocaleDateString('es-UY')}</p></div><div className="min-w-0"><p className="line-clamp-2 font-bold leading-6 text-slate-700">{p.proposal}</p><p className="mt-1 text-xs font-semibold text-slate-400">{p.age_range || 'Edad s/d'} · {p.location || 'Localidad s/d'}</p></div><div><span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-navy">{STATUS_LABELS[p.status]}</span></div><button onClick={() => setSelected(p)} className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-3 py-2.5 text-sm font-black text-white"><Eye size={16} /> Ver</button></article>)}
            </div>
          )}
        </section>
      </main>
      {selected && <ProposalDetail proposal={selected} onClose={() => setSelected(null)} onSaved={load} />}
    </div>
  )
}

export default function AdminPage() {
  const [state, setState] = useState<SessionState>('loading')
  useEffect(() => {
    if (!supabase) { setState('signed-out'); return }
    let alive = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!alive) return
      if (!data.session) { setState('signed-out'); return }
      setState('checking')
      const allowed = await isStaffUser()
      if (alive) setState(allowed ? 'ready' : 'denied')
    })
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => { if (!session && alive) setState('signed-out') })
    return () => { alive = false; subscription.subscription.unsubscribe() }
  }, [])

  if (!supabaseConfigured) return <div className="grid min-h-screen place-items-center bg-pale p-6 text-center"><div><h1 className="text-3xl font-black text-navy">Configuración pendiente</h1><p className="mt-3 text-slate-600">Agregá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para habilitar el panel.</p></div></div>
  if (state === 'loading' || state === 'checking') return <div className="grid min-h-screen place-items-center bg-pale text-navy"><LoaderCircle className="animate-spin" size={34} /></div>
  if (state === 'signed-out') return <AdminLogin onSuccess={() => setState('ready')} />
  if (state === 'denied') return <Navigate to="/" replace />
  return <AdminDashboard />
}
