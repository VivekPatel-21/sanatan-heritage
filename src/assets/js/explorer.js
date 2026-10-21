(() => {
  const select = document.querySelector('#journey-choice');
  if (!select) return;
  const panels = [...document.querySelectorAll('[data-journey]')];
  select.closest('.explorer-controls').hidden = false;
  const update = () => {
    let count = 0;
    panels.forEach(panel => { panel.hidden = select.value !== 'all' && panel.dataset.journey !== select.value; if (!panel.hidden) count++; });
    document.querySelector('#journey-status').textContent = `${count} ${count === 1 ? 'journey' : 'journeys'} to explore`;
  };
  select.addEventListener('change', update);
  update();
})();
