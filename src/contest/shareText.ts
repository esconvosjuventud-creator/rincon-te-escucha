import { contestConfig as c, dateLabel } from './config'

export const registrationUrl = `${c.url}/#inscripcion`
// Explicit Unicode code points preserve emoji through source-file encoding changes.
export function contestShareText() {
  return [
    `\u{1F3A8} ¡Tu diseño puede representar a las Mujeres Rurales de Flores!`,
    c.title,
    '',
    '\u{1F4CD} Exclusivo para habitantes del departamento de Flores.',
    '\u2705 Gratuito y sin límite de edad. No necesitás ser diseñador/a.',
    `\u{1F3C6} Premio: ${c.prize}`,
    `\u{1F4C5} Cierre: ${dateLabel(c.closesAt)}, 23:59 h de Uruguay.`,
    '',
    'Inscribite acá:',
    registrationUrl,
    '',
    'Creá. Participá. Representá.',
  ].join('\n')
}
export function whatsappShareUrl() {
  return `https://wa.me/?text=${encodeURIComponent(contestShareText())}`
}
