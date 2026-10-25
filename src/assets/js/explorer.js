(() => {
  const select = document.querySelector('#journey-choice');
  if (!select) return;
  const panels = [...document.querySelectorAll('[data-journey]')];
  select.closest('.explorer-controls').hidden = false;
  const readURL = () => { const id=new URLSearchParams(location.search).get('journey')||'all'; select.value=[...select.options].some(option=>option.value===id)?id:'all'; };
  const update = (write = true) => {
    let count = 0;
    panels.forEach(panel => { panel.hidden = select.value !== 'all' && panel.dataset.journey !== select.value; if (!panel.hidden) count++; });
    if(write){const url=new URL(location.href);if(select.value==='all')url.searchParams.delete('journey');else url.searchParams.set('journey',select.value);history.replaceState(null,'',url.pathname+url.search+url.hash);}
    document.querySelector('#journey-status').textContent = `${count} ${count === 1 ? 'journey' : 'journeys'} to explore`;
  };
  select.addEventListener('change', () => update());
  window.addEventListener('popstate',()=>{readURL();update(false);});readURL();update(false);
})();
