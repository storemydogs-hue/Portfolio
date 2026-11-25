export interface SkillItem {
  id: string;
  name: string;
  category: 'Stratégie & Management' | 'Transformation & Data' | 'Architecture & Produit';
  level: number;
  summary: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  client: string;
  year: string;
  category: 'Transformation' | 'Plateformes Web' | 'Data & IA' | 'E-Commerce';
  impact: string;
  image: string;
  imageAlt: string;
  summary: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  location: string;
  type: 'Poste actuel' | 'Expérience' | 'Formation';
  description: string;
  highlights: string[];
}

export const PROFILE = {
  firstName: 'Jawad',
  lastName: 'Sadni',
  fullName: 'Jawad Sadni',
  role: 'Responsable du département Digital',
  company: 'Expert Digital',
  diploma: 'Master en digital et transformation Numérique',
  address: '45 Avenue 2 Mars – Casablanca, Maroc',
  email: 'Sadnijawad@gmail.com',
  portraitPath: '/src/assets/images/hero_jawad_portrait_1795627564322.jpg',
  heroLead:
    'Pilotage de la transformation numérique, architecture de plateformes digitales à fort impact et direction d’équipes pluridisciplinaires au sein d’Expert Digital à Casablanca.',
  aboutParagraphs: [
    'Titulaire d’un Master en digital et transformation Numérique, j’accompagne les organisations dans la structuration de leur feuille de route technologique et l’accélération de leur maturité digitale.',
    'En tant que Responsable du département Digital au sein de la société Expert Digital à Casablanca, je supervise la conception de solutions web et métier, l’automatisation des processus et l’alignement des produits numériques sur les objectifs de croissance.',
  ],
};

export const HERO_METRICS = [
  { value: '8+ ans', label: 'Direction & conseil digital' },
  { value: '35+', label: 'Programmes digitaux déployés' },
  { value: '18', label: 'Experts managés en équipe' },
  { value: '+42 %', label: 'Gain opérationnel moyen client' },
];

