import { WorkflowSquare01Icon, MessageProgrammingIcon, AiBrain01Icon, VoiceIcon, UserCheck01Icon, ZapIcon, GroupIcon, BarChartIcon, Clock01Icon, Calendar03Icon, Mail01Icon, Call02Icon, WhatsappIcon, InstagramIcon, Message01Icon, Globe02Icon, UserIcon, UserMultipleIcon, PlugSocketIcon } from '@hugeicons/core-free-icons'
import { N8nIcon } from './icons'

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
    Icon: N8nIcon,
    title: 'Formation n8n',
    description: "Apprenez à automatiser vos tâches répétitives avec n8n — sans coder. Des sessions pratiques adaptées à votre agence.",
  },
]

/* Homepage section: Camille, one assistant across every channel (the diagram is shared with /demos) */
export const HOME_CAMILLE = {
  label: 'Camille',
  title: 'Une seule assistante IA, sur tous vos canaux',
  description: "Camille montre ce que nous installons dans votre agence : une seule IA qui répond sur tous vos canaux et range chaque échange dans votre CRM. Parlez-lui avec les bulles en bas à droite.",
  link: 'Voir Camille canal par canal',
}

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
  chat: { label: 'Écrire à Camille, notre assistante IA' },
  phone: {
    label: 'Appeler Camille, notre assistante IA',
    title: 'Camille',
    badge: 'IA',
    subtitle: 'Assistante IA ImmoOps',
    intro: 'Parlez à Camille de votre agence, directement depuis votre navigateur. Autorisez le micro pour démarrer.',
    cta: 'Appeler',
    connecting: 'Connexion…',
    /* keys are LiveKit agent states; anything not listed (connecting, initializing…) shows `connecting` */
    status: { idle: 'Écoute', listening: 'Écoute', thinking: 'Réflexion', speaking: 'Parle', connecting: 'Connexion…' } as Record<string, string>,
    unavailable: 'Camille est indisponible pour le moment. Réessayez dans un instant.',
    enableSound: 'Activer le son',
    mute: 'Muet',
    unmute: 'Réactiver',
    hangUp: 'Raccrocher',
  },
  poweredBy: 'Propulsé par',
  close: 'Fermer',
}

