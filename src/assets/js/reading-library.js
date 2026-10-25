(() => {
  const state = window.SHReading;
  const list = document.querySelector('#library-list');
  const filter = document.querySelector('#library-view');
  const status = document.querySelector('#library-status');
  if (!state || !list) return;
  const node = (tag, text, className) => { const el = document.createElement(tag); if (text) el.textContent = text; if (className) el.className = className; return el; };
  fetch('/data/reading-catalog.json').then(response => { if (!response.ok) throw new Error(); return response.json(); }).then(catalog => {
    const stories = catalog.stories;
    for (const story of stories) {
      try { const legacy = localStorage.getItem(`sanatan-bookmark:${story.href}`); if (story.chapters.some(c => c.id === legacy) && !state.get(story.href).bookmark) state.set(story.href,{bookmark:legacy}); } catch { /* The library still works for this visit. */ }
    }
    document.querySelector('.library-controls').hidden = false;
    document.querySelector('.library-browse').open = false;
    const render = () => {
      const focused = document.activeElement?.closest('.library-entry');
      const activePath=focused?.dataset.path; const activeAction=document.activeElement?.dataset.action;
      list.replaceChildren();
      let count = 0;
      const entries = stories.map(story => ({story,item:state.get(story.href)})).filter(({item}) => item.updatedAt).sort((a,b) => (b.item.updatedAt || 0)-(a.item.updatedAt || 0));
      for (const {story,item} of entries) {
        const saved = item.saved || item.bookmark;
        if (filter.value === 'saved' && !saved || filter.value === 'progress' && (!item.lastReadAt || item.completed) || filter.value === 'completed' && !item.completed) continue;
        count++;
        const card = node('article',null,'library-entry'); card.dataset.path=story.href;
        const heading = node('h2'); const title = node('a',story.title); title.href = story.href; heading.append(title);
        const flags = [item.completed ? 'Marked as read' : item.lastReadAt ? 'In progress' : 'Ready to read', saved ? 'Saved / bookmarked' : '', `${story.minutes} min read`].filter(Boolean).join(' · ');
        card.append(heading,node('p',flags,'library-entry-meta'));
        const chapter = story.chapters.find(c => c.id === (item.chapter || item.bookmark));
        const actions = node('div',null,'library-entry-actions');
        const resume = node('a',chapter ? `Continue: ${chapter.title}` : 'Read the story'); resume.href = story.href + (chapter ? `#${chapter.id}` : ''); actions.append(resume);
        const bookmark=story.chapters.find(c=>c.id===item.bookmark);
        if(bookmark && bookmark.id!==chapter?.id){const link=node('a',`Bookmark: ${bookmark.title}`);link.href=story.href+'#'+bookmark.id;actions.append(link);}
        const save = node('button',item.saved ? 'Unsave story' : 'Save story'); save.type='button'; save.dataset.action='save'; save.setAttribute('aria-pressed',String(!!item.saved)); save.addEventListener('click',()=>{ const stored=state.set(story.href,{saved:!item.saved}); status.textContent=stored?'Library updated.':'Updated on this page only. Browser storage is unavailable.'; });
        const done = node('button',item.completed ? 'Mark unread' : 'Mark as read'); done.type='button'; done.dataset.action='complete'; done.setAttribute('aria-pressed',String(!!item.completed)); done.addEventListener('click',()=>{const stored=state.set(story.href,{completed:!item.completed});status.textContent=stored?'Reading paths updated.':'Updated on this page only. Browser storage is unavailable.';});
        const remove = node('button','Remove from library'); remove.type='button'; remove.dataset.action='remove'; remove.addEventListener('click',()=>{const stored=state.remove(story.href);status.textContent=stored?'Story removed from this library.':'Removed on this page only. Browser storage is unavailable.';filter.focus();});
        actions.append(save,done,remove);card.append(actions);list.append(card);
      }
      document.querySelector('#library-empty').hidden = count !== 0;
      document.querySelector('#library-count').textContent=`${count} ${count===1?'story':'stories'} in this view`;
      if(activeAction){const target=[...list.querySelectorAll('.library-entry')].find(card=>card.dataset.path===activePath)?.querySelector(`[data-action="${activeAction}"]`);(target||filter).focus();}
      if (!state.available()) status.textContent='Browser storage is unavailable. Changes last on this page only.';
    };
    filter.addEventListener('change',render);window.addEventListener('sanatan-reading-change',render);render();
  }).catch(()=>{status.textContent='Your library could not load. Browse the stories below or refresh this page.';});
})();
