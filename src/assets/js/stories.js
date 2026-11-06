(() => {
  const form = document.querySelector('form.collection-controls');
  const search = document.querySelector('#story-search');
  const collection = document.querySelector('#collection-filter');
  const cards = [...document.querySelectorAll('.collection-card')];
  if (!form || !search || !collection || !cards.length) return;
  form.addEventListener('submit', event => event.preventDefault());

  const contexts = [...document.querySelectorAll('[data-collection-context]')];
  const collectionLinks = [...document.querySelectorAll('[data-collection-link]')];
  const validCollections = new Set([...collection.options].map(option => option.value).filter(Boolean));
  const legacy = { deity: '', scripture: '', theme: '' };

  const readURL = () => {
    const params = new URLSearchParams(location.search);
    search.value = (params.get('q') || '').slice(0, 200);
    const requested = params.get('collection') || '';
    collection.value = validCollections.has(requested) ? requested : '';
    legacy.deity = (params.get('deity') || '').slice(0, 100);
    legacy.scripture = (params.get('scripture') || '').slice(0, 100);
    legacy.theme = (params.get('theme') || '').slice(0, 100);
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
      if (link.dataset.collectionLink === selected) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
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
  };

  search.addEventListener('input', () => update());
  collection.addEventListener('change', () => update());
  document.querySelector('#clear-filters').addEventListener('click', reset);
  document.querySelector('#empty-reset').addEventListener('click', () => { reset(); search.focus(); });
  window.addEventListener('popstate', () => { readURL(); update(false); });
  readURL();
  update(false);
})();
