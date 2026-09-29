import { supabase } from '../lib/supabase'
import { contestConfig, type Entry } from './config'
export type Submission = Omit<Entry,'age'> & {age:number;id:string;submission_code:string;created_at:string;status:string;internal_notes:string|null;main_file_url:string|null;complementary_file_url:string|null;is_minor:boolean;ai_used:boolean;terms_version:string}
export type Result = {id:number;published:boolean;proposal_name:string;author:string;image_url:string;rationale:string;mentions:string;evaluations_released:boolean}
export async function submitEntry(entry:Entry, main:File|null, additional:File|null, token:string) {
  if(!supabase) throw new Error('El formulario no está disponible. Contactá a la organización.')
  const body = new FormData();body.set('entry',JSON.stringify(entry));body.set('token',token)
  if(entry.submission_method==='file') {if(main)body.set('main',main);if(additional)body.set('additional',additional)}
  const {data,error} = await supabase.functions.invoke('rural-women-submit',{body})
  if(error || !data?.code) throw new Error('No pudimos enviar tu propuesta todavía. Tus datos siguen en pantalla. Revisá tu conexión e intentá nuevamente.')
  return data.code as string
}
export async function track(event:string) { if(supabase) await supabase.from('rural_women_events').insert({event}).then(()=>undefined,()=>undefined) }
export async function signedFile(path:string) {
  if(!supabase) throw new Error('Sin conexión')
  const {data,error}=await supabase.storage.from(contestConfig.bucket).createSignedUrl(path,120)
  if(error)throw error
  return data.signedUrl
}
