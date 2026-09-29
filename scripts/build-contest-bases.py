import json,re
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,KeepTogether
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.utils import ImageReader
from datetime import datetime
from xml.sax.saxutils import escape
c=json.loads(__import__('subprocess').check_output(['node','--experimental-strip-types','--input-type=module','-e',"import {contestConfig} from './src/contest/config.ts'; console.log(JSON.stringify(contestConfig))"],encoding='utf8')); sections=json.load(open('src/contest/terms.json',encoding='utf8'))
months=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','setiembre','octubre','noviembre','diciembre']
def resolve(m):
 k=m.group(1);v=c[k]
 if k=='jury':return ', '.join(v)
 if k.endswith('At') or k.startswith('evaluation'):
  d=datetime.fromisoformat(v);return f'{d.day} de {months[d.month-1]} de {d.year}'
 return str(v)
styles=getSampleStyleSheet();styles.add(ParagraphStyle(name='BodyContest',fontName='Helvetica',fontSize=10.5,leading=15,spaceAfter=10,textColor=colors.HexColor('#203b49')));styles.add(ParagraphStyle(name='TitleContest',fontName='Helvetica-Bold',fontSize=23,leading=27,spaceAfter=16,textColor=colors.HexColor('#073b5c')))
styles['Heading2'].textColor=colors.HexColor('#245c4e');styles['Heading2'].spaceBefore=13
story=[Paragraph('BASES Y CONDICIONES',styles['TitleContest']),Paragraph(escape(c['title']),styles['Heading2']),Paragraph(escape(c['subtitle']),styles['BodyContest']),Paragraph('Organiza: Oficina de la Juventud. Apoya: Dirección de Promoción y Desarrollo. Intendencia Departamental de Flores.',styles['BodyContest']),Paragraph('Versión '+c['termsVersion'],styles['BodyContest']),Spacer(1,12)]
for s in sections:
 block=[Paragraph(escape(s['title']),styles['Heading2'])]
 for p in s['paragraphs']:block.append(Paragraph(escape(re.sub(r'\{\{(\w+)\}\}',resolve,p)),styles['BodyContest']))
 story.append(KeepTogether(block))
criteria=[('Representación de las Mujeres Rurales',20),('Originalidad y creatividad',15),('Identidad territorial y vínculo con Flores',15),('Pertinencia',10),('Calidad conceptual',10),('Impacto y calidad visual',10),('Legibilidad',5),('Simplicidad',5),('Versatilidad',5),('Aplicación institucional',5)]
story.append(Paragraph('Matriz de evaluación',styles['Heading2']));table=Table([['Criterio','Máximo']]+criteria+[('TOTAL',100)],colWidths=[400,65]);table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#073b5c')),('TEXTCOLOR',(0,0),(-1,0),colors.white),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.HexColor('#edf2ee'),colors.white]),('FONTNAME',(0,0),(-1,0),'Helvetica-Bold'),('PADDING',(0,0),(-1,-1),8)]));story.append(table);story.append(Spacer(1,15));story.append(Paragraph('Inscripción: <link href="'+c['url']+'">'+c['url']+'</link>',styles['BodyContest']))
def footer(canvas,doc):
 canvas.setFont('Helvetica',8);canvas.setFillColor(colors.HexColor('#48636d'));canvas.drawString(48,30,'Mujeres Rurales de Flores | Identidad, raíces y futuro');canvas.drawRightString(547,30,str(doc.page))
SimpleDocTemplate('public/contest/bases.pdf',pagesize=(595,842),rightMargin=48,leftMargin=48,topMargin=45,bottomMargin=50,title=c['title'],author='Oficina de la Juventud - Flores').build(story,onFirstPage=footer,onLaterPages=footer)

