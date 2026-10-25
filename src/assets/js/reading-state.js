/* Versioned, browser-local reading history. No accounts or network writes. */
(() => {
  const key = 'sanatan-reading-v1';
  const validPath = value => typeof value === 'string' && /^\/[a-z0-9-]+\.html$/.test(value);
  const validChapter = value => typeof value === 'string' && /^[a-z0-9-]{1,80}$/.test(value);
  const clean = raw => {
    const items = {};
    if (raw?.version !== 1 || !raw.items || typeof raw.items !== 'object') return items;
    for (const [path, value] of Object.entries(raw.items)) {
      if (!validPath(path) || !value || typeof value !== 'object') continue;
      items[path] = { saved: value.saved === true, completed: value.completed === true,
        chapter: validChapter(value.chapter) ? value.chapter : null,
        bookmark: validChapter(value.bookmark) ? value.bookmark : null,
        chapterTitle: typeof value.chapterTitle === 'string' ? value.chapterTitle.slice(0,160) : '',
        updatedAt: Number.isFinite(value.updatedAt) ? value.updatedAt : 0,
        lastReadAt: Number.isFinite(value.lastReadAt) ? value.lastReadAt : 0 };
    }
    return items;
  };
  let items = {};
  let available = true;
  try { items = clean(JSON.parse(localStorage.getItem(key))); } catch { available = false; }
  const persist = () => {
    try { localStorage.setItem(key, JSON.stringify({ version: 1, items })); available = true; }
    catch { available = false; }
    window.dispatchEvent(new CustomEvent('sanatan-reading-change'));
    return available;
  };
  window.SHReading = {
    get: path => ({ ...(items[path] || {}) }),
    all: () => Object.fromEntries(Object.entries(items).map(([path,value]) => [path,{...value}])),
    set(path, patch) {
      if (!validPath(path)) return false;
      items = clean({ version:1, items: { ...items, [path]: { ...items[path], ...patch, updatedAt:Date.now() } } });
      return persist();
    },
    remove(path) {
      delete items[path];
      try { localStorage.removeItem(`sanatan-bookmark:${path}`); } catch { available = false; }
      return persist();
    },
    available: () => available
  };
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    try { items = clean(JSON.parse(localStorage.getItem(key))); } catch { items = {}; available = false; }
    window.dispatchEvent(new CustomEvent('sanatan-reading-change'));
  });
  // Completion for the introductory pages used in reading paths.
  const completion = document.querySelector('[data-page-completion]');
  if (completion) {
    completion.hidden = false;
    const button = completion.querySelector('button');
    const status = completion.querySelector('[role="status"]');
    const update = () => { const done = window.SHReading.get(location.pathname).completed; button.textContent = done ? 'Marked as read' : 'Mark this page as read'; button.setAttribute('aria-pressed', String(!!done)); };
    button.addEventListener('click', () => { const stored = window.SHReading.set(location.pathname, { completed: !window.SHReading.get(location.pathname).completed }); update(); status.textContent = stored ? 'Reading paths updated in this browser.' : 'Updated on this page only. Browser storage is unavailable.'; });
    window.addEventListener('sanatan-reading-change', update); update();
  }
})();
