(() => {
  const form = document.querySelector('form.collection-controls');
  const search = document.querySelector('#story-search');
  const collection = document.querySelector('#collection-filter');
  const cards = [...document.querySelectorAll('.collection-card')];
  if (!form || !search || !collection || !cards.length) return;
  form.addEventListener('submit', event => event.preventDefault());

  const contexts = [...document.querySelectorAll('[data-collection-context]')];
  const collectionLinks = [...document.querySelectorAll('[data-collection-link]')];
  const carousel = document.querySelector('[data-scripture-carousel]');
  const carouselViewport = document.querySelector('#scripture-carousel-viewport');
  const carouselStatus = document.querySelector('#scripture-carousel-status');
  const storyGrid = document.querySelector('.scripture-library-page .collection-grid');
  const validCollections = new Set([...collection.options].map(option => option.value).filter(Boolean));
  const legacy = { deity: '', scripture: '', theme: '' };
  const defaultCollection = 'srimad-bhagavata-purana';
  let scrollTimer;
  let centering = false;

  const readURL = () => {
    const params = new URLSearchParams(location.search);
    search.value = (params.get('q') || '').slice(0, 200);
    legacy.deity = (params.get('deity') || '').slice(0, 100);
    legacy.scripture = (params.get('scripture') || '').slice(0, 100);
    legacy.theme = (params.get('theme') || '').slice(0, 100);
    const requested = params.get('collection') || '';
    const hasLegacyFilter = Boolean(legacy.deity || legacy.scripture || legacy.theme || search.value);
    collection.value = validCollections.has(requested) ? requested : (hasLegacyFilter ? '' : defaultCollection);
  };

  const carouselCard = selected => collectionLinks.find(link => link.dataset.collectionLink === selected);

  const centerCarouselCard = (selected, smooth = true) => {
    const card = carouselCard(selected);
    if (!card || !carouselViewport) return;
    centering = true;
    const reducedMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = smooth && !reducedMotion ? 'smooth' : 'auto';
    const left = card.offsetLeft - (carouselViewport.clientWidth - card.offsetWidth) / 2;
    if (typeof carouselViewport.scrollTo === 'function') carouselViewport.scrollTo({ left: Math.max(0, left), behavior });
    else card.scrollIntoView?.({ behavior, block: 'nearest', inline: 'center' });
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => { centering = false; }, smooth ? 500 : 0);
  };

  const setStoryDestinations = selected => {
    for (const card of cards) {
      const link = card.querySelector('.tale-card-link');
      if (!link) continue;
      link.dataset.baseHref ||= link.getAttribute('href').split('?')[0];
      const url = new URL(link.dataset.baseHref, location.origin);
      if (selected) url.searchParams.set('collection', selected);
      link.href = `${url.pathname}${url.search}`;
    }
  };

  const showContext = selected => {
    for (const context of contexts) {
      const active = context.dataset.collectionContext === (selected || 'all');
      context.hidden = !active;
      context.classList.toggle('is-active', active);
    }
    for (const link of collectionLinks) {
      const active = link.dataset.collectionLink === selected;
      link.setAttribute('aria-pressed', String(active));
      link.classList.toggle('is-selected', active);
      link.tabIndex = active ? 0 : -1;
    }
    const activeCard = carouselCard(selected);
    if (carouselStatus && activeCard) carouselStatus.textContent = `${activeCard.dataset.collectionTitle} selected. Stories below have been updated.`;
  };

  const update = (write = true) => {
    const query = search.value.trim().toLocaleLowerCase();
    const selected = collection.value;
    let count = 0;
    for (const card of cards) {
      const collections = (card.dataset.collections || '').split(/\s+/).filter(Boolean);
      const text = [card.textContent, card.dataset.deity, card.dataset.scripture, card.dataset.theme, card.dataset.textLayer].join(' ').toLocaleLowerCase();
      const matches = (!query || text.includes(query))
        && (!selected || collections.includes(selected))
        && (!legacy.deity || card.dataset.deity === legacy.deity)
        && (!legacy.scripture || card.dataset.scripture === legacy.scripture)
        && (!legacy.theme || card.dataset.theme === legacy.theme);
      card.hidden = !matches;
      if (matches) count++;
    }
    const selectedLabel = collection.selectedOptions[0]?.textContent.trim();
    document.querySelector('#story-count').textContent = selected
      ? `${count} ${count === 1 ? 'story' : 'stories'} in ${selectedLabel}`
      : `${count} ${count === 1 ? 'full story' : 'full stories'}`;
    document.querySelector('#no-stories').hidden = count > 0;
    showContext(selected);
    setStoryDestinations(selected);
    if (storyGrid) {
      storyGrid.classList.add('is-filtering');
      requestAnimationFrame(() => requestAnimationFrame(() => storyGrid.classList.remove('is-filtering')));
    }
    if (write) {
      const url = new URL(location.href);
      const cleanQuery = search.value.trim().slice(0, 200);
      if (cleanQuery) url.searchParams.set('q', cleanQuery); else url.searchParams.delete('q');
      if (selected) url.searchParams.set('collection', selected); else url.searchParams.delete('collection');
      for (const name of Object.keys(legacy)) url.searchParams.delete(name);
      legacy.deity = legacy.scripture = legacy.theme = '';
      history.replaceState(null, '', `${url.pathname}${url.search}${url.hash || '#library'}`);
    }
  };

  const reset = () => {
    search.value = '';
    collection.value = '';
    legacy.deity = legacy.scripture = legacy.theme = '';
    update();
    centerCarouselCard('');
  };

  search.addEventListener('input', () => update());
  collection.addEventListener('change', () => { update(); centerCarouselCard(collection.value); });
  document.querySelector('#clear-filters').addEventListener('click', reset);
  document.querySelector('#empty-reset').addEventListener('click', () => { reset(); search.focus(); });
  for (const link of collectionLinks) link.addEventListener('click', () => {
    collection.value = link.dataset.collectionLink;
    legacy.deity = legacy.scripture = legacy.theme = '';
    update();
    centerCarouselCard(collection.value);
  });
  const moveCarousel = direction => {
    const current = Math.max(0, collectionLinks.indexOf(carouselCard(collection.value)));
    const next = (current + direction + collectionLinks.length) % collectionLinks.length;
    collectionLinks[next].click();
    collectionLinks[next].focus({ preventScroll: true });
  };
  carousel?.querySelector('.scripture-carousel-previous')?.addEventListener('click', () => moveCarousel(-1));
  carousel?.querySelector('.scripture-carousel-next')?.addEventListener('click', () => moveCarousel(1));
  carouselViewport?.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') moveCarousel(-1);
    else if (event.key === 'ArrowRight') moveCarousel(1);
    else collectionLinks[event.key === 'Home' ? 0 : collectionLinks.length - 1].click();
  });
  carouselViewport?.addEventListener('pointerdown', () => { centering = false; clearTimeout(scrollTimer); });
  carouselViewport?.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (centering) return;
      const center = carouselViewport.getBoundingClientRect().left + carouselViewport.clientWidth / 2;
      const nearest = collectionLinks.reduce((best, link) => {
        const box = link.getBoundingClientRect();
        const distance = Math.abs(box.left + box.width / 2 - center);
        return !best || distance < best.distance ? { link, distance } : best;
      }, null)?.link;
      if (nearest && nearest.dataset.collectionLink !== collection.value) nearest.click();
    }, 140);
  }, { passive: true });
  window.addEventListener('popstate', () => { readURL(); update(false); centerCarouselCard(collection.value, false); });
  readURL();
  update(false);
  requestAnimationFrame(() => centerCarouselCard(collection.value, false));
})();
