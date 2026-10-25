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
  let bookmark = load(key);
  const save = tools.querySelector('#save-chapter');
  const state = window.SHReading;
  const saveStory = tools.querySelector('#save-story');
  const completeStory = tools.querySelector('#complete-story');
  if (state && chapters.some(chapter => chapter.id === bookmark) && !state.get(location.pathname).bookmark) state.set(location.pathname, { bookmark });
  let trackedChapter;
  const updateStoryControls = () => {
    const item = state?.get(location.pathname) || {};
    saveStory.textContent = item.saved ? 'Story saved' : 'Save story';
    saveStory.setAttribute('aria-pressed', String(!!item.saved));
    completeStory.textContent = item.completed ? 'Marked as read' : 'Mark as read';
    completeStory.setAttribute('aria-pressed', String(!!item.completed));
  };
  saveStory.addEventListener('click', () => { const stored = state?.set(location.pathname, { saved: !state.get(location.pathname).saved }); updateStoryControls(); status.textContent = stored ? 'Your reading library is updated.' : 'Updated on this page only. Browser storage is unavailable.'; });
  completeStory.addEventListener('click', () => { const stored = state?.set(location.pathname, { completed: !state.get(location.pathname).completed }); updateStoryControls(); status.textContent = stored ? 'Your reading library and paths are updated.' : 'Updated on this page only. Browser storage is unavailable.'; });
  window.addEventListener('sanatan-reading-change', updateStoryControls);
  updateStoryControls();
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
    save.setAttribute('aria-pressed', String(current.id === bookmark));
    save.textContent = current.id === bookmark ? 'Chapter bookmarked' : 'Bookmark this chapter';
    if (state && article.getBoundingClientRect().top < window.innerHeight * .8 && trackedChapter !== current.id) {
      trackedChapter = current.id;
      state.set(location.pathname, { chapter:current.id, chapterTitle:current.querySelector('h2').textContent, lastReadAt:Date.now() });
    }
    scheduled = false;
  };
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  tools.querySelector('#save-chapter').addEventListener('click', () => {
    update();
    try { localStorage.setItem(key, current.id); bookmark = current.id; state?.set(location.pathname, { bookmark:current.id, chapterTitle:current.querySelector('h2').textContent }); update(); resume.href = `#${current.id}`; resume.hidden = false; clear.hidden = false; status.textContent = `Bookmarked: ${current.querySelector('h2').textContent}.`; }
    catch { status.textContent = 'This browser cannot save bookmarks. You can use the chapter links instead.'; }
  });
  clear.addEventListener('click', () => { try { localStorage.removeItem(key); bookmark = null; state?.set(location.pathname, { bookmark:null }); update(); resume.hidden = true; clear.hidden = true; status.textContent = 'Bookmark cleared.'; tools.querySelector('#save-chapter').focus(); } catch { status.textContent = 'This browser cannot clear stored bookmarks.'; } });
  update();
})();
