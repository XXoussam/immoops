import { WorkflowSquare01Icon, MessageProgrammingIcon, AiBrain01Icon, VoiceIcon, UserCheck01Icon, ZapIcon, GroupIcon, BarChartIcon, Clock01Icon, AiLearningIcon, Home01Icon, SaleTag01Icon, Key01Icon, MoneyBag02Icon, Calendar03Icon } from '@hugeicons/core-free-icons'

export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Démos', href: '/demos' },
  { label: 'Comment ça marche', href: '#fonctionnement' },
  { label: 'À propos', href: '#a-propos' },
  { label: 'FAQ', href: '#faq' },
]

export interface Service {
  Icon: object
  title: string
  description: string
}

export const SERVICES: Service[] = [
  {
    Icon: WorkflowSquare01Icon,
    title: 'Automatisation des workflows',
    description: 'Connectez vos outils et éliminez les tâches manuelles grâce à des workflows intelligents sur mesure.',
  },
  {
    Icon: MessageProgrammingIcon,
    title: 'Chatbots IA',
    description: 'Un assistant disponible 24h/24 qui répond aux questions de vos prospects et qualifie vos contacts.',
  },
  {
    Icon: AiBrain01Icon,
    title: "Architecture d'agents IA",
    description: "Des systèmes d'agents autonomes qui orchestrent vos processus métier de A à Z.",
  },
  {
    Icon: VoiceIcon,
    title: 'Agents vocaux',
    description: 'Répondez aux appels entrants automatiquement avec des agents vocaux naturels et précis.',
  },
  {
    Icon: UserCheck01Icon,
    title: 'Qualification de leads',
    description: "Identifiez et priorisez vos meilleurs prospects grâce à l'IA, avant votre premier appel.",
  },
  {
    Icon: AiLearningIcon,
    title: 'Formation n8n',
    description: "Apprenez à automatiser vos tâches répétitives avec n8n — sans coder. Des sessions pratiques adaptées à votre agence.",
  },
]

export interface Demo {
  channel: string
  title: string
  description: string
  href: string
}

export const DEMOS: Demo[] = [
  {
    channel: 'Chatbot IA',
    title: "Qualification d'un acheteur entrant",
    description: "Un prospect arrive sur votre site à 23h. Le chatbot identifie son budget, sa zone et son délai de projet — et qualifie le lead avant l'ouverture.",
    href: '/demos/qualification-acheteur',
  },
  {
    channel: 'Agent vocal',
    title: 'Réponse automatique hors horaires',
    description: "Un appel entrant après 19h. L'agent vocal répond naturellement, collecte les informations clés et planifie un rappel au bon agent.",
    href: '/demos/reponse-hors-horaires',
  },
]

export interface Step {
  number: string
  title: string
  description: string
}

export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    number: '01',
    title: 'Audit de vos processus',
    description: 'On cartographie vos workflows actuels et identifions ensemble les points de friction les plus coûteux.',
  },
  {
    number: '02',
    title: 'Conception de la solution',
    description: 'Nous concevons une architecture IA sur mesure, adaptée à votre agence et à vos outils existants.',
  },
  {
    number: '03',
    title: 'Développement & intégration',
    description: 'Mise en place des agents, chatbots et automatisations directement dans votre stack technique.',
  },
  {
    number: '04',
    title: 'Formation & suivi',
    description: 'Votre équipe est formée, et nous restons à vos côtés pour mesurer et optimiser en continu.',
  },
]

