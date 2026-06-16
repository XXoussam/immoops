export function AnnouncementBar() {
  return (
    <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 bg-purple text-white text-xs font-sans py-2 px-4">
      <span>Nouveau&nbsp;: Agents IA pour la qualification de leads immobiliers</span>
      <a href="#services" className="font-medium opacity-80 hover:opacity-100 transition-opacity">
        Découvrir
      </a>
    </div>
  )
}