export const SKILLS: SkillItem[] = [
  {
    id: 'gov-digitale',
    name: 'Gouvernance & Stratégie Digitale',
    category: 'Stratégie & Management',
    level: 95,
    summary: 'Définition de schémas directeurs numériques, feuilles de route ROI et pilotage budgétaire.',
  },
  {
    id: 'management-equipe',
    name: 'Management d’Équipes Pluridisciplinaires',
    category: 'Stratégie & Management',
    level: 92,
    summary: 'Direction de chefs de projet, designers UX/UI, développeurs et consultants data en mode Agile.',
  },
  {
    id: 'transfo-process',
    name: 'Transformation des Processus Métier',
    category: 'Transformation & Data',
    level: 94,
    summary: 'Audit des flux existants, dématérialisation et conduite du changement auprès des directions.',
  },
  {
    id: 'data-bi',
    name: 'Pilotage par la Donnée & Analytics',
    category: 'Transformation & Data',
    level: 88,
    summary: 'Tableaux de bord décisionnels, suivi des KPI d’acquisition et gouvernance de la donnée client.',
  },
  {
    id: 'arch-web',
    name: 'Architecture Web & Plateformes Cloud',
    category: 'Architecture & Produit',
    level: 90,
    summary: 'Conception de portails d’entreprise, API sécurisées et écosystèmes applicatifs scalables.',
  },
  {
    id: 'ux-product',
    name: 'Design Produit & Expérience Utilisateur',
    category: 'Architecture & Produit',
    level: 89,
    summary: 'Ateliers de cadrage, prototypage orienté conversion et accessibilité multi-écrans.',
  },
  {
    id: 'omnichannel',
    name: 'Écosystèmes E-Commerce & CRM',
    category: 'Transformation & Data',
    level: 91,
    summary: 'Intégration ERP/CRM, parcours d’achat omnicanaux et fidélisation automatisée.',
  },
  {
    id: 'agile-delivery',
    name: 'Delivery Agile & Qualité Logicielle',
    category: 'Stratégie & Management',
    level: 93,
    summary: 'Méthodologies Scrum/Kanban, maîtrise des délais de livraison et assurance qualité continue.',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'erp-transformation',
    title: 'Refonte du Système d’Information & Portail Décisionnel',
    client: 'Groupe Industriel Atlas',
    year: '2025',
    category: 'Transformation',
    impact: '+38 % de productivité opérationnelle en 6 mois',
    image: '/src/assets/images/project_erp_transformation_1795627564582.jpg',
    imageAlt: 'Interface analytique de transformation digitale affichée sur un ordinateur portable moderne',
    summary:
      'Pilotage complet de la digitalisation des flux achats, logistique et reporting direction pour un groupe multi-sites.',
    challenge:
      'Des données dispersées sur plusieurs tableurs ralentissaient la prise de décision hebdomadaire et multipliaient les ressaisies.',
    solution:
      'Déploiement d’une plateforme unifiée reliée à l’ERP existant avec tableaux de bord temps réel et workflows de validation dématérialisés.',
    deliverables: ['Audit SI', 'Architecture Cloud', 'Tableau de bord BI', 'Formation équipes'],
    featured: true,
  },
  {
    id: 'ecommerce-omnichannel',
    title: 'Plateforme E-Commerce B2B & Mobile Omnicanale',
    client: 'Maison Dar & Style',
    year: '2024',
    category: 'E-Commerce',
    impact: '+64 % de commandes en ligne dès le premier trimestre',
    image: '/src/assets/images/project_ecommerce_platform_1795627565365.jpg',
    imageAlt: 'Application mobile et tablette présentant une plateforme e-commerce épurée',
    summary:
      'Conception de l’expérience d’achat mobile-first et synchronisation temps réel avec les stocks des points de vente.',
    challenge:
      'Unifier le catalogue national et offrir aux distributeurs un tunnel de commande rapide depuis smartphone.',
    solution:
      'Interface épurée, recherche instantanée par référence et connexion native au système de facturation.',
    deliverables: ['UX/UI Mobile-First', 'Connecteur Stock ERP', 'Paiement sécurisé'],
  },
  {
    id: 'data-automation',
    title: 'Architecture Data & Automatisation des Workflows Clients',
    client: 'FinTech Maghreb Services',
    year: '2024',
    category: 'Data & IA',
    impact: 'Temps de traitement réduit de 4 jours à 3 heures',
    image: '/src/assets/images/project_data_automation_1795627566427.jpg',
    imageAlt: 'Visualisation architecturale de flux de données modulaires connectés',
    summary:
      'Orchestration automatisée de l’onboarding client, scoring documentaire et notification multi-canal.',
    challenge:
      'Absorber une hausse de 300 % des demandes entrantes sans allonger les délais de conformité.',
    solution:
      'Pipeline d’intégration API sécurisé, contrôle automatique des pièces et suivi temps réel pour les conseillers.',
    deliverables: ['Pipeline API', 'Automatisation CRM', 'Monitoring SLA'],
  },
  {
    id: 'portal-client',
    title: 'Espace Client Digital & Gestion Documentaire Sécurisée',
    client: 'Cabinet Conseil Horizons',
    year: '2023',
    category: 'Plateformes Web',
    impact: '94 % d’adoption active par les clients grands comptes',
    image: '/src/assets/images/project_portal_client_1795627566126.jpg',
    imageAlt: 'Portail client professionnel affiché sur une tablette posée sur un bureau clair',
    summary:
      'Création d’un guichet numérique centralisant livrables, facturation, signature électronique et support dédié.',
    challenge:
      'Remplacer les échanges par pièces jointes par un espace collaboratif traçable et conforme.',
    solution:
      'Portail web responsive avec gestion fine des rôles, historique auditable et alertes automatisées.',
    deliverables: ['Portail Web', 'Signature électronique', 'Gestion des accès'],
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-expert-digital',
    period: '2022 — Présent',
    role: 'Responsable du département Digital',
    organization: 'Expert Digital',
    location: 'Casablanca, Maroc',
    type: 'Poste actuel',
    description:
      'Direction stratégique et opérationnelle du pôle digital. Pilotage des grands comptes, structuration des offres de transformation numérique et encadrement des équipes techniques et produit.',
    highlights: [
      'Supervision de plus de 20 programmes de transformation digitale et refontes de plateformes',
      'Croissance continue de l’activité du département et fidélisation des partenaires stratégiques',
      'Mise en place de standards d’architecture web, UX et suivi de la performance projet',
    ],
  },
  {
    id: 'exp-lead-consultant',
    period: '2019 — 2022',
    role: 'Chef de Projet Transformation Numérique',
    organization: 'Solutions & Conseil Digital',
    location: 'Casablanca, Maroc',
    type: 'Expérience',
    description:
      'Cadrage fonctionnel, pilotage agile et accompagnement au changement pour des entreprises de services, de distribution et d’industrie.',
    highlights: [
      'Rédaction des cahiers des charges, modélisation des processus cibles et coordination des développeurs',
      'Déploiement de solutions CRM, portails clients et outils de reporting décisionnel',
    ],
  },
  {
    id: 'exp-specialist',
    period: '2017 — 2019',
    role: 'Consultant Digital & Produit Web',
    organization: 'Agence Digitale Horizon',
    location: 'Casablanca, Maroc',
    type: 'Expérience',
    description:
      'Conception d’écosystèmes web orientés conversion, pilotage des campagnes d’acquisition et optimisation de l’expérience utilisateur.',
    highlights: [
      'Lancement de plateformes institutionnelles et marchandes responsives',
      'Analyse des parcours utilisateurs et amélioration mesurable des taux de conversion',
    ],
  },
  {
    id: 'edu-master',
    period: 'Diplôme d’État / Master',
    role: 'Master en digital et transformation Numérique',
    organization: 'Enseignement Supérieur Spécialisé',
    location: 'Maroc',
    type: 'Formation',
    description:
      'Formation supérieure dédiée à la gouvernance des systèmes d’information, à l’innovation numérique, à la stratégie data et au management de projets digitaux complexes.',
    highlights: [
      'Spécialisation en transformation organisationnelle et pilotage de la performance digitale',
      'Mémoire de recherche appliqué à l’adoption des plateformes numériques en entreprise',
    ],
  },
];
