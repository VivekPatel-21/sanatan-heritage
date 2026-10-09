(() => {
  const form = document.querySelector('[data-directory-form]');
  if (!form) return;
  const query = form.querySelector('input');
  const category = form.querySelector('select');
  const cards = [...document.querySelectorAll('[data-directory-item]')];
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const update = () => {
    const words = normalize(query.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      const matches = words.every(word => normalize(card.textContent).includes(word)) && (!category || category.value === 'all' || card.dataset.category === category.value);
      card.hidden = !matches;
      if (matches) count++;
    });
    document.querySelector('#directory-count').textContent = `${count} of ${cards.length} ${category ? 'divine forms' : 'terms'}`;
    document.querySelector('#directory-empty').hidden = count !== 0;
    document.querySelectorAll('.glossary-index a').forEach(link => { link.hidden = document.getElementById(link.hash.slice(1))?.hidden ?? false; });
  };
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  form.addEventListener('reset', () => { query.value = ''; if (category) category.value = 'all'; update(); });
  update();
})();
