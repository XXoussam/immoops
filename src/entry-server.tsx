// Build-time renderer used by scripts/prerender.mjs — never shipped to the browser.
/* eslint-disable react-refresh/only-export-components -- build-time entry, never hot-reloaded */
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'

export { getSeo, renderHeadTags, INDEXABLE_ROUTES, NOINDEX_ROUTES, SITE_URL } from './lib/seo'
export { ARTICLES } from './lib/articles'

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
}