/* Camille's chat window (floating chat bubble) */
export const CHAT_WIDGET = {
  name: 'Camille',
  status: 'En ligne',
  greeting: "Bonjour ! Je suis Camille, l'assistante IA d'ImmoOps. On aide les agences immobilières à gagner du temps avec l'IA : agents vocaux, chatbots, relances automatiques… Qu'est-ce qui vous amène ?",
  error: 'Désolée, une erreur est survenue.',
  placeholder: 'Posez votre question…',
  send: 'Envoyer',
  reset: 'Nouvelle conversation',
  minimize: 'Réduire',
  close: 'Fermer',
  /* Quick replies above the input: `ask` goes to Camille, `booking` answers with the Calendly card */
  chips: [
    { label: 'Nos services', Icon: WorkflowSquare01Icon, ask: 'Quels services proposez-vous aux agences immobilières ?' },
    { label: 'Agent vocal', Icon: VoiceIcon, ask: 'Comment fonctionne votre agent vocal ?' },
    { label: 'Chatbot', Icon: MessageProgrammingIcon, ask: 'Comment fonctionne votre chatbot pour une agence ?' },
    { label: 'Formation n8n', Icon: N8nIcon, ask: 'Parlez-moi de la formation n8n.' },
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
  names: ['Charlotte', 'Céline', 'Aurélie', 'Pauline', 'Manon', 'Clara', 'Justine', 'Margaux', 'Sophie', 'Amélie', 'Élodie', 'Inès', 'Sarah', 'Élise', 'Noémie', 'Clémence', 'Julie', 'Léa', 'Chloé', 'Emma', 'Laura', 'Mathilde', 'Lucie', 'Anaïs', 'Marion', 'Claire', 'Agathe', 'Héloïse'],
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

/* ─── /demos: where the agents work, and how it all lands in one CRM ─── */

export type ChannelKey = 'email' | 'phone' | 'whatsapp' | 'social' | 'sms' | 'web'

export interface AgentChannel {
  key: ChannelKey
  label: string
  Icon: object
  short: string
  does: string[]
  /** example exchange: `client` is the prospect, `agent` the AI */
  exchange: { from: 'client' | 'agent'; text: string }[]
  /** fields the exchange writes to the CRM */
  crm: { field: string; value: string }[]
}

export const AGENT_CHANNELS: AgentChannel[] = [
  {
    key: 'email',
    label: 'Email',
    Icon: Mail01Icon,
    short: 'Demandes des portails et boîte de l\'agence',
    does: [
      'Répond aux demandes SeLoger, Leboncoin et du site en moins de 2 minutes',
      'Pose les questions de qualification qui manquent',
      'Relance automatiquement sans réponse sous 48 h',
    ],
    exchange: [
      { from: 'client', text: 'Bonjour, le T3 rue Garibaldi est-il toujours disponible ?' },
      { from: 'agent', text: 'Bonjour Thomas, oui. Pour vous proposer une visite : quel est votre budget et votre délai d\'achat ?' },
    ],
    crm: [
      { field: 'Source', value: 'Email · SeLoger' },
      { field: 'Bien', value: 'T3 rue Garibaldi' },
      { field: 'Statut', value: 'À qualifier' },
    ],
  },
  {
    key: 'phone',
    label: 'Téléphone',
    Icon: Call02Icon,
    short: 'Appels entrants, 24 h/24',
    does: [
      'Décroche dès la première sonnerie, même le soir et le week-end',
      'Qualifie acheteur ou vendeur à la voix',
      'Réserve la visite ou le rappel dans le bon agenda',
    ],
    exchange: [
      { from: 'client', text: 'Bonjour, j\'appelle pour faire estimer mon appartement.' },
      { from: 'agent', text: 'Avec plaisir. Quelle est l\'adresse et la surface du bien ? Je peux vous proposer un rendez-vous mardi à 14 h.' },
    ],
    crm: [
      { field: 'Type', value: 'Vendeur' },
      { field: 'Demande', value: 'Estimation' },
      { field: 'Rendez-vous', value: 'Mardi 14 h' },
    ],
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    Icon: WhatsappIcon,
    short: 'Le canal préféré de vos clients',
    does: [
      'Envoie fiches de biens, photos et plans en un message',
      'Confirme et rappelle les visites la veille',
      'Passe la main à un conseiller dès que le client le demande',
    ],
    exchange: [
      { from: 'client', text: 'Les charges sont de combien ?' },
      { from: 'agent', text: '180 € par mois, chauffage compris. Je vous envoie la fiche complète avec les plans 📄' },
    ],
    crm: [
      { field: 'Canal préféré', value: 'WhatsApp' },
      { field: 'Documents', value: 'Fiche + plans envoyés' },
      { field: 'Intérêt', value: 'Élevé' },
    ],
  },
  {
    key: 'social',
    label: 'Réseaux sociaux',
    Icon: InstagramIcon,
    short: 'Messages Instagram et Facebook',
    does: [
      'Répond aux messages privés et aux commentaires sous vos annonces',
      'Transforme un simple « intéressé » en lead qualifié',
      'Propose directement une visite ou un appel',
    ],
    exchange: [
      { from: 'client', text: 'Elle est toujours dispo la maison à Caluire ?' },
      { from: 'agent', text: 'Oui ! Souhaitez-vous la visiter ? Je peux vous proposer samedi à 10 h ou 11 h.' },
    ],
    crm: [
      { field: 'Source', value: 'Instagram' },
      { field: 'Bien', value: 'Maison Caluire' },
      { field: 'Statut', value: 'Visite proposée' },
    ],
  },
  {
    key: 'sms',
    label: 'SMS',
    Icon: Message01Icon,
    short: 'Rappels et relances',
    does: [
      'Rappelle chaque rendez-vous la veille',
      'Relance les leads froids au bon moment',
      'Fonctionne sans application, sur tous les téléphones',
    ],
    exchange: [
      { from: 'agent', text: 'Rappel : visite demain à 10 h, 12 rue Garibaldi. Répondez 1 pour confirmer, 2 pour décaler.' },
      { from: 'client', text: '1' },
    ],
    crm: [
      { field: 'Visite', value: 'Confirmée' },
      { field: 'Relance', value: 'Aucune nécessaire' },
    ],
  },
  {
    key: 'web',
    label: 'Site web',
    Icon: Globe02Icon,
    short: 'Chat sur votre site',
    does: [
      'Répond aux visiteurs à toute heure, sans formulaire',
      'Propose les biens qui correspondent aux critères',
      'Recueille les coordonnées avec le consentement du visiteur',
    ],
    exchange: [
      { from: 'client', text: 'Je cherche un T3 à Lyon 6e, budget 450 000 €.' },
      { from: 'agent', text: 'J\'ai 3 biens qui correspondent. Je vous les envoie par email ou par WhatsApp ?' },
    ],
    crm: [
      { field: 'Budget', value: '450 000 €' },
      { field: 'Recherche', value: 'T3 · Lyon 6e' },
      { field: 'Consentement', value: 'Oui' },
    ],
  },
]

export const DEMOS_PAGE = {
  hero: {
    label: 'Démos',
    title: 'Un agent IA sur tous vos canaux, un seul CRM',
    description: "Email, téléphone, WhatsApp, réseaux sociaux, SMS, site web : l'agent répond partout avec la même qualité, et chaque échange arrive dans votre CRM.",
  },
  hub: {
    channelsLabel: 'Vos canaux',
    agentLabel: 'Agent IA',
    agentTitle: 'ImmoOps',
    agentSteps: ['Comprend la demande', 'Qualifie : budget, zone, délai', 'Agit : répond, relance, planifie'],
    crmLabel: 'Votre CRM',
    crmFields: ['Contact', 'Projet et budget', 'Historique complet', 'Prochaine action'],
  },
  channels: {
    label: 'Canal par canal',
    title: 'Ce que fait l\'agent, partout où vos clients écrivent',
    description: 'Choisissez un canal pour voir un échange type et ce qui est envoyé dans votre CRM.',
    doesTitle: 'Ce que fait l\'agent',
    exchangeTitle: 'Exemple d\'échange',
    crmTitle: 'Envoyé au CRM',
    client: 'Client',
    agent: 'Agent IA',
  },
  crm: {
    label: 'Un seul CRM',
    title: 'Chaque échange arrive au même endroit',
    description: 'Peu importe le canal : une seule fiche par client, avec tout l\'historique, à jour en temps réel.',
    example: 'Exemple de fiche lead',
    lead: { initials: 'TM', name: 'Thomas Martin', tags: ['Acheteur', 'T3 · Lyon 6e', '450 000 €'], score: 'Lead chaud' },
    timeline: [
      { channel: 'email', time: 'Lun 09:12', text: 'Demande via SeLoger pour le T3 rue Garibaldi' },
      { channel: 'email', time: 'Lun 09:13', text: 'Réponse de l\'agent : budget 450 k€, achat sous 3 mois' },
      { channel: 'whatsapp', time: 'Lun 18:40', text: 'Fiche du bien et plans envoyés' },
      { channel: 'phone', time: 'Mar 11:05', text: 'Visite réservée jeudi 10 h dans l\'agenda de Marc' },
      { channel: 'sms', time: 'Mer 18:00', text: 'Rappel de visite confirmé par le client' },
      { channel: 'advisor', time: 'Jeu 10:45', text: 'Marc : visite faite, offre en préparation' },
    ] as { channel: ChannelKey | 'advisor'; time: string; text: string }[],
    advisor: 'Conseiller',
    nextAction: 'Prochaine action : relancer l\'offre vendredi',
    sync: [
      { Icon: UserIcon, title: 'Une fiche par client', description: 'Même personne par email, WhatsApp ou téléphone ? Une seule fiche, sans doublon.' },
      { Icon: Clock01Icon, title: 'Historique complet', description: 'Messages, appels avec transcription et relances, tout est horodaté.' },
      { Icon: UserMultipleIcon, title: 'Votre équipe au bon moment', description: 'Visites dans le bon agenda, conseiller notifié dès qu\'un lead est chaud.' },
      { Icon: PlugSocketIcon, title: 'Votre CRM actuel', description: 'HubSpot, Salesforce, Apimo, Airtable… On se branche sur ce que vous utilisez déjà.' },
    ],
  },
  tour: {
    label: 'Visite virtuelle',
    title: 'Explorez un bien en 360°',
    description: 'Naviguez dans le bien comme si vous y étiez, directement depuis votre navigateur.',
  },
}
