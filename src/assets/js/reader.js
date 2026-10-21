(() => {
  const article = document.querySelector('.tale-body');
  const tools = document.querySelector('.reader-tools');
  if (!article || !tools) return;
  const chapters = [...article.querySelectorAll('.tale-chapter[id]')];
  if (!chapters.length) return;
  const size = tools.querySelector('#reader-size');
  const status = tools.querySelector('#reader-status');
  const resume = tools.querySelector('#resume-reading');
  const clear = tools.querySelector('#clear-bookmark');
  const key = `sanatan-bookmark:${location.pathname}`;
  const links = [...document.querySelectorAll('.tale-contents a[href^="#"]')];
  let current = chapters[0];
  let scheduled = false;
  const load = name => { try { return localStorage.getItem(name); } catch { return null; } };
  const bookmark = load(key);
  const savedSize = load('sanatan-reader-size');
  const applySize = value => { const valid = ['normal', 'large', 'larger'].includes(value) ? value : 'normal'; size.value = valid; article.dataset.textSize = valid; };
  applySize(savedSize);
  tools.hidden = false;
  if (chapters.some(chapter => chapter.id === bookmark)) { resume.href = `#${bookmark}`; resume.hidden = false; clear.hidden = false; }
  size.addEventListener('change', () => {
    applySize(size.value);
    try { localStorage.setItem('sanatan-reader-size', size.value); status.textContent = 'Text size saved for this browser.'; }
    catch { status.textContent = 'Text size changed for this visit. Browser storage is unavailable.'; }
  });
  const update = () => {
    const header = document.querySelector('.site-header');
    const top = (header?.getBoundingClientRect().bottom || 88) + 64;
    current = chapters[0];
    for (const chapter of chapters) if (chapter.getBoundingClientRect().top <= top) current = chapter;
    links.forEach(link => { if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    scheduled = false;
  };
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  tools.querySelector('#save-chapter').addEventListener('click', () => {
    update();
    try { localStorage.setItem(key, current.id); resume.href = `#${current.id}`; resume.hidden = false; clear.hidden = false; status.textContent = `Bookmarked: ${current.querySelector('h2').textContent}.`; }
    catch { status.textContent = 'This browser cannot save bookmarks. You can use the chapter links instead.'; }
  });
  clear.addEventListener('click', () => { try { localStorage.removeItem(key); resume.hidden = true; clear.hidden = true; status.textContent = 'Bookmark cleared.'; tools.querySelector('#save-chapter').focus(); } catch { status.textContent = 'This browser cannot clear stored bookmarks.'; } });
  update();
})();
