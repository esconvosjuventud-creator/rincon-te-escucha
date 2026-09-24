import { supabase } from '../lib/supabase'
import { fallbackFaq, fallbackResources, fallbackTips } from '../data/fallback'
import type { FaqItem, Resource, SiteSetting, Tip } from '../types'

export async function getPublicResources(): Promise<Resource[]> {
  if (!supabase) return fallbackResources
  const { data, error } = await supabase
    .from('rte_resources')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true })
  if (error || !data?.length) return fallbackResources
  return data as Resource[]
}

export async function getPublicTips(): Promise<Tip[]> {
  if (!supabase) return fallbackTips
  const { data, error } = await supabase
    .from('rte_tips')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true })
  if (error || !data?.length) return fallbackTips
  return data as Tip[]
}

export async function getPublicFaq(): Promise<FaqItem[]> {
  if (!supabase) return fallbackFaq
  const { data, error } = await supabase
    .from('rte_faq')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true })
  if (error || !data?.length) return fallbackFaq
  return data as FaqItem[]
}

export async function getPublicSettings(): Promise<Record<string, string>> {
  if (!supabase) return {}
  const { data, error } = await supabase
    .from('rte_site_settings')
    .select('key,value')
    .eq('is_public', true)
  if (error || !data) return {}
  return Object.fromEntries((data as Pick<SiteSetting, 'key' | 'value'>[]).map((item) => [item.key, item.value]))
}
