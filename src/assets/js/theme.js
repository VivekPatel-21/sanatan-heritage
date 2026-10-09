(() => {
  let theme;
  try { theme = localStorage.getItem('sanatan-theme'); } catch { /* Storage can be disabled. */ }
  if (!['light', 'dark'].includes(theme)) theme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.add('js');
})();