export interface FaqItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Est-ce que l\'IA peut vraiment s\'adapter à mon agence ?',
    answer: 'Oui. Chaque solution est entièrement personnalisée selon votre taille, vos outils actuels et vos objectifs business. Rien n\'est générique.',
  },
  {
    question: 'Dois-je avoir des compétences techniques ?',
    answer: 'Non. Nous prenons tout en charge, de la conception à l\'intégration. Vous utilisez les outils livrés, pas le code qui les fait fonctionner.',
  },
  {
    question: 'Combien de temps faut-il pour voir des résultats ?',
    answer: 'Les premiers résultats sont visibles en 2 à 4 semaines selon la complexité du projet. Un premier prototype peut être livré en 48h.',
  },
  {
    question: 'Quels outils puis-je intégrer ?',
    answer: 'Notion, Google Workspace, CRM immobiliers (Salesforce, HubSpot, Apimo…), WhatsApp, téléphonie VoIP, et bien d\'autres via API.',
  },
  {
    question: 'Quel est le tarif moyen ?',
    answer: 'Chaque projet est unique. Contactez-nous pour un audit gratuit et un devis personnalisé, sans engagement.',
  },
  {
    question: 'Assurez-vous un suivi après livraison ?',
    answer: 'Absolument. Un accompagnement post-lancement est inclus dans chaque mission pour garantir que les résultats sont au rendez-vous.',
  },
]

export interface Integration {
  name: string
  category: 'crm' | 'llm' | 'communication' | 'automation'
}

export const INTEGRATIONS: Integration[] = [
  { name: 'HubSpot',           category: 'crm' },
  { name: 'Salesforce',        category: 'crm' },
  { name: 'Apimo',             category: 'crm' },
  { name: 'Notion',            category: 'automation' },
  { name: 'OpenAI',            category: 'llm' },
  { name: 'Claude AI',         category: 'llm' },
  { name: 'Gemini',            category: 'llm' },
  { name: 'WhatsApp',          category: 'communication' },
  { name: 'Gmail',             category: 'communication' },
  { name: 'Outlook',           category: 'communication' },
  { name: 'Google Workspace',  category: 'automation' },
  { name: 'Zapier',            category: 'automation' },
  { name: 'Make',              category: 'automation' },
  { name: 'Twilio',            category: 'communication' },
  { name: 'Calendly',          category: 'automation' },
]

export interface Channel {
  label: string
  description: string
  preview: { from: string; text: string }[]
  videoSrc?: string
  videoPosition?: string
}

export const CHANNELS: Channel[] = [
  {
    label: 'Chatbot',
    description: 'Répond instantanément aux prospects sur votre site, 24h/24.',
    videoSrc: '/videos/chat-widget.mp4',
    videoPosition: '75% center',
    preview: [
      { from: 'visitor', text: 'Bonjour, ce bien est-il encore disponible ?' },
      { from: 'bot', text: 'Oui ! Ce T3 est disponible. Souhaitez-vous planifier une visite ?' },
    ],
  },
  {
    label: 'Email',
    description: 'Gère vos boîtes mail et relance automatiquement les prospects.',
    videoSrc: '/videos/gmail-compose.mp4',
    preview: [
      { from: 'bot', text: 'Bonjour Thomas,\nSuite à votre demande de visite, voici les disponibilités pour cette semaine.' },
    ],
  },
  {
    label: 'WhatsApp',
    description: 'Engage vos clients sur leur canal préféré en temps réel.',
    videoSrc: '/videos/prompt-bar.mp4',
    preview: [
      { from: 'visitor', text: 'Votre annonce m\'intéresse, quels sont les charges ?' },
      { from: 'bot', text: 'Les charges sont de 180€/mois. Je vous envoie la fiche détaillée 📄' },
    ],
  },
  {
    label: 'Voix',
    description: 'Répond aux appels entrants et qualifie les prospects vocalement.',
    videoSrc: '/videos/translation.mp4',
    preview: [
      { from: 'bot', text: '« Bonjour, agence ImmoOps. Je suis votre assistant IA. Comment puis-je vous aider ? »' },
    ],
  },
]

export interface Testimonial {
  logo: string
  quote: string
  name: string
  role: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    logo: 'Century 21',
    quote: 'Grâce aux agents IA, nous avons automatisé 80% de nos relances prospects. Notre équipe peut enfin se concentrer sur les visites et les négociations.',
    name: 'Marie Dupont',
    role: 'Directrice commerciale, Century 21 Paris',
  },
  {
    logo: 'ERA Immobilier',
    quote: "L'intégration du chatbot IA a transformé notre gestion des leads entrants. Nous ne manquons plus aucune opportunité, même en dehors des heures de bureau.",
    name: 'Thomas Bernard',
    role: "Directeur d'agence, ERA Immobilier Lyon",
  },
  {
    logo: 'Orpi',
    quote: 'La qualification automatique des prospects nous a permis de tripler notre taux de conversion en seulement trois mois. Un investissement qui se rembourse très vite.',
    name: 'Sophie Martin',
    role: 'Responsable commerciale, Orpi Bordeaux',
  },
]

