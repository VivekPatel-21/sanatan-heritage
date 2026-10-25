(() => {
  const state=window.SHReading;
  if(!state)return;
  fetch('/data/reading-catalog.json').then(r=>{if(!r.ok)throw new Error();return r.json();}).then(catalog=>{
    [...document.querySelectorAll('.reader-panel')].filter(panel=>panel.querySelector('ol.reading-steps')).forEach(panel=>{
      const steps=[...panel.querySelectorAll('.reading-steps>li')].map(li=>({li,link:li.querySelector('a')}));
      const summary=document.createElement('p');summary.className='path-summary';summary.setAttribute('role','status');summary.setAttribute('aria-live','polite');
      const progress=document.createElement('progress');progress.max=steps.length;progress.setAttribute('aria-label',panel.querySelector('h2').textContent+' progress');
      const next=document.createElement('a');next.className='path-next';
      const feedback=document.createElement('p');feedback.className='path-feedback';feedback.setAttribute('role','status');
      panel.querySelector('.reading-steps').before(summary,progress);
      panel.append(next,feedback);
      let minutes=0;
      const controls=steps.map(({li,link})=>{
        const path=new URL(link.href).pathname;minutes+=catalog.pages[path]?.minutes||0;
        const label=document.createElement('label');label.className='path-completion';const box=document.createElement('input');box.type='checkbox';box.setAttribute('aria-label','Mark '+link.textContent+' as read');label.append(box,document.createTextNode('Mark as read'));li.append(label);
        box.addEventListener('change',()=>{const stored=state.set(path,{completed:box.checked});feedback.textContent=stored?'Progress saved in this browser.':'Updated on this page only. Browser storage is unavailable.';});
        return{li,link,path,box};
      });
      const update=()=>{
        let done=0;let remaining=0;
        controls.forEach(({li,path,box})=>{const complete=!!state.get(path).completed;box.checked=complete;li.classList.toggle('is-read',complete);if(complete)done++;else remaining+=catalog.pages[path]?.minutes||0;});
        progress.value=done;summary.textContent=`${done} of ${steps.length} steps read · About ${minutes} min total${remaining&&done?' · '+remaining+' min remaining':''}`;
        const target=controls.find(c=>!c.box.checked);next.hidden=!target;if(target){next.href=target.link.getAttribute('href');next.textContent='Next: '+target.link.textContent;}
        if(!state.available())feedback.textContent='Browser storage is unavailable. Changes last on this page only.';
      };window.addEventListener('sanatan-reading-change',update);update();
    });
  }).catch(()=>{/* Ordered reading lists remain available without the enhancement. */});
})();
