(() => {
 document.querySelector('form.collection-controls')?.addEventListener('submit',event=>event.preventDefault());
 const search=document.querySelector('#story-search');
 const fields=['deity','scripture','theme'].map(name=>({name,node:document.querySelector('#'+name+'-filter')}));
 const cards=[...document.querySelectorAll('.collection-card')];
 const readURL=()=>{const params=new URLSearchParams(location.search);search.value=(params.get('q')||'').slice(0,200);fields.forEach(({name,node})=>{const value=params.get(name)||'';node.value=[...node.options].some(o=>o.value===value)?value:'';});};
 const update=(write=true)=>{
  const query=search.value.trim().toLocaleLowerCase();let count=0;
  for(const card of cards){const match=(!query||[card.textContent,card.dataset.deity,card.dataset.scripture,card.dataset.theme].join(' ').toLocaleLowerCase().includes(query))&&fields.every(({name,node})=>!node.value||card.dataset[name]===node.value);card.hidden=!match;if(match)count++;}
  document.querySelector('#story-count').textContent=`${count} ${count===1?'full story':'full stories'}`;
  document.querySelector('#no-stories').hidden=count>0;
  if(write){const url=new URL(location.href);[['q',search.value.trim().slice(0,200)],...fields.map(({name,node})=>[name,node.value])].forEach(([name,value])=>{if(value)url.searchParams.set(name,value);else url.searchParams.delete(name);});history.replaceState(null,'',url.pathname+url.search+url.hash);}
 };
 const reset=()=>{search.value='';fields.forEach(({node})=>node.value='');update();};
 search.addEventListener('input',()=>update());fields.forEach(({node})=>node.addEventListener('change',()=>update()));
 document.querySelector('#clear-filters').addEventListener('click',reset);document.querySelector('#empty-reset').addEventListener('click',()=>{reset();search.focus();});
 window.addEventListener('popstate',()=>{readURL();update(false);});readURL();update(false);
})();