export const LOGOS = ['Century 21', 'ERA Immobilier', 'Guy Hoquet', 'Laforêt', 'Orpi', 'IAD France']

export interface HeroSlide {
  src: string
  alt: string
  position?: string
}

/** Hero photo slideshow (right half of the hero), shown top to bottom */
export const HERO_SLIDES: HeroSlide[] = [
  { src: '/hero-1.webp', alt: "L'équipe en séance de travail autour d'une grande table", position: '50% 45%' },
  { src: '/hero-2.webp', alt: "Deux membres de l'équipe travaillent face à face sur leurs ordinateurs", position: '72% 45%' },
  { src: '/hero-3.webp', alt: "Un membre de l'équipe concentré à son poste de travail", position: '45% 50%' },
]

export const CAL_URL = 'https://calendly.com/immoops/discovery_call'

/* Floating chat / phone bubbles (bottom-right, every page) */
export const AGENT_BUBBLES = {
  chat: { label: 'Discuter avec Sophie, notre agent IA' },
  phone: {
    label: 'Appeler Inès, notre agent vocal IA',
    title: 'Inès',
    subtitle: 'Agente vocale ImmoOps · IA',
    intro: 'Parlez à notre agent vocal directement depuis votre navigateur. Autorisez le micro pour démarrer.',
    cta: 'Appeler',
    connecting: 'Connexion…',
  },
  close: 'Fermer',
}

