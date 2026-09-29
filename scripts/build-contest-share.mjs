import { readFile, writeFile, mkdir } from 'node:fs/promises'

// Crawlers don't execute React or the GitHub Pages 404 redirect. Serve real HTML
// at this route, retaining the built app and the home page's own metadata.
const base = 'https://esconvosjuventud-creator.github.io/rincon-te-escucha/'
const url = `${base}concurso-mujeres-rurales/`
let html = await readFile('dist/index.html', 'utf8')
html = html.replace(/<title>[^<]*<\/title>/, '<title>Concurso Mujeres Rurales de Flores · Inscripciones</title>')
  .replace(/<meta (?:name="description"|property="og:[^"]+"|name="twitter:[^"]+")[^>]*>/g, '')
  .replace('href="logo-es-con-vos.png"', `href="${base}logo-es-con-vos.png"`)
  .replace('</head>', `<meta name="description" content="Concurso de logo para habitantes de Flores. Gratuito, sin límite de edad. Premio USD 100. Inscripciones hasta el 9 de octubre de 2026." />
<meta property="og:title" content="¡Tu diseño puede representar a las Mujeres Rurales de Flores!" />
<meta property="og:description" content="Exclusivo para habitantes de Flores. Gratuito, sin límite de edad. Premio USD 100. Inscribite hasta el 9 de octubre de 2026." />
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${base}contest/placa-concurso.png" />
<meta property="og:image:secure_url" content="${base}contest/placa-concurso.png" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1080" />
<meta property="og:image:height" content="1350" />
<meta property="og:image:alt" content="Placa oficial del concurso de logo Mujeres Rurales de Flores" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="canonical" href="${url}" />
</head>`)
await mkdir('dist/concurso-mujeres-rurales', { recursive: true })
await writeFile('dist/concurso-mujeres-rurales/index.html', html, 'utf8')
