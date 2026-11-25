/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Mail,
  MapPin,
  Menu,
  Upload,
  X,
} from 'lucide-react';
import { ResilientImage } from './components/ResilientImage';
import {
  EXPERIENCES,
  HERO_METRICS,
  PROFILE,
  PROJECTS,
  type ProjectItem,
  SKILLS,
} from './data/portfolioData';
import { generateStandaloneHtml } from './utils/exportSingleHtml';

type SkillFilter =
  | 'Toutes'
  | 'Stratégie & Management'
  | 'Transformation & Data'
  | 'Architecture & Produit';

type ProjectFilter =
  | 'Tous'
  | 'Transformation'
  | 'E-Commerce'
  | 'Data & IA'
  | 'Plateformes Web';

const SKILL_CATEGORIES: SkillFilter[] = [
  'Toutes',
  'Stratégie & Management',
  'Transformation & Data',
  'Architecture & Produit',
];

const PROJECT_CATEGORIES: ProjectFilter[] = [
  'Tous',
  'Transformation',
  'E-Commerce',
  'Data & IA',
  'Plateformes Web',
];

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [skillFilter, setSkillFilter] = useState<SkillFilter>('Toutes');
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('Tous');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [portraitSrc, setPortraitSrc] = useState<string>(PROFILE.portraitPath);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredSkills =
    skillFilter === 'Toutes'
      ? SKILLS
      : SKILLS.filter((skill) => skill.category === skillFilter);

  const filteredProjects =
    projectFilter === 'Tous'
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === projectFilter);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveProject(null);
        setMobileMenuOpen(false);
      }
      if (activeProject) {
        const currentIndex = PROJECTS.findIndex((p) => p.id === activeProject.id);
        if (event.key === 'ArrowRight' && currentIndex !== -1) {
          setActiveProject(PROJECTS[(currentIndex + 1) % PROJECTS.length]);
        } else if (event.key === 'ArrowLeft' && currentIndex !== -1) {
          setActiveProject(
            PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length],
          );
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProject]);

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPortraitSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExportHtml = async () => {
    setIsExporting(true);
    try {
      const htmlContent = await generateStandaloneHtml(portraitSrc);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'portfolio-jawad-sadni.html';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleContactSubmit = (event: FormEvent) => {
    event.preventDefault();
    setContactError('');

    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactError('Veuillez renseigner votre nom, email et message.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail.trim())) {
      setContactError('Veuillez saisir une adresse email valide.');
      return;
    }

    setContactSubmitted(true);
  };

  const handleNavigateProject = (direction: -1 | 1) => {
    if (!activeProject) return;
    const idx = PROJECTS.findIndex((p) => p.id === activeProject.id);
    if (idx === -1) return;
    const nextIdx = (idx + direction + PROJECTS.length) % PROJECTS.length;
    setActiveProject(PROJECTS[nextIdx]);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white text-zinc-950">
        {/* 1. Navigation Section (3-Zone Top Bar Contract) */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
          <div className="max-w-[1200px] mx-auto px-6 h-16 md:h-[72px] flex items-center justify-between gap-8">
            {/* Zone 1: Single-line Brand Wordmark */}
            <a
              href="#hero"
              className="font-display text-lg font-bold tracking-tight text-zinc-950 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-4 rounded"
            >
              {PROFILE.fullName}
            </a>

            {/* Zone 2: Concise single-line navigation links */}
            <nav
              aria-label="Navigation principale"
              className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600"
            >
              <a
                href="#apropos"
                className="hover:text-zinc-950 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-zinc-950"
              >
                À propos
              </a>
              <a
                href="#competences"
                className="hover:text-zinc-950 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-zinc-950"
              >
                Compétences
              </a>
              <a
                href="#projets"
                className="hover:text-zinc-950 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-zinc-950"
              >
                Projets
              </a>
              <a
                href="#experiences"
                className="hover:text-zinc-950 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-zinc-950"
              >
                Expériences
              </a>
            </nav>

            {/* Zone 3: Primary Action + Mobile Menu Trigger */}
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="#contact"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-zinc-950 rounded-lg hover:bg-blue-600 transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[40px]"
              >
                Me contacter
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-zinc-200 text-zinc-900 hover:bg-zinc-50 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                aria-label="Navigation mobile"
                className="md:hidden border-t border-zinc-200 bg-white px-6 py-4 flex flex-col gap-1"
              >
                {[
                  { href: '#apropos', label: 'À propos' },
                  { href: '#competences', label: 'Compétences' },
                  { href: '#projets', label: 'Projets' },
                  { href: '#experiences', label: 'Expériences' },
                  { href: '#contact', label: 'Contact' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center text-base font-medium text-zinc-800 hover:text-blue-600 transition-colors border-b border-zinc-100 last:border-none"
                  >
                    {item.label}
                  </a>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        <main>
          {/* 2. Hero Section */}
          <section id="hero" className="pt-10 pb-14 md:pt-16 md:pb-20 bg-white">
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
                {/* Left Column: Typographic Hierarchy */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="lg:col-span-7 flex flex-col justify-center"
                >
                  <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-zinc-500 mb-5">
                    <span className="text-blue-600 font-semibold">{PROFILE.company}</span>
                    <span aria-hidden="true">·</span>
                    <span>Casablanca, Maroc</span>
                  </div>

                  <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-bold tracking-tight text-zinc-950 leading-[1.05] text-balance mb-4">
                    {PROFILE.fullName}
                  </h1>

                  <p className="text-xl sm:text-2xl font-medium text-zinc-800 mb-5 text-balance">
                    {PROFILE.role}
                  </p>

                  <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-[60ch] mb-8">
                    {PROFILE.heroLead}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="#contact"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-zinc-950 rounded-xl hover:bg-blue-600 transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[44px]"
                    >
                      <span>Discuter d’un projet</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={handleExportHtml}
                      disabled={isExporting}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-zinc-900 bg-white border border-zinc-200 rounded-xl hover:border-zinc-950 transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[44px] disabled:opacity-60 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        {isExporting ? 'Génération...' : 'Exporter en HTML unique'}
                      </span>
                    </button>
                  </div>
                </motion.div>

                {/* Right Column: Hero Portrait Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, delay: 0.08, ease: EASE_OUT }}
                  className="lg:col-span-5 relative group"
                >
                  <div className="relative h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50">
                    <ResilientImage
                      src={portraitSrc}
                      alt={`Portrait professionnel de ${PROFILE.fullName}, ${PROFILE.role}`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                      fallbackTitle={PROFILE.fullName}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-zinc-950/75 via-zinc-950/35 to-transparent flex items-end justify-between gap-3">
                      <div className="text-white">
                        <p className="text-sm font-semibold leading-tight">
                          {PROFILE.fullName}
                        </p>
                        <p className="text-xs text-zinc-200 mt-0.5">
                          {PROFILE.diploma}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-950 bg-white/95 hover:bg-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px]"
                        title="Importer votre photo personnelle dans le Hero"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Ma photo</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        aria-label="Importer une photo personnelle"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Full-Width 4-Column KPI Strip Below Hero Split */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16, ease: EASE_OUT }}
                className="mt-12 pt-8 border-t border-zinc-200 grid grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {HERO_METRICS.map((metric) => (
                  <div key={metric.label}>
                    <div className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 tabular-nums">
                      {metric.value}
                    </div>
                    <div className="text-sm text-zinc-600 mt-1">{metric.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Animated Editorial Marquee Divider */}
          <div
            aria-hidden="true"
            className="border-y border-zinc-200 bg-zinc-50/70 py-3.5 overflow-hidden select-none"
          >
            <div className="animate-marquee text-xs sm:text-sm font-medium text-zinc-500 tracking-wide">
              <span className="px-6">
                transformation numérique · stratégie digitale · architecture produit · expert digital casablanca · gouvernance data ·
              </span>
              <span className="px-6">
                transformation numérique · stratégie digitale · architecture produit · expert digital casablanca · gouvernance data ·
              </span>
            </div>
          </div>

          {/* 3. About Section */}
          <section id="apropos" className="py-20 md:py-24 bg-white">
            <div className="max-w-[1200px] mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                className="mb-12"
              >
                <p className="text-sm font-semibold text-blue-600 mb-2">
                  01. À propos
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 text-balance max-w-2xl">
                  Aligner l’ambition métier et l’exécution numérique
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: 0.05, ease: EASE_OUT }}
                  className="lg:col-span-6 space-y-5 text-base text-zinc-600 leading-relaxed"
                >
                  {PROFILE.aboutParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  <blockquote className="pt-4 border-t border-zinc-200 font-serif text-xl italic text-zinc-800 leading-snug">
                    « La transformation numérique réussie repose sur la clarté stratégique, la qualité d’exécution technique et l’appropriation humaine. »
                  </blockquote>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: 0.1, ease: EASE_OUT }}
                  className="lg:col-span-6 border-t border-zinc-200"
                >
                  {[
                    { label: 'Nom', value: PROFILE.lastName },
                    { label: 'Prénom', value: PROFILE.firstName },
                    {
                      label: 'Fonction',
                      value: `${PROFILE.role} — ${PROFILE.company}`,
                    },
                    { label: 'Diplôme', value: PROFILE.diploma },
                    { label: 'Adresse', value: PROFILE.address },
                    { label: 'Email', value: PROFILE.email },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="py-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6"
                    >
                      <span className="text-sm text-zinc-500 shrink-0">
                        {row.label}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-zinc-950 sm:text-right">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* 4. Skills Section */}
          <section
            id="competences"
            className="py-20 md:py-24 bg-zinc-50/50 border-t border-zinc-200"
          >
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <p className="text-sm font-semibold text-blue-600 mb-2">
                    02. Compétences
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 text-balance">
                    Savoir-faire & domaines d’expertise
                  </h2>
                </div>

                {/* Interactive Filter Tabs */}
                <div
                  role="tablist"
                  aria-label="Filtrer les compétences par domaine"
                  className="inline-flex flex-wrap items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200"
                >
                  {SKILL_CATEGORIES.map((category) => {
                    const active = skillFilter === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setSkillFilter(category)}
                        className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] ${
                          active
                            ? 'bg-white text-zinc-950 shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredSkills.map((skill, idx) => (
                  <motion.article
                    key={skill.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{
                      duration: 0.35,
                      delay: idx * 0.04,
                      ease: EASE_OUT,
                    }}
                    className="p-6 bg-white border border-zinc-200 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="text-xs text-zinc-500 font-medium mb-1">
                            {skill.category}
                          </div>
                          <h3 className="font-display text-lg font-semibold text-zinc-950">
                            {skill.name}
                          </h3>
                        </div>
                        <span className="text-sm font-bold text-blue-600 tabular-nums shrink-0">
                          {skill.level}%
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 leading-relaxed mb-5">
                        {skill.summary}
                      </p>
                    </div>

                    <div
                      aria-hidden="true"
                      className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden"
                    >
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: skill.level / 100 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.65, ease: EASE_OUT }}
                        style={{ transformOrigin: 'left center' }}
                        className="h-full w-full bg-blue-600 rounded-full"
                      />
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Projets Section */}
          <section id="projets" className="py-20 md:py-24 bg-white border-t border-zinc-200">
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <p className="text-sm font-semibold text-blue-600 mb-2">
                    03. Projets
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 text-balance">
                    Réalisations & études de cas
                  </h2>
                </div>

                <div
                  role="tablist"
                  aria-label="Filtrer les projets par catégorie"
                  className="inline-flex flex-wrap items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200"
                >
                  {PROJECT_CATEGORIES.map((category) => {
                    const active = projectFilter === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setProjectFilter(category)}
                        className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] ${
                          active
                            ? 'bg-white text-zinc-950 shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((project, index) => {
                  const isFeatured =
                    projectFilter === 'Tous' && project.featured;
                  return (
                    <motion.article
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.12 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                        ease: EASE_OUT,
                      }}
                      className={`group border border-zinc-200 rounded-2xl overflow-hidden bg-white hover:border-zinc-400 transition-colors duration-200 ${
                        isFeatured
                          ? 'md:col-span-2 grid grid-cols-1 lg:grid-cols-12'
                          : 'flex flex-col'
                      }`}
                    >
                      <div
                        className={`overflow-hidden bg-zinc-50 ${
                          isFeatured
                            ? 'lg:col-span-7 min-h-[260px] lg:min-h-[360px]'
                            : 'aspect-[4/3]'
                        }`}
                      >
                        <ResilientImage
                          src={project.image}
                          alt={project.imageAlt}
                          fallbackTitle={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>

                      <div
                        className={`p-6 sm:p-8 flex flex-col justify-between gap-5 ${
                          isFeatured ? 'lg:col-span-5' : 'flex-1'
                        }`}
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 font-medium mb-2.5 tabular-nums">
                            <span>{project.client}</span>
                            <span aria-hidden="true">·</span>
                            <span>{project.year}</span>
                            <span aria-hidden="true">·</span>
                            <span>{project.category}</span>
                          </div>
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 leading-snug mb-3 text-balance">
                            {project.title}
                          </h3>
                          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                            {project.summary}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-zinc-200 flex items-center justify-between gap-4">
                          <span className="text-xs sm:text-sm font-semibold text-zinc-900">
                            {project.impact}
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveProject(project)}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0 cursor-pointer py-1"
                          >
                            <span>Détails</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 6. Expériences Section */}
          <section
            id="experiences"
            className="py-20 md:py-24 bg-zinc-50/50 border-t border-zinc-200"
          >
            <div className="max-w-[1200px] mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                className="mb-12"
              >
                <p className="text-sm font-semibold text-blue-600 mb-2">
                  04. Expériences & Formation
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 text-balance">
                  Parcours professionnel et académique
                </h2>
              </motion.div>

              <div className="border-t border-zinc-200">
                {EXPERIENCES.map((exp, idx) => (
                  <motion.article
                    key={exp.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.4,
                      delay: idx * 0.05,
                      ease: EASE_OUT,
                    }}
                    className="py-8 border-b border-zinc-200 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8"
                  >
                    <div className="lg:col-span-4">
                      <div className="font-display text-lg font-bold text-zinc-950 tabular-nums">
                        {exp.period}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                        <span>{exp.type}</span>
                        <span aria-hidden="true">·</span>
                        <span>{exp.location}</span>
                      </div>
                    </div>

                    <div className="lg:col-span-8">
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-semibold text-blue-600 mt-1 mb-3">
                        {exp.organization}
                      </p>
                      <p className="text-base text-zinc-600 leading-relaxed mb-4">
                        {exp.description}
                      </p>
                      <ul className="space-y-2 text-sm text-zinc-600">
                        {exp.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-start gap-2.5">
                            <span
                              aria-hidden="true"
                              className="mt-2 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"
                            />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          {/* 7. Contact Section */}
          <section id="contact" className="py-20 md:py-24 bg-white border-t border-zinc-200">
            <div className="max-w-[1200px] mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                className="mb-12"
              >
                <p className="text-sm font-semibold text-blue-600 mb-2">
                  05. Contact
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 text-balance max-w-2xl">
                  Échanger sur votre transformation digitale
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Direct Coordinates */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                  className="lg:col-span-5 p-8 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-6"
                >
                  <div>
                    <div className="text-xs font-medium text-zinc-500 mb-1">
                      Profil
                    </div>
                    <div className="font-display text-xl font-bold text-zinc-950">
                      {PROFILE.fullName}
                    </div>
                    <div className="text-sm text-zinc-600 mt-1">
                      {PROFILE.role} · {PROFILE.company}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-zinc-200 space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-zinc-500">
                          Adresse
                        </div>
                        <div className="text-sm font-semibold text-zinc-950 mt-0.5">
                          {PROFILE.address}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-zinc-500">
                          Email direct
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <a
                            href={`mailto:${PROFILE.email}`}
                            className="text-sm font-semibold text-zinc-950 hover:text-blue-600 transition-colors truncate"
                          >
                            {PROFILE.email}
                          </a>
                          <button
                            type="button"
                            onClick={handleCopyEmail}
                            aria-label="Copier l'adresse email"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:border-zinc-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            {copiedEmail ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Copié</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copier</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-zinc-200">
                    <div className="text-xs font-medium text-zinc-500 mb-1">
                      Formation supérieure
                    </div>
                    <div className="text-sm font-semibold text-zinc-950">
                      {PROFILE.diploma}
                    </div>
                  </div>
                </motion.div>

                {/* Interactive Contact Form */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: 0.06, ease: EASE_OUT }}
                  className="lg:col-span-7 p-8 bg-white border border-zinc-200 rounded-2xl"
                >
                  {contactSubmitted ? (
                    <div className="py-8 space-y-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600">
                        <Check className="w-6 h-6" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-zinc-950">
                        Message prêt à être transmis
                      </h3>
                      <p className="text-sm sm:text-base text-zinc-600 max-w-lg">
                        Merci {contactName}. Votre demande concernant «{' '}
                        {contactSubject || 'Projet Digital'} » est prête pour envoi à{' '}
                        <span className="font-semibold text-zinc-950">
                          {PROFILE.email}
                        </span>
                        .
                      </p>
                      <div className="flex flex-wrap gap-3 pt-2">
                        <a
                          href={`mailto:${PROFILE.email}?subject=${encodeURIComponent(
                            contactSubject || `Contact Portfolio — ${contactName}`,
                          )}&body=${encodeURIComponent(
                            `Nom : ${contactName}\nEmail : ${contactEmail}\n\n${contactMessage}`,
                          )}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-zinc-950 rounded-xl hover:bg-blue-600 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Ouvrir dans la messagerie</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setContactSubmitted(false);
                            setContactName('');
                            setContactEmail('');
                            setContactSubject('');
                            setContactMessage('');
                          }}
                          className="px-4 py-2.5 text-sm font-medium text-zinc-700 border border-zinc-200 rounded-xl hover:border-zinc-950 transition-colors cursor-pointer"
                        >
                          Envoyer un autre message
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-5" noValidate>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="contact-name"
                            className="block text-sm font-semibold text-zinc-900 mb-1.5"
                          >
                            Nom complet
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Votre nom et prénom"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact-email"
                            className="block text-sm font-semibold text-zinc-900 mb-1.5"
                          >
                            Email professionnel
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="vous@entreprise.ma"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-subject"
                          className="block text-sm font-semibold text-zinc-900 mb-1.5"
                        >
                          Objet
                        </label>
                        <input
                          id="contact-subject"
                          type="text"
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          placeholder="Audit digital, refonte plateforme, partenariat..."
                          className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-message"
                          className="block text-sm font-semibold text-zinc-900 mb-1.5"
                        >
                          Message
                        </label>
                        <textarea
                          id="contact-message"
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Décrivez vos objectifs, délais ou enjeux actuels..."
                          className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors resize-y"
                          required
                        />
                      </div>

                      {contactError && (
                        <p role="alert" className="text-sm font-medium text-rose-600">
                          {contactError}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-zinc-950 rounded-xl hover:bg-blue-600 transition-colors duration-150 cursor-pointer min-h-[44px]"
                        >
                          <span>Envoyer le message</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-zinc-500">
                          Réponse sous 24 heures ouvrées
                        </span>
                      </div>
                    </form>
                  )}
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-zinc-200 bg-white py-8">
          <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-zinc-500">
            <div>
              © 2026 {PROFILE.fullName} — {PROFILE.address}
            </div>
            <button
              type="button"
              onClick={handleExportHtml}
              disabled={isExporting}
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger le portfolio en fichier HTML unique</span>
            </button>
          </div>
        </footer>

        {/* Project Lightbox Modal */}
        <AnimatePresence>
          {activeProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveProject(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 12 }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border border-zinc-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 tabular-nums mb-1.5">
                      <span>{activeProject.client}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeProject.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeProject.category}</span>
                    </div>
                    <h3
                      id="project-modal-title"
                      className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 text-balance"
                    >
                      {activeProject.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveProject(null)}
                    aria-label="Fermer la fenêtre"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:border-zinc-950 transition-colors shrink-0 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 mb-6">
                  <ResilientImage
                    src={activeProject.image}
                    alt={activeProject.imageAlt}
                    fallbackTitle={activeProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-950 mb-1.5">
                      Enjeu initial
                    </h4>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {activeProject.challenge}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-950 mb-1.5">
                      Solution déployée
                    </h4>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {activeProject.solution}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <span className="text-xs font-medium text-zinc-500 block">
                      Impact mesuré
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {activeProject.impact}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-600">
                    <span className="font-semibold text-zinc-900">Livrables : </span>
                    {activeProject.deliverables.join(' · ')}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
                  <button
                    type="button"
                    onClick={() => handleNavigateProject(-1)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 hover:text-zinc-950 cursor-pointer py-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Projet précédent</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigateProject(1)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 hover:text-zinc-950 cursor-pointer py-1.5"
                  >
                    <span>Projet suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
