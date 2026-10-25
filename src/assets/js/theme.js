(() => {
  let theme;
  try { theme = localStorage.getItem('sanatan-theme'); } catch { /* Storage can be disabled. */ }
  if (!['light', 'dark'].includes(theme)) theme = 'light';
  document.documentElement.dataset.theme = theme;
  const browserTheme=document.querySelector('#browser-theme');
  if(browserTheme)browserTheme.content=browserTheme.dataset[theme];
  document.documentElement.classList.add('js');
})();
