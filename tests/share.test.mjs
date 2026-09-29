import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const source = await readFile(new URL('../src/contest/shareText.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  .replace("'./config'", JSON.stringify(new URL('../src/contest/config.ts', import.meta.url).href))
const share = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)

test('WhatsApp message preserves emojis, accents, newlines and registration URL', () => {
  const text = share.contestShareText()
  assert.equal(new URL(share.whatsappShareUrl()).searchParams.get('text'), text)
  for (const symbol of ['🎨', '📍', '✅', '🏆', '📅']) assert.ok(text.includes(symbol))
  assert.ok(text.includes('Inscribite acá:\n' + share.registrationUrl))
  assert.ok(text.includes('habitantes del departamento de Flores'))
  assert.ok(!text.includes('\uFFFD'))
  assert.equal(new URL(share.registrationUrl).hash, '#inscripcion')
})
