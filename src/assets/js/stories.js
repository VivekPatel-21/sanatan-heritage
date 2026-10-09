(() => {
 const search=document.querySelector('#story-search');
 const fields=['deity','scripture','theme'].map(name=>({name,node:document.querySelector('#'+name+'-filter')}));
 const cards=[...document.querySelectorAll('.collection-card')];
 const update=()=>{
  const query=search.value.trim().toLocaleLowerCase();
  let count=0;
  for(const card of cards){
   const match=(!query||[card.textContent,card.dataset.deity,card.dataset.scripture,card.dataset.theme].join(' ').toLocaleLowerCase().includes(query))&&fields.every(({name,node})=>!node.value||card.dataset[name]===node.value);
   card.hidden=!match;if(match)count++;
  }
  document.querySelector('#story-count').textContent=`${count} ${count===1?"story or preview":"stories & previews"}`;
  document.querySelector('#no-stories').hidden=count>0;
 };
 const reset=()=>{search.value='';fields.forEach(({node})=>node.value='');update();};
 search.addEventListener('input',update);
 fields.forEach(({node})=>node.addEventListener('change',update));
 document.querySelector('#clear-filters').addEventListener('click',reset);
 document.querySelector('#empty-reset').addEventListener('click',()=>{reset();search.focus();});
})();
