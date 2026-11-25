import {
  EXPERIENCES,
  HERO_METRICS,
  PROFILE,
  PROJECTS,
  SKILLS,
} from '../data/portfolioData';

async function imageUrlToDataUri(url: string): Promise<string> {
  if (url.startsWith('data:')) {
    return url;
  }
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(typeof reader.result === 'string' ? reader.result : url);
      };
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function generateStandaloneHtml(portraitSrc: string): Promise<string> {
  const embeddedPortrait = await imageUrlToDataUri(portraitSrc);
  const embeddedProjects = await Promise.all(
    PROJECTS.map(async (project) => ({
      ...project,
      embeddedImage: await imageUrlToDataUri(project.image),
    })),
  );

  const metricsHtml = HERO_METRICS.map(
    (m) => `
      <div class="kpi-item">
        <div class="kpi-value">${escapeHtml(m.value)}</div>
        <div class="kpi-label">${escapeHtml(m.label)}</div>
      </div>`,
  ).join('');

  const skillsHtml = SKILLS.map(
    (skill) => `
      <article class="skill-card reveal" data-category="${escapeHtml(skill.category)}">
        <div class="skill-header">
          <div>
            <div class="meta-line">${escapeHtml(skill.category)}</div>
            <h3>${escapeHtml(skill.name)}</h3>
          </div>
          <span class="skill-pct">${skill.level}%</span>
        </div>
        <p>${escapeHtml(skill.summary)}</p>
        <div class="bar-track" aria-hidden="true">
          <div class="bar-fill" style="transform: scaleX(${skill.level / 100})"></div>
        </div>
      </article>`,
  ).join('');

  const projectsHtml = embeddedProjects
    .map(
      (project, idx) => `
      <article class="project-card reveal ${project.featured ? 'project-featured' : ''}" data-category="${escapeHtml(project.category)}">
        <div class="project-media">
          <img src="${project.embeddedImage}" alt="${escapeHtml(project.imageAlt)}" />
        </div>
        <div class="project-body">
          <div class="meta-line">
            <span>${escapeHtml(project.client)}</span>
            <span>·</span>
            <span>${escapeHtml(project.year)}</span>
            <span>·</span>
            <span>${escapeHtml(project.category)}</span>
          </div>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.summary)}</p>
          <div class="project-foot">
            <span class="impact-text">${escapeHtml(project.impact)}</span>
            <button type="button" class="link-btn" onclick="openProjectModal(${idx})">Voir le détail →</button>
          </div>
        </div>
      </article>`,
    )
    .join('');

  const experiencesHtml = EXPERIENCES.map(
    (exp) => `
      <article class="exp-row reveal">
        <div class="exp-period">
          <span class="exp-date">${escapeHtml(exp.period)}</span>
          <span class="meta-line">${escapeHtml(exp.type)} · ${escapeHtml(exp.location)}</span>
        </div>
        <div class="exp-main">
          <h3>${escapeHtml(exp.role)}</h3>
          <div class="exp-org">${escapeHtml(exp.organization)}</div>
          <p>${escapeHtml(exp.description)}</p>
          <ul>
            ${exp.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
      </article>`,
  ).join('');

  const projectsJson = JSON.stringify(
    embeddedProjects.map((p) => ({
      title: p.title,
      client: p.client,
      year: p.year,
      category: p.category,
      impact: p.impact,
      image: p.embeddedImage,
      imageAlt: p.imageAlt,
      summary: p.summary,
      challenge: p.challenge,
      solution: p.solution,
      deliverables: p.deliverables,
    })),
  );

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(PROFILE.fullName)} — Portfolio Digital</title>
  <meta name="description" content="Portfolio professionnel de ${escapeHtml(PROFILE.fullName)}, ${escapeHtml(PROFILE.role)} chez ${escapeHtml(PROFILE.company)} à Casablanca." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #ffffff;
      --surface: #f8fafc;
      --border: #e4e4e7;
      --ink: #09090b;
      --muted: #52525b;
      --accent: #2563eb;
      --accent-dark: #1d4ed8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: var(--ink); background: var(--bg); }
    body { line-height: 1.6; background: var(--bg); }
    h1, h2, h3, .font-display { font-family: 'Bricolage Grotesque', system-ui, sans-serif; letter-spacing: -0.025em; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    header { position: sticky; top: 0; z-index: 40; background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
    .nav-bar { display: flex; align-items: center; justify-content: space-between; gap: 32px; height: 72px; }
    .brand { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 1.15rem; color: var(--ink); text-decoration: none; white-space: nowrap; }
    .nav-links { display: flex; align-items: center; gap: 28px; }
    .nav-links a { font-size: 0.9rem; font-weight: 500; color: var(--muted); text-decoration: none; white-space: nowrap; transition: color 180ms ease; }
    .nav-links a:hover { color: var(--ink); }
    .btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; border-radius: 10px; background: var(--ink); color: #fff; font-size: 0.875rem; font-weight: 600; text-decoration: none; border: none; cursor: pointer; white-space: nowrap; transition: background 180ms ease, transform 180ms ease; }
    .btn-primary:hover { background: var(--accent); transform: translateY(-1px); }
    .btn-secondary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; border-radius: 10px; background: #fff; color: var(--ink); font-size: 0.875rem; font-weight: 600; text-decoration: none; border: 1px solid var(--border); cursor: pointer; white-space: nowrap; transition: border-color 180ms ease, transform 180ms ease; }
    .btn-secondary:hover { border-color: var(--ink); transform: translateY(-1px); }
    section { padding: 88px 0; }
    .hero { padding: 56px 0 64px; }
    .hero-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 48px; align-items: stretch; }
    .kicker { font-size: 0.875rem; color: var(--accent); font-weight: 600; margin-bottom: 16px; }
    .hero h1 { font-size: clamp(2.5rem, 4.5vw, 4rem); line-height: 1.05; margin-bottom: 16px; text-wrap: balance; }
    .hero-role { font-size: 1.25rem; font-weight: 600; color: var(--ink); margin-bottom: 16px; }
    .hero-lead { font-size: 1.05rem; color: var(--muted); max-width: 58ch; margin-bottom: 32px; }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }
    .hero-portrait-wrap { border-radius: 20px; overflow: hidden; border: 1px solid var(--border); background: var(--surface); min-height: 440px; }
    .hero-portrait-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
    .kpi-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--border); }
    .kpi-value { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.85rem; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--ink); }
    .kpi-label { font-size: 0.875rem; color: var(--muted); margin-top: 4px; }
    .section-head { margin-bottom: 40px; }
    .section-head h2 { font-size: clamp(1.85rem, 3vw, 2.5rem); margin-top: 8px; text-wrap: balance; }
    .meta-line { display: flex; flex-wrap: wrap; gap: 8px; font-size: 0.82rem; color: var(--muted); font-weight: 500; }
    .about-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: start; }
    .about-copy p { color: var(--muted); font-size: 1.02rem; margin-bottom: 18px; }
    .identity-list { border-top: 1px solid var(--border); }
    .identity-row { display: flex; justify-content: space-between; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border); font-size: 0.94rem; }
    .identity-row strong { color: var(--muted); font-weight: 500; }
    .identity-row span { color: var(--ink); font-weight: 600; text-align: right; }
    .filter-bar { display: inline-flex; flex-wrap: wrap; gap: 6px; padding: 4px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 32px; }
    .filter-btn { padding: 8px 14px; font-size: 0.84rem; font-weight: 500; border: none; background: transparent; color: var(--muted); border-radius: 8px; cursor: pointer; transition: all 160ms ease; }
    .filter-btn.active { background: #fff; color: var(--ink); box-shadow: 0 1px 2px rgba(0,0,0,0.06); }
    .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .skill-card { padding: 24px; border: 1px solid var(--border); border-radius: 16px; background: #fff; }
    .skill-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 8px; }
    .skill-header h3 { font-size: 1.1rem; margin-top: 4px; }
    .skill-pct { font-weight: 700; font-size: 0.95rem; font-variant-numeric: tabular-nums; color: var(--accent); }
    .skill-card p { font-size: 0.92rem; color: var(--muted); margin-bottom: 16px; }
    .bar-track { height: 6px; background: var(--surface); border-radius: 999px; overflow: hidden; }
    .bar-fill { height: 100%; background: var(--accent); transform-origin: left center; }
    .projects-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .project-card { border: 1px solid var(--border); border-radius: 20px; overflow: hidden; background: #fff; display: flex; flex-direction: column; transition: transform 200ms ease; }
    .project-card:hover { transform: translateY(-3px); }
    .project-featured { grid-column: span 2; display: grid; grid-template-columns: 1.15fr 0.85fr; }
    .project-media { background: var(--surface); aspect-ratio: 16 / 10; overflow: hidden; }
    .project-featured .project-media { aspect-ratio: auto; min-height: 320px; }
    .project-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .project-body { padding: 28px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px; }
    .project-body h3 { font-size: 1.35rem; line-height: 1.25; }
    .project-body p { font-size: 0.94rem; color: var(--muted); }
    .project-foot { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding-top: 16px; border-top: 1px solid var(--border); margin-top: auto; }
    .impact-text { font-size: 0.84rem; font-weight: 600; color: var(--ink); }
    .link-btn { background: none; border: none; color: var(--accent); font-weight: 600; font-size: 0.88rem; cursor: pointer; white-space: nowrap; }
    .exp-list { border-top: 1px solid var(--border); }
    .exp-row { display: grid; grid-template-columns: 280px 1fr; gap: 32px; padding: 32px 0; border-bottom: 1px solid var(--border); }
    .exp-date { display: block; font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.05rem; font-weight: 700; font-variant-numeric: tabular-nums; margin-bottom: 4px; }
    .exp-main h3 { font-size: 1.25rem; }
    .exp-org { font-weight: 600; color: var(--accent); margin: 4px 0 12px; font-size: 0.95rem; }
    .exp-main p { color: var(--muted); margin-bottom: 12px; }
    .exp-main ul { padding-left: 18px; color: var(--muted); font-size: 0.92rem; display: grid; gap: 6px; }
    .contact-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 48px; }
    .contact-box { padding: 32px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; }
    .contact-item { margin-bottom: 24px; }
    .contact-item label { display: block; font-size: 0.82rem; color: var(--muted); margin-bottom: 4px; }
    .contact-item div, .contact-item a { font-weight: 600; color: var(--ink); text-decoration: none; font-size: 1.02rem; }
    form.contact-form { display: grid; gap: 16px; padding: 32px; border: 1px solid var(--border); border-radius: 20px; }
    .field label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; }
    .field input, .field textarea { width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px; font: inherit; font-size: 0.95rem; }
    .field input:focus, .field textarea:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
    footer { border-top: 1px solid var(--border); padding: 32px 0; font-size: 0.88rem; color: var(--muted); }
    .footer-inner { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    .reveal { opacity: 0; transform: translateY(18px); transition: opacity 480ms cubic-bezier(0.16, 1, 0.3, 1), transform 480ms cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(9,9,11,0.55); display: none; align-items: center; justify-content: center; padding: 20px; z-index: 60; }
    .modal-backdrop.open { display: flex; }
    .modal-card { background: #fff; border-radius: 20px; max-width: 780px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 32px; position: relative; }
    .modal-close { position: sticky; float: right; top: 0; width: 38px; height: 38px; border-radius: 999px; border: 1px solid var(--border); background: #fff; cursor: pointer; font-size: 1.1rem; }
    @media (max-width: 900px) {
      .hero-grid, .about-grid, .skills-grid, .projects-grid, .project-featured, .exp-row, .contact-grid { grid-template-columns: 1fr; }
      .project-featured { grid-column: span 1; }
      .kpi-strip { grid-template-columns: repeat(2, 1fr); }
      .nav-links { display: none; }
    }
  </style>
</head>
<body>
  <header>
    <div class="container nav-bar">
      <a href="#top" class="brand">${escapeHtml(PROFILE.fullName)}</a>
      <nav class="nav-links" aria-label="Navigation principale">
        <a href="#apropos">À propos</a>
        <a href="#competences">Compétences</a>
        <a href="#projets">Projets</a>
        <a href="#experiences">Expériences</a>
      </nav>
      <a href="#contact" class="btn-primary">Me contacter</a>
    </div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="container">
        <div class="hero-grid">
          <div style="display:flex;flex-direction:column;justify-content:center;">
            <div class="kicker">Casablanca, Maroc · ${escapeHtml(PROFILE.company)}</div>
            <h1>${escapeHtml(PROFILE.fullName)}</h1>
            <p class="hero-role">${escapeHtml(PROFILE.role)}</p>
            <p class="hero-lead">${escapeHtml(PROFILE.heroLead)}</p>
            <div class="hero-actions">
              <a href="#contact" class="btn-primary">Discuter d’un projet</a>
              <a href="#projets" class="btn-secondary">Découvrir les projets</a>
            </div>
          </div>
          <div class="hero-portrait-wrap">
            <img src="${embeddedPortrait}" alt="Portrait professionnel de ${escapeHtml(PROFILE.fullName)}" />
          </div>
        </div>
        <div class="kpi-strip">${metricsHtml}</div>
      </div>
    </section>

    <section id="apropos" style="border-top:1px solid var(--border);">
      <div class="container">
        <div class="section-head">
          <div class="meta-line">01. À propos</div>
          <h2>Vision stratégique & ancrage opérationnel</h2>
        </div>
        <div class="about-grid">
          <div class="about-copy reveal">
            ${PROFILE.aboutParagraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
          </div>
          <div class="identity-list reveal">
            <div class="identity-row"><strong>Nom</strong><span>${escapeHtml(PROFILE.lastName)}</span></div>
            <div class="identity-row"><strong>Prénom</strong><span>${escapeHtml(PROFILE.firstName)}</span></div>
            <div class="identity-row"><strong>Fonction</strong><span>${escapeHtml(PROFILE.role)} — ${escapeHtml(PROFILE.company)}</span></div>
            <div class="identity-row"><strong>Diplôme</strong><span>${escapeHtml(PROFILE.diploma)}</span></div>
            <div class="identity-row"><strong>Adresse</strong><span>${escapeHtml(PROFILE.address)}</span></div>
            <div class="identity-row"><strong>Email</strong><span>${escapeHtml(PROFILE.email)}</span></div>
          </div>
        </div>
      </div>
    </section>

    <section id="competences" style="border-top:1px solid var(--border);">
      <div class="container">
        <div class="section-head">
          <div class="meta-line">02. Compétences</div>
          <h2>Expertises digitales & leadership</h2>
        </div>
        <div class="filter-bar" role="tablist" aria-label="Filtrer les compétences">
          <button class="filter-btn active" onclick="filterSkills('Toutes', this)">Toutes</button>
          <button class="filter-btn" onclick="filterSkills('Stratégie & Management', this)">Stratégie & Management</button>
          <button class="filter-btn" onclick="filterSkills('Transformation & Data', this)">Transformation & Data</button>
          <button class="filter-btn" onclick="filterSkills('Architecture & Produit', this)">Architecture & Produit</button>
        </div>
        <div class="skills-grid">${skillsHtml}</div>
      </div>
    </section>

    <section id="projets" style="border-top:1px solid var(--border);">
      <div class="container">
        <div class="section-head">
          <div class="meta-line">03. Projets</div>
          <h2>Réalisations & études de cas</h2>
        </div>
        <div class="filter-bar" role="tablist" aria-label="Filtrer les projets">
          <button class="filter-btn active" onclick="filterProjects('Tous', this)">Tous</button>
          <button class="filter-btn" onclick="filterProjects('Transformation', this)">Transformation</button>
          <button class="filter-btn" onclick="filterProjects('E-Commerce', this)">E-Commerce</button>
          <button class="filter-btn" onclick="filterProjects('Data & IA', this)">Data & IA</button>
          <button class="filter-btn" onclick="filterProjects('Plateformes Web', this)">Plateformes Web</button>
        </div>
        <div class="projects-grid">${projectsHtml}</div>
      </div>
    </section>

    <section id="experiences" style="border-top:1px solid var(--border);">
      <div class="container">
        <div class="section-head">
          <div class="meta-line">04. Expériences & Formation</div>
          <h2>Parcours professionnel</h2>
        </div>
        <div class="exp-list">${experiencesHtml}</div>
      </div>
    </section>

    <section id="contact" style="border-top:1px solid var(--border);">
      <div class="container">
        <div class="section-head">
          <div class="meta-line">05. Contact</div>
          <h2>Échanger autour de vos enjeux digitaux</h2>
        </div>
        <div class="contact-grid">
          <div class="contact-box reveal">
            <div class="contact-item">
              <label>Responsable</label>
              <div>${escapeHtml(PROFILE.fullName)} — ${escapeHtml(PROFILE.company)}</div>
            </div>
            <div class="contact-item">
              <label>Adresse</label>
              <div>${escapeHtml(PROFILE.address)}</div>
            </div>
            <div class="contact-item">
              <label>Email direct</label>
              <a href="mailto:${escapeHtml(PROFILE.email)}">${escapeHtml(PROFILE.email)}</a>
            </div>
            <div class="contact-item" style="margin-bottom:0;">
              <label>Diplôme</label>
              <div>${escapeHtml(PROFILE.diploma)}</div>
            </div>
          </div>
          <form class="contact-form reveal" onsubmit="handleContactSubmit(event)">
            <div class="field">
              <label for="c-name">Nom complet</label>
              <input id="c-name" type="text" required placeholder="Votre nom et prénom" />
            </div>
            <div class="field">
              <label for="c-email">Adresse email</label>
              <input id="c-email" type="email" required placeholder="nom@entreprise.ma" />
            </div>
            <div class="field">
              <label for="c-msg">Message</label>
              <textarea id="c-msg" rows="4" required placeholder="Décrivez votre projet ou besoin..."></textarea>
            </div>
            <button type="submit" class="btn-primary">Envoyer le message</button>
            <p id="c-status" style="font-size:0.88rem;color:var(--accent);display:none;"></p>
          </form>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container footer-inner">
      <span>© 2026 ${escapeHtml(PROFILE.fullName)} — ${escapeHtml(PROFILE.address)}</span>
      <span>${escapeHtml(PROFILE.role)} · ${escapeHtml(PROFILE.company)}</span>
    </div>
  </footer>

  <div id="project-modal" class="modal-backdrop" onclick="if(event.target===this) closeProjectModal()">
    <div class="modal-card">
      <button type="button" class="modal-close" aria-label="Fermer" onclick="closeProjectModal()">✕</button>
      <div id="modal-content"></div>
    </div>
  </div>

  <script>
    const PROJECTS_DATA = ${projectsJson};
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    function filterSkills(category, btn) {
      btn.parentElement.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.skill-card').forEach((card) => {
        card.style.display = (category === 'Toutes' || card.dataset.category === category) ? 'block' : 'none';
      });
    }

    function filterProjects(category, btn) {
      btn.parentElement.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.project-card').forEach((card) => {
        const show = category === 'Tous' || card.dataset.category === category;
        card.style.display = show ? (card.classList.contains('project-featured') && window.innerWidth > 900 ? 'grid' : 'flex') : 'none';
      });
    }

    function openProjectModal(index) {
      const p = PROJECTS_DATA[index];
      if (!p) return;
      document.getElementById('modal-content').innerHTML =
        '<div class="meta-line" style="margin-bottom:8px;">' + p.client + ' · ' + p.year + ' · ' + p.category + '</div>' +
        '<h3 style="font-size:1.65rem;margin-bottom:16px;">' + p.title + '</h3>' +
        '<img src="' + p.image + '" alt="' + p.imageAlt + '" style="width:100%;max-height:320px;object-fit:cover;border-radius:14px;margin-bottom:20px;" />' +
        '<p style="margin-bottom:14px;"><strong>Enjeu :</strong> ' + p.challenge + '</p>' +
        '<p style="margin-bottom:14px;"><strong>Solution :</strong> ' + p.solution + '</p>' +
        '<p style="margin-bottom:14px;"><strong>Résultat :</strong> ' + p.impact + '</p>' +
        '<div class="meta-line">Livrables : ' + p.deliverables.join(' · ') + '</div>';
      document.getElementById('project-modal').classList.add('open');
    }

    function closeProjectModal() {
      document.getElementById('project-modal').classList.remove('open');
    }

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProjectModal(); });

    function handleContactSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('c-name').value;
      const email = document.getElementById('c-email').value;
      const msg = document.getElementById('c-msg').value;
      const status = document.getElementById('c-status');
      status.style.display = 'block';
      status.textContent = 'Message prêt pour ' + '${escapeHtml(PROFILE.email)}' + ' — ouverture de votre messagerie...';
      window.location.href = 'mailto:${escapeHtml(PROFILE.email)}?subject=' + encodeURIComponent('Contact Portfolio — ' + name) + '&body=' + encodeURIComponent('De : ' + name + ' (' + email + ')\\n\\n' + msg);
    }
  </script>
</body>
</html>`;
}
