import { useEffect, useState } from 'react'
import { contestConfig } from './config'
import { track } from './api'
import { contestShareText, registrationUrl, whatsappShareUrl } from './shareText'

export function ContestShare() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const poster = `${import.meta.env.BASE_URL}contest/placa-concurso.png`
  useEffect(() => {
    const controller = new AbortController()
    // Load before the click: sharing must retain the user's activation.
    async function prepare() {
      try {
        if (!navigator.share || !navigator.canShare) return
        const response = await fetch(poster, { signal: controller.signal })
        if (!response.ok) throw new Error('No se pudo cargar la placa')
        const candidate = new File([await response.blob()], 'Concurso-Mujeres-Rurales-Flores.png', { type: 'image/png' })
        if (navigator.canShare({ files: [candidate] })) setFile(candidate)
      } catch {
        // Download and text-sharing remain available when file sharing fails.
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void prepare()
    return () => controller.abort()
  }, [poster])
  async function sharePoster() {
    if (!file || busy) return
    setBusy(true)
    setNotice('')
    try {
      await navigator.share({ files: [file], text: contestShareText(), title: contestConfig.title })
      void track('share')
      setNotice('Revisá en WhatsApp que la placa y el enlace estén incluidos antes de enviar.')
    } catch (error) {
      setNotice(error instanceof Error && error.name === 'AbortError'
        ? 'Se canceló el envío. Podés volver a compartir cuando quieras.'
        : 'No se pudo compartir la placa. Descargala y usá «Copiar mensaje con enlace» para adjuntarla en WhatsApp.')
    } finally { setBusy(false) }
  }
  async function copy(text: string, confirmation: string) {
    try { await navigator.clipboard.writeText(text); setNotice(confirmation) }
    catch { setNotice('No se pudo copiar automáticamente. Abrí «Ver mensaje» para seleccionarlo y copiarlo.') }
  }
  return <section id="compartir">
    <h2>Compartí la placa y la inscripción</h2>
    <p>En tu celular, elegí WhatsApp en el menú de compartir y seleccioná a quién enviárselo.</p>
    <div className="actions">
      {loading ? <button className="btn" disabled>Preparando placa…</button> : file
        ? <button className="btn" disabled={busy} onClick={() => void sharePoster()}>{busy ? 'Abriendo opciones…' : 'Compartir placa y enlace'}</button>
        : <a className="btn" href={poster} download="Concurso-Mujeres-Rurales-Flores.png">Descargar placa para WhatsApp</a>}
      <button className="btn secondary" onClick={() => void copy(contestShareText(), 'Mensaje con enlace copiado. Pegalo como texto junto a la placa en WhatsApp.')}>Copiar mensaje con enlace</button>
      <a className="btn secondary" target="_blank" rel="noopener noreferrer" href={whatsappShareUrl()} onClick={() => void track('share')}>Abrir mensaje en WhatsApp</a>
    </div>
    {!loading && !file && <p className="notice">Este navegador no permite adjuntar la placa automáticamente. Descargala, adjuntala en WhatsApp y pegá el mensaje con el enlace.</p>}
    <p className="muted">Antes de enviar, comprobá que el mensaje incluya el enlace de inscripción. Algunas aplicaciones comparten solo la imagen; en ese caso, usá «Copiar mensaje con enlace».</p>
    <details><summary>Ver mensaje</summary><pre>{contestShareText()}</pre></details>
    <div className="actions"><a className="btn secondary" target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${contestConfig.url}/`)}`}>Facebook</a><button className="btn secondary" onClick={() => void copy(registrationUrl, 'Enlace de inscripción copiado.')}>Copiar enlace</button></div>
    <p role="status">{notice}</p>
  </section>
}
