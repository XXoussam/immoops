// Post-build: renders every route to static HTML so search engines and AI crawlers
// (Googlebot, GPTBot, ClaudeBot, PerplexityBot…) receive the full page content.
// Also writes sitemap.xml and the SPA fallback shell (app.html).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const server = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href)
const { render, getSeo, renderHeadTags, INDEXABLE_ROUTES, NOINDEX_ROUTES, SITE_URL, ARTICLES } = server

const template = readFileSync(join(dist, 'index.html'), 'utf8')
if (!template.includes('<!--seo-head-->')) throw new Error('index.html is missing the <!--seo-head--> placeholder')

const page = (head, body) =>
  template.replace('<!--seo-head-->', head).replace('<div id="root"></div>', `<div id="root">${body}</div>`)

let failed = 0
for (const route of [...INDEXABLE_ROUTES, ...NOINDEX_ROUTES]) {
  let body = ''
  try {
    body = render(route)
  } catch (err) {
    failed++
    console.warn(`  ! ${route}: render failed, shipping head tags only (${err.message})`)
  }
  const out = route === '/' ? join(dist, 'index.html') : join(dist, route, 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, page(renderHeadTags(getSeo(route)), body))
  console.log(`  ✓ ${route}  (${(body.length / 1024).toFixed(1)} kB html)`)
}

// SPA fallback for unknown URLs: empty shell, noindex (avoids serving the homepage as a soft 404)
writeFileSync(join(dist, 'app.html'), page(renderHeadTags(getSeo('/__not-found')), ''))

// sitemap.xml
const today = new Date().toISOString().slice(0, 10)
const FR = { janvier: '01', février: '02', mars: '03', avril: '04', mai: '05', juin: '06', juillet: '07', août: '08', septembre: '09', octobre: '10', novembre: '11', décembre: '12' }
const iso = (d) => {
  const m = d.match(/^(\d{1,2})\s+(\S+)\s+(\d{4})$/)
  return m && FR[m[2]] ? `${m[3]}-${FR[m[2]]}-${m[1].padStart(2, '0')}` : today
}
const lastmod = Object.fromEntries(ARTICLES.map((a) => [`/blog/${a.slug}`, iso(a.date)]))
const priority = (r) => (r === '/' ? '1.0' : ['/demos', '/blog'].includes(r) ? '0.8' : r.startsWith('/blog/') ? '0.7' : ['/mentions-legales', '/confidentialite', '/cookies'].includes(r) ? '0.2' : '0.6')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${INDEXABLE_ROUTES.map((r) => `  <url><loc>${SITE_URL}${r === '/' ? '/' : r}</loc><lastmod>${lastmod[r] ?? today}</lastmod><priority>${priority(r)}</priority></url>`).join('\n')}
</urlset>
`
writeFileSync(join(dist, 'sitemap.xml'), sitemap)
console.log(`prerendered ${INDEXABLE_ROUTES.length + NOINDEX_ROUTES.length} routes, sitemap with ${INDEXABLE_ROUTES.length} URLs${failed ? `, ${failed} render failure(s)` : ''}`)
