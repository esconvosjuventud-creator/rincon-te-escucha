import test from 'node:test'
import assert from 'node:assert/strict'
import {contestState,ageAt,emptyEntry,validateEntry,criteria,safeUrl,isMinor} from '../src/contest/config.ts'
const now=new Date('2026-09-28T12:00:00Z')
const entry={...emptyEntry,full_name:'Prueba',birth_date:'2000-01-01',age:'26',city:'Trinidad',phone:'099000000',email:'test@example.invalid',proposal_description:'Identidad de Flores',palette:'Verde',submission_method:'link',external_main_url:'https://example.org/logo',tools_used:['Dibujo manual'],authorship_accepted:true,rights_accepted:true,terms_accepted:true,institutional_use_accepted:true}
test('Uruguay boundaries, closure and deliberate publication',()=>{assert.equal(contestState(new Date('2026-09-28T02:59:59Z')),'upcoming');assert.equal(contestState(new Date('2026-09-28T03:00:00Z')),'open');assert.equal(contestState(new Date('2026-10-10T02:59:59Z')),'open');assert.equal(contestState(new Date('2026-10-10T03:00:00Z')),'evaluation');assert.equal(contestState(new Date('2026-10-20T12:00:00Z')),'evaluation');assert.equal(contestState(now,true),'result')})
test('age uses birthday in Uruguay',()=>{assert.equal(ageAt('2008-09-28',now),18);assert.equal(ageAt('2008-09-29',now),17)})
test('adult cannot bypass guardian via edited age',()=>{const minor={...entry,birth_date:'2010-01-01',age:'30'};assert.equal(isMinor(minor,now),true);assert.ok(validateEntry(minor,undefined,now).guardian_accepted)})
test('valid link entry and optional attachment',()=>assert.deepEqual(validateEntry(entry,undefined,now),{}))
test('unsafe link, undeclared AI detail, long concept and missing consent rejected',()=>{assert.equal(safeUrl('javascript:alert(1)'),false);assert.equal(safeUrl('https://user:pass@example.org'),false);assert.ok(validateEntry({...entry,tools_used:['Inteligencia artificial']},undefined,now).ai_details);assert.ok(validateEntry({...entry,proposal_description:'palabra '.repeat(501)},undefined,now).proposal_description);assert.ok(validateEntry({...entry,terms_accepted:false},undefined,now).terms_accepted)})
test('matrix exactly 100 points',()=>assert.equal(criteria.reduce((n,[,max])=>n+max,0),100))
test('invalid dates cannot crash validation',()=>{for(const birth_date of ['2026-99-20','2026-02-30','', 'not-a-date'])assert.ok(validateEntry({...entry,birth_date},undefined,now).birth_date)})

test('residence is restricted to Flores for both form and server validation',()=>{for(const department of ['Montevideo','Durazno','','flores','Flores ']){assert.ok(validateEntry({...entry,department},0,now).department);assert.ok(validateEntry({...entry,department},undefined,now).department)}assert.deepEqual(validateEntry({...entry,department:'Flores'},undefined,now),{})})
