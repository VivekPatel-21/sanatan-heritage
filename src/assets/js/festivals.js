(() => {
  const form=document.querySelector('[data-festival-form]');
  if(!form)return;
  const query=form.querySelector('input');const type=form.querySelector('select');
  const entries=[...document.querySelectorAll('[data-festival-entry]')];
  const status=document.querySelector('#festival-count');const empty=document.querySelector('#festival-empty');
  const normalize=value=>value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase();
  function readURL(){const params=new URLSearchParams(location.search);query.value=(params.get('festival')||'').slice(0,200);const group=params.get('kind')||'all';type.value=[...type.options].some(option=>option.value===group)?group:'all';}
  function update(write=true){const words=normalize(query.value.trim()).split(/\s+/).filter(Boolean);let count=0;
    entries.forEach(entry=>{const text=normalize(entry.textContent+' '+(entry.dataset.keywords||''));const matches=words.every(word=>text.includes(word))&&(type.value==='all'||entry.dataset.kind===type.value);entry.hidden=!matches;if(matches)count++;});
    status.textContent=`${count} of ${entries.length} calendar entries`;empty.hidden=count!==0;
    if(write){const url=new URL(location.href);const value=query.value.trim().slice(0,200);if(value)url.searchParams.set('festival',value);else url.searchParams.delete('festival');if(type.value!=='all')url.searchParams.set('kind',type.value);else url.searchParams.delete('kind');history.replaceState(null,'',url.pathname+url.search+url.hash);}
  }
  form.addEventListener('submit',event=>event.preventDefault());form.addEventListener('input',()=>update());
  form.addEventListener('reset',()=>{query.value='';type.value='all';update();});
  document.querySelector('[data-festival-reset]')?.addEventListener('click',()=>{form.reset();query.focus();});
  window.addEventListener('popstate',()=>{readURL();update(false);});readURL();update(false);form.hidden=false;
})();
