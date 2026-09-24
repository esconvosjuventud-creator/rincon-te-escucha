import { supabase } from '../lib/supabase'
import type { ProposalStatus, YouthProposal, YouthProposalInsert } from '../types'

function clean(value: string | null) {
  if (value === null) return null
  return [...value].filter((character) => {
    const code = character.charCodeAt(0)
    return code === 9 || code === 10 || code === 13 || code >= 32
  }).join('').replace(/\r\n?/g, '\n').trim()
}

export async function submitProposal(payload: YouthProposalInsert) {
  if (!supabase) throw new Error('SUPABASE_NOT_CONFIGURED')
  const safePayload: YouthProposalInsert = {
    ...payload,
    category: clean(payload.category) || '',
    proposal: clean(payload.proposal) || '',
    importance: clean(payload.importance),
    implementation_idea: clean(payload.implementation_idea),
    name: payload.contact_requested ? clean(payload.name) : null,
    email: payload.contact_requested ? clean(payload.email) : null,
    phone: payload.contact_requested ? clean(payload.phone) : null,
  }
  const { error } = await supabase.from('youth_proposals').insert({
    ...safePayload,
    status: 'new',
    admin_notes: null,
    is_archived: false,
    source: 'web',
  })
  if (error) throw error
}

export async function getAdminProposals(): Promise<YouthProposal[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('youth_proposals')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as YouthProposal[]
}

export async function updateProposal(id: string, patch: { status?: ProposalStatus; admin_notes?: string | null; is_archived?: boolean }) {
  if (!supabase) throw new Error('SUPABASE_NOT_CONFIGURED')
  const nextPatch = { ...patch }
  if (patch.status === 'archived') nextPatch.is_archived = true
  if (patch.status && patch.status !== 'archived' && patch.is_archived === undefined) nextPatch.is_archived = false
  const { error } = await supabase.from('youth_proposals').update(nextPatch).eq('id', id)
  if (error) throw error
}

export async function isStaffUser(): Promise<boolean> {
  if (!supabase) return false
  const { data, error } = await supabase.rpc('rte_is_staff')
  if (error) return false
  return Boolean(data)
}
