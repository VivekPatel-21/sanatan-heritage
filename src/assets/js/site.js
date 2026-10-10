(() => {
  const themeButton = document.querySelector('.theme-toggle');
  const updateThemeLabel = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    if (themeButton) { themeButton.textContent = dark ? 'Light mode' : 'Dark mode'; themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`); }
  };
  themeButton?.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('sanatan-theme', theme); } catch { /* Preference still works for this visit. */ }
    updateThemeLabel();
  });
  updateThemeLabel();
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const closeMenu = () => { menu?.setAttribute('aria-expanded', 'false'); nav?.classList.remove('is-open'); };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open);
  });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  const progress = document.querySelector('.reading-progress');
  const article = document.querySelector('.tale-body');
  if (progress && article) {
    let scheduled = false;
    const update = () => {
      const rect = article.getBoundingClientRect();
      const length = Math.max(1, rect.height - window.innerHeight);
      const value = Math.round(Math.max(0, Math.min(100, -rect.top / length * 100)));
      progress.setAttribute('aria-valuenow', String(value));
      progress.firstElementChild.style.transform = `scaleX(${value / 100})`;
      scheduled = false;
    };
    const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule); update();
  }
  // A short, one-time entrance for artwork; text remains visible throughout.
  if (typeof IntersectionObserver === 'function' && typeof matchMedia === 'function' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const artwork = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('art-entered');
        artwork.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.collection-card figure, .scripture-card figure, .tale-inline, .deity-illustration').forEach(figure => artwork.observe(figure));
  }
  const links = [...document.querySelectorAll('.glossary-link')];
  if (!links.length) return;
  fetch('/data/glossary.json').then(response => { if (!response.ok) throw new Error('Glossary unavailable'); return response.json(); }).then(terms => {
    const data = new Map(terms.map(term => [term.id, term]));
    const card = document.createElement('div');
    card.className = 'glossary-popover'; card.id = 'glossary-definition'; card.hidden = true; card.setAttribute('role', 'dialog'); card.setAttribute('aria-modal', 'false');
    document.body.append(card);
    let active;
    const close = (restoreFocus = false) => { card.hidden = true; if (active) { active.setAttribute('aria-expanded', 'false'); if (restoreFocus) active.focus(); } active = null; };
    const open = link => {
      const term = data.get(link.hash.slice(1)); if (!term) return;
      if (active === link && !card.hidden) { close(true); return; }
      close(); active = link; link.setAttribute('aria-expanded', 'true');
      card.replaceChildren(); card.setAttribute('aria-label', `${term.name} definition`);
      const button = document.createElement('button'); button.type = 'button'; button.className = 'popover-close'; button.textContent = 'Close'; button.addEventListener('click', () => close(true));
      const heading = document.createElement('h2'); heading.textContent = term.name;
      const devanagari = document.createElement('p'); devanagari.lang = 'sa'; devanagari.className = 'devanagari'; devanagari.textContent = term.devanagari;
      const pronunciation = document.createElement('p'); pronunciation.className = 'pronunciation'; pronunciation.textContent = term.pronunciation;
      const definition = document.createElement('p'); definition.textContent = term.definition;
      const full = document.createElement('a'); full.href = `/glossary.html#${term.id}`; full.textContent = 'Read the glossary entry';
      card.append(button, heading, devanagari, pronunciation, definition, full); card.hidden = false;
      const rect = link.getBoundingClientRect(); const width = Math.min(360, window.innerWidth - 32);
      card.style.width = `${width}px`; card.style.left = `${Math.max(16, Math.min(rect.left, window.innerWidth - width - 16))}px`;
      card.style.top = `${Math.max(16, Math.min(rect.bottom + 10, window.innerHeight - card.offsetHeight - 16))}px`;
      button.focus();
    };
    links.forEach(link => {
      if (!data.has(link.hash.slice(1))) return;
      link.setAttribute('aria-haspopup', 'dialog'); link.setAttribute('aria-controls', card.id); link.setAttribute('aria-expanded', 'false');
      link.addEventListener('click', event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) { event.preventDefault(); open(link); } });
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !card.hidden) { event.preventDefault(); close(true); } });
    document.addEventListener('click', event => { if (!card.hidden && !card.contains(event.target) && event.target !== active) close(); });
    document.addEventListener('focusin', event => { if (!card.hidden && !card.contains(event.target) && event.target !== active) close(); });
    window.addEventListener('resize', () => close()); window.addEventListener('scroll', () => close(), { passive: true });
  }).catch(() => { /* Links still open the complete glossary without the enhancement. */ });
})();
