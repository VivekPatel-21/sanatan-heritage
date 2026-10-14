document.addEventListener('DOMContentLoaded', () => {
  const help = document.querySelector('#search-help');
  try {
    if (typeof PagefindUI !== 'function') throw new Error('Search unavailable');
    const ui = new PagefindUI({ element: '#site-search', showSubResults: true, showImages: false });
    const query = new URLSearchParams(location.search).get('q');
    if (query) ui.triggerSearch(query.slice(0, 200));
    help.hidden = true;
  } catch {
    help.textContent = 'Search could not load. Please refresh or browse the story collection and glossary.';
  }
});
