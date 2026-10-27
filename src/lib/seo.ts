import { ARTICLES } from './articles'
import { FAQ_ITEMS, SERVICES } from './constants'

/* ── Site identity — keep this description identical on LinkedIn, Malt, directories ── */
export const SITE_URL = 'https://immoops.com'
export const SITE_NAME = 'ImmoOps AI'
export const ORG_DESCRIPTION =
  "ImmoOps AI conçoit et déploie des agents IA sur mesure pour les agences immobilières en France : agents vocaux, chatbots, qualification de leads et automatisation des workflows."
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`

export interface SeoData {
  title: string
  description: string
  path: string
  noindex?: boolean
  ogType?: 'website' | 'article'
  jsonLd: object[]
}

const ORG_ID = `${SITE_URL}/#organization`

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE_NAME,
  alternateName: 'ImmoOps',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: ORG_DESCRIPTION,
  areaServed: { '@type': 'Country', name: 'France' },
  knowsAbout: ['Intelligence artificielle', 'Immobilier', 'Agents vocaux IA', 'Chatbots IA', 'Automatisation des workflows', 'Qualification de leads'],
}

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: 'fr-FR',
  publisher: { '@id': ORG_ID },
}

const services = SERVICES.map((s) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: s.title,
  description: s.description,
  serviceType: s.title,
  provider: { '@id': ORG_ID },
  areaServed: { '@type': 'Country', name: 'France' },
  audience: { '@type': 'BusinessAudience', name: 'Agences immobilières' },
}))

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
}

const breadcrumb = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`,
  })),
})

const FR_MONTHS: Record<string, string> = {
  janvier: '01', février: '02', mars: '03', avril: '04', mai: '05', juin: '06',
  juillet: '07', août: '08', septembre: '09', octobre: '10', novembre: '11', décembre: '12',
}
/** '12 juin 2026' → '2026-06-12' */
export function frDateToIso(d: string): string | undefined {
  const m = d.trim().match(/^(\d{1,2})\s+(\S+)\s+(\d{4})$/)
  if (!m || !FR_MONTHS[m[2].toLowerCase()]) return undefined
  return `${m[3]}-${FR_MONTHS[m[2].toLowerCase()]}-${m[1].padStart(2, '0')}`
}

const STATIC: Record<string, Omit<SeoData, 'path'>> = {
  '/': {
    title: 'Agents IA pour agences immobilières — ImmoOps AI',
    description:
      "Agents vocaux, chatbots IA, qualification de leads et automatisation des workflows sur mesure pour les agences immobilières. Prototype en 48h, audit gratuit.",
    jsonLd: [organization, website, ...services, faqPage],
  },
  '/demos': {
    title: 'Agents IA sur tous vos canaux, un seul CRM — ImmoOps AI',
    description:
      "Email, téléphone, WhatsApp, réseaux sociaux, SMS, site web : voyez où un agent IA intervient dans votre agence immobilière et comment tout arrive dans votre CRM.",
    jsonLd: [organization, breadcrumb([{ name: 'Accueil', path: '/' }, { name: 'Démos', path: '/demos' }])],
  },
  '/blog': {
    title: 'Blog IA et automatisation pour agences immobilières — ImmoOps AI',
    description:
      "Guides pratiques sur l'IA en agence immobilière : agents vocaux, chatbots, qualification de leads, relances automatiques et ROI.",
    jsonLd: [organization, breadcrumb([{ name: 'Accueil', path: '/' }, { name: 'Blog', path: '/blog' }])],
  },
  '/etudes-de-cas': {
    title: "Études de cas IA en agence immobilière — ImmoOps AI",
    description:
      "Exemples de déploiements d'agents IA en agence immobilière : chatbot, agent vocal et automatisation des relances.",
    jsonLd: [organization, breadcrumb([{ name: 'Accueil', path: '/' }, { name: 'Études de cas', path: '/etudes-de-cas' }])],
  },
  '/mentions-legales': { title: 'Mentions légales — ImmoOps AI', description: 'Mentions légales du site ImmoOps AI.', jsonLd: [organization] },
  '/confidentialite': { title: 'Politique de confidentialité — ImmoOps AI', description: 'Politique de confidentialité et traitement des données personnelles (RGPD) — ImmoOps AI.', jsonLd: [organization] },
  '/cookies': { title: 'Politique de cookies — ImmoOps AI', description: 'Utilisation des cookies sur le site ImmoOps AI.', jsonLd: [organization] },
  '/webinaires': { title: 'Webinaires — bientôt disponible | ImmoOps AI', description: ORG_DESCRIPTION, noindex: true, jsonLd: [] },
  '/documentation': { title: 'Documentation — bientôt disponible | ImmoOps AI', description: ORG_DESCRIPTION, noindex: true, jsonLd: [] },
}

export function getSeo(pathname: string): SeoData {
  const path = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/'
  const fixed = STATIC[path]
  if (fixed) return { ...fixed, path }

  const slug = path.match(/^\/blog\/([^/]+)$/)?.[1]
  const article = slug && ARTICLES.find((a) => a.slug === slug)
  if (article) {
    const iso = frDateToIso(article.date)
    return {
      title: `${article.title} — ImmoOps AI`,
      description: article.excerpt,
      path,
      ogType: 'article',
      jsonLd: [
        organization,
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.excerpt,
          articleSection: article.category,
          inLanguage: 'fr-FR',
          ...(iso ? { datePublished: iso } : {}),
          author: { '@id': ORG_ID },
          publisher: { '@id': ORG_ID },
          mainEntityOfPage: `${SITE_URL}${path}`,
          image: OG_IMAGE,
        },
        breadcrumb([
          { name: 'Accueil', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: article.title, path },
        ]),
      ],
    }
  }

  return { title: `Page introuvable — ${SITE_NAME}`, description: ORG_DESCRIPTION, path, noindex: true, jsonLd: [] }
}

/** Every indexable route — used by the prerender step and sitemap.xml */
export const INDEXABLE_ROUTES: string[] = [
  '/', '/demos', '/blog', ...ARTICLES.map((a) => `/blog/${a.slug}`),
  '/etudes-de-cas', '/mentions-legales', '/confidentialite', '/cookies',
]
/** Routes rendered to static HTML but kept out of the sitemap */
export const NOINDEX_ROUTES: string[] = ['/webinaires', '/documentation']

/** <head> tags as an HTML string (prerender) — mirrors what <SeoHead> sets on the client */
export function renderHeadTags(seo: SeoData): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const url = `${SITE_URL}${seo.path === '/' ? '/' : seo.path}`
  const tags = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    ...(seo.noindex ? [] : [`<link rel="canonical" href="${url}" />`]),
    seo.noindex ? `<meta name="robots" content="noindex, follow" />` : `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    // hero photo: start downloading with the HTML (desktop only — hidden below lg)
    ...(seo.path === '/' ? [`<link rel="preload" as="image" href="/hero-1.webp" type="image/webp" fetchpriority="high" media="(min-width: 1024px)" />`] : []),
    `<meta property="og:type" content="${seo.ogType ?? 'website'}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    ...seo.jsonLd.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`),
  ]
  return tags.join('\n    ')
}
