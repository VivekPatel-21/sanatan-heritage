(() => {
  const form = document.querySelector('[data-directory-form]');
  if (!form) return;
  const query = form.querySelector('input');
  const category = form.querySelector('select');
  const cards = [...document.querySelectorAll('[data-directory-item]')];
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const readURL = () => { const params = new URLSearchParams(location.search); query.value = (params.get('q') || '').slice(0,200); if (category) { const value=params.get('group')||'all'; category.value=[...category.options].some(option=>option.value===value)?value:'all'; } };
  const update = (write = true) => {
    const words = normalize(query.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      const matches = words.every(word => normalize(card.textContent).includes(word)) && (!category || category.value === 'all' || card.dataset.category === category.value);
      card.hidden = !matches;
      if (matches) count++;
    });
    document.querySelector('#directory-count').textContent = `${count} of ${cards.length} ${category ? 'divine forms' : 'terms'}`;
    document.querySelector('#directory-empty').hidden = count !== 0;
    if (write) { const url=new URL(location.href); const value=query.value.trim().slice(0,200); if(value)url.searchParams.set('q',value);else url.searchParams.delete('q'); if(category && category.value!=='all')url.searchParams.set('group',category.value);else url.searchParams.delete('group');history.replaceState(null,'',url.pathname+url.search+url.hash); }
    document.querySelectorAll('.glossary-index a, .deity-index a').forEach(link => { link.hidden = document.getElementById(link.hash.slice(1))?.hidden ?? false; });
  };
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', () => update());
  form.addEventListener('reset', () => { query.value = ''; if (category) category.value = 'all'; update(); });
  window.addEventListener('popstate', () => { readURL(); update(false); });
  readURL(); update(false);
})();
