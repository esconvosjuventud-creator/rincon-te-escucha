import { createClient } from 'npm:@supabase/supabase-js@2.117.1'
import { contestConfig as config, contestState, emptyEntry, isMinor, validateEntry, type Entry } from '../../../src/contest/config.ts'
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Content-Type':'application/json'}
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers})
const client=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}})
async function verifyFile(file:File) {
  if(!config.mimeTypes.includes(file.type)||file.size===0||file.size>config.maxFileBytes||! /\.(png|jpe?g|pdf)$/i.test(file.name)) throw new Error('Archivo inválido')
  const bytes=new Uint8Array(await file.slice(0,8).arrayBuffer())
  const ok=file.type==='image/png'?bytes.join(',')==='137,80,78,71,13,10,26,10':file.type==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:new TextDecoder().decode(bytes).startsWith('%PDF-')
  if(!ok)throw new Error('El contenido no coincide con el formato')
}
Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response(null,{headers})
  if(req.method!=='POST')return reply({error:'Método no admitido'},405)
  // Public form: validate the project's publishable API key, rather than requiring a participant account.
  const key=req.headers.get('apikey')
  if(!key || ![Deno.env.get('SUPABASE_ANON_KEY'),'sb_publishable_ZyllPsNGdJhoCd7Vz82uSQ_C89X4p4k'].includes(key)) return reply({error:'API key inválida'},401)
  if(Number(req.headers.get('content-length')||0)>22*1024*1024)return reply({error:'Carga demasiado grande'},413)
  const uploaded:string[]=[]
  try {
    const rawIp=(req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim()
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}:${rawIp}`))
    const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('')
    const limit=await client.rpc('rural_women_allow_request',{p_key:hash});if(limit.error||!limit.data)return reply({error:'Esperá antes de volver a intentar.'},429)
    // Bound the body even when the caller omits Content-Length.
    const chunks:Uint8Array[]=[];let size=0
    if(!req.body)return reply({error:'Faltan datos'},400)
    const reader=req.body.getReader()
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>22*1024*1024){await reader.cancel();return reply({error:'Carga demasiado grande'},413)}chunks.push(value)}
    const body=new Uint8Array(size);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.byteLength}
    const form=await new Response(body,{headers:{'Content-Type':req.headers.get('content-type')||''}}).formData(), token=String(form.get('token')||'')
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token))return reply({error:'Identificador inválido'},400)
    const previous=await client.from('rural_women_logo_submissions').select('submission_code').eq('request_token',token).maybeSingle()
    if(previous.error)throw previous.error
    if(previous.data)return reply({code:previous.data.submission_code})
    if(contestState()!=='open')return reply({error:'La convocatoria no está abierta.'},409)
    const value=JSON.parse(String(form.get('entry')||'{}'))
    const entry={...emptyEntry} as Entry
    for(const k of Object.keys(emptyEntry) as (keyof Entry)[]) {
      const v=value[k],sample=emptyEntry[k]
      if(Array.isArray(sample)){if(!Array.isArray(v)||v.some(x=>typeof x!=='string'))return reply({error:'Datos inválidos'},400);Object.assign(entry,{[k]:v})}
      else if(typeof v!==typeof sample)return reply({error:'Datos inválidos'},400)
      else Object.assign(entry,{[k]:typeof v==='string'?v.trim():v})
    }
    const errors=validateEntry(entry);if(Object.keys(errors).length)return reply({error:'Revisá los campos.',fields:errors},400)
    const main=form.get('main'),additional=form.get('additional')
    if(entry.submission_method==='file' && !(main instanceof File))return reply({error:'Falta el diseño'},400)
    const files=entry.submission_method==='file'?([['main',main],['additional',additional]] as const).filter((x):x is readonly ['main'|'additional',File]=>x[1] instanceof File):[]
    for(const [,file] of files)await verifyFile(file)
    const allocation=await client.rpc('rural_women_next_code');if(allocation.error)throw allocation.error
    const code=allocation.data as string,paths:Record<string,string>={}
    for(const [kind,file] of files){const ext=file.type==='image/png'?'png':file.type==='image/jpeg'?'jpg':'pdf';const path=`${code}/${kind}/${crypto.randomUUID()}.${ext}`;const {error}=await client.storage.from(config.bucket).upload(path,file,{contentType:file.type,upsert:false});if(error)throw error;uploaded.push(path);paths[kind]=path}
    if(contestState()!=='open')throw new Error('La convocatoria cerró durante la carga')
    const minor=isMinor(entry),ai=entry.tools_used.includes('Inteligencia artificial')
    const {error}=await client.from('rural_women_logo_submissions').insert({...entry,age:Number(entry.age),request_token:token,submission_code:code,main_file_url:paths.main||null,complementary_file_url:paths.additional||null,external_main_url:entry.submission_method==='link'?entry.external_main_url:null,external_complementary_url:entry.submission_method==='link'?entry.external_complementary_url:null,is_minor:minor,ai_used:ai,ai_details:ai?entry.ai_details:'',guardian_name:minor?entry.guardian_name:null,guardian_document:minor?entry.guardian_document:null,guardian_phone:minor?entry.guardian_phone:null,guardian_email:minor?entry.guardian_email:null,guardian_accepted:minor?entry.guardian_accepted:false,terms_version:config.termsVersion})
    if(error){if(error.code==='23505'){const existing=await client.from('rural_women_logo_submissions').select('submission_code').eq('request_token',token).maybeSingle();if(existing.data){if(uploaded.length)await client.storage.from(config.bucket).remove(uploaded);return reply({code:existing.data.submission_code})}}throw error}
    return reply({code})
  }catch {if(uploaded.length)await client.storage.from(config.bucket).remove(uploaded);return reply({error:'No pudimos recibir la propuesta. Revisá los datos y los archivos e intentá nuevamente.'},400)}
})
