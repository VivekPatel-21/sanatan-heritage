document.addEventListener('DOMContentLoaded', () => {
  const help = document.querySelector('#search-help');
  try {
    if (typeof PagefindUI !== 'function') throw new Error('Search unavailable');
    const ui = new PagefindUI({ element: '#site-search', showSubResults: false, showImages: false });
    const query = new URLSearchParams(location.search).get('q');
    if (query) ui.triggerSearch(query.slice(0, 200));
    const root = document.querySelector('#site-search');
    let timer;
    const sync = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const input = root.querySelector('input');
        if (!input) return;
        const url = new URL(location.href); const value = input.value.trim().slice(0,200);
        if (value) url.searchParams.set('q',value); else url.searchParams.delete('q');
        history.replaceState(null,'',url.pathname+url.search+url.hash);
      }, 200);
    };
    root.addEventListener('input',sync);
    root.addEventListener('click',event => { if (event.target.closest('button')) sync(); });
    window.addEventListener('popstate',()=>ui.triggerSearch(new URLSearchParams(location.search).get('q')||''));
    help.hidden = true;
  } catch {
    help.textContent = 'Search could not load. Please refresh or browse the story collection and glossary.';
  }
});
