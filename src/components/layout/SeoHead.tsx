import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSeo, renderHeadTags } from '../../lib/seo'

const MANAGED =
  'title, meta[name="description"], link[rel="canonical"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"], script[type="application/ld+json"]'

/** Keeps <head> SEO tags in sync on client-side navigation (prerendered HTML ships the same tags). */
export function SeoHead() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.head.querySelectorAll(MANAGED).forEach((el) => el.remove())
    const tpl = document.createElement('template')
    tpl.innerHTML = renderHeadTags(getSeo(pathname))
    document.head.append(tpl.content)
  }, [pathname])

  return null
}