/* Sophie chat window (floating chat bubble + /demos) */
export const CHAT_WIDGET = {
  name: 'Sophie',
  status: 'En ligne',
  greeting: 'Bonjour ! Je suis Sophie, votre conseillère ImmoOps. Comment puis-je vous aider ?',
  error: 'Désolée, une erreur est survenue.',
  placeholder: 'Posez votre question…',
  send: 'Envoyer',
  reset: 'Nouvelle conversation',
  minimize: 'Réduire',
  close: 'Fermer',
  /* Quick replies above the input: `ask` goes to Sophie, `booking` answers with the Calendly card */
  chips: [
    { label: 'Acheter', Icon: Home01Icon, ask: 'Je souhaite acheter un bien.' },
    { label: 'Vendre', Icon: SaleTag01Icon, ask: 'Je souhaite vendre mon bien.' },
    { label: 'Louer', Icon: Key01Icon, ask: 'Je cherche une location.' },
    { label: 'Estimer', Icon: MoneyBag02Icon, ask: 'Pouvez-vous estimer mon bien ?' },
    { label: 'Réserver une démo', Icon: Calendar03Icon, booking: true },
  ],
  booking: {
    ask: 'Je voudrais réserver une démo.',
    reply: 'Avec plaisir ! Voici le lien pour choisir le créneau qui vous convient :',
    title: 'Réserver une démo — ImmoOps',
    domain: 'calendly.com',
    description: 'Appel découverte de 30 minutes avec notre équipe.',
  },
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterCol {
  heading: string
  links: FooterLink[]
}

export const FOOTER_COLS: FooterCol[] = [
  {
    heading: 'Services',
    links: [
      { label: 'Automatisation des workflows', href: '/#services' },
      { label: 'Chatbots IA', href: '/#services' },
      { label: 'Agents vocaux', href: '/#services' },
      { label: 'Architecture IA', href: '/#services' },
      { label: 'Qualification de leads', href: '/#services' },
      { label: 'Formation n8n', href: '/#services' },
    ],
  },
  {
    heading: 'Ressources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Études de cas', href: '/etudes-de-cas' },
      { label: 'Webinaires', href: '/webinaires' },
      { label: 'Documentation', href: '/documentation' },
    ],
  },
  {
    heading: 'Entreprise',
    links: [
      { label: 'À propos', href: '/#a-propos' },
      { label: 'Démos', href: '/demos' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
  {
    heading: 'Légal',
    links: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Confidentialité', href: '/confidentialite' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
]

export const SMART_OPS = [
  { Icon: ZapIcon, title: 'Automatisez à grande échelle', description: 'Répondez, relancez et planifiez automatiquement pour libérer vos agents sur les tâches à forte valeur.' },
  { Icon: GroupIcon, title: 'Expériences personnalisées', description: 'Chaque prospect reçoit une réponse adaptée à son profil, son projet et son canal préféré.' },
  { Icon: BarChartIcon, title: 'Plateforme centralisée', description: 'Gérez toutes vos communications et opérations depuis une interface unifiée.' },
  { Icon: Clock01Icon, title: 'Disponibilité 24/7', description: "Vos agents IA ne dorment jamais. Vos prospects reçoivent une réponse à n'importe quelle heure." },
]

/* ── Lead pipeline illustration (homepage, under the value statement) ── */
export const LEAD_PIPELINE = {
  withLabel: 'Avec IA',
  withoutLabel: 'Sans IA',
  intro: "Déplacez le curseur : à gauche, l'IA capte et relance chaque prospect. Au-delà de la ligne, sans IA, la plupart décrochent en route.",
  legend: { visitor: 'Nouveau visiteur', active: 'Lead actif', lost: 'Lead perdu' },
  mandate: 'MANDAT',
  counter: (signed: number, total: number) => `${signed} signés · ${total} leads`,
  ariaSlider: "Comparer le parcours des leads sans IA et avec IA",
  ariaCanvas: "Animation : des leads traversent quatre étapes de gauche à droite. Avec l'IA ils deviennent violets et atteignent le mandat signé ; au-delà de la ligne, sans IA, ils deviennent sombres, affichent la raison de leur perte et disparaissent.",
  stages: [['01', 'CAPTER', 0.22], ['02', 'RELANCER', 0.42], ['03', 'CONVAINCRE', 0.62], ['04', 'MESURER', 0.82]] as [string, string, number][],
  chipsWith: [
    ['Trafic du site converti en leads', 'Trafic → leads'],
    ['Leads relancés automatiquement', 'Relance auto'],
    ['Estimation rédigée en minutes', 'Estimation rapide'],
    ['Conversion mesurée 24h/24', 'Mesuré 24h/24'],
  ] as [string, string][],
  chipsWithout: [
    ['Les visiteurs repartent sans trace', 'Visiteurs perdus'],
    ['Leads oubliés après quelques jours', 'Leads oubliés'],
    ['Devis envoyé une semaine trop tard', 'Devis en retard'],
    ['Résultats jamais mesurés', 'Non mesuré'],
  ] as [string, string][],
  names: ['Charlotte', 'Céline', 'Aurélie', 'Pauline', 'Manon', 'Camille', 'Justine', 'Margaux', 'Sophie', 'Amélie', 'Élodie', 'Inès', 'Sarah', 'Élise', 'Noémie', 'Clémence', 'Julie', 'Léa', 'Chloé', 'Emma', 'Laura', 'Mathilde', 'Lucie', 'Anaïs', 'Marion', 'Claire', 'Agathe', 'Héloïse'],
  reasons: [
    'prix annoncé sans justification',
    'second rendez-vous jamais fixé',
    'aucune relance après le premier appel',
    "estimation envoyée 9 jours plus tard",
    'jamais rappelée',
    'demande de visite restée sans réponse',
    'devis arrivé après un concurrent',
    "aucun rappel avant l'échéance",
  ],
  aiCapture: { label: 'Capture IA', items: ['visiteuse transformée en lead', 'formulaire rempli pour elle', 'demande de rappel enregistrée'] },
  aiFollow: { label: 'Relance IA', items: ['relance envoyée automatiquement', 'visite planifiée pour elle', 'estimation envoyée en 10 min', 'second rendez-vous fixé'] },
}
