(() => {
  const panel=document.querySelector('.library-transfer'),state=window.SHReading;
  if(!panel||!state)return;
  const status=panel.querySelector('#library-transfer-status');
  fetch('/data/reading-catalog.json').then(response=>{if(!response.ok)throw new Error();return response.json();}).then(catalog=>{
    panel.hidden=false;
    panel.querySelector('#library-export').addEventListener('click',()=>{
      const blob=new Blob([JSON.stringify(state.exportBackup(),null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob),link=document.createElement('a');
      link.href=url;link.download=`sanatan-heritage-library-${new Date().toISOString().slice(0,10)}.json`;
      document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      status.textContent='Backup download requested. Keep the file somewhere private, then import it in your other browser.';
    });
    const input=panel.querySelector('#library-import');
    input.addEventListener('change',async()=>{
      const file=input.files[0];if(!file)return;
      try{
        if(file.size>1024*1024)throw new Error('Choose a backup smaller than 1 MB.');
        const result=state.importBackup(JSON.parse(await file.text()),catalog);
        status.textContent=`Merged ${result.count} reading ${result.count===1?'entry':'entries'}. ${result.persisted?'Saved in this browser.':'Browser storage is unavailable; changes last for this page only.'}`;
      }catch(error){status.textContent=error instanceof SyntaxError?'This file is not valid JSON. Your library has not changed.':error.message;}
      input.value='';
    });
    panel.querySelector('#library-clear').addEventListener('click',()=>{
      if(!confirm('Clear saved stories, bookmarks and reading progress in this browser? Download a backup first if you want to keep them.'))return;
      const stored=state.clear();status.textContent=stored?'Reading history cleared in this browser.':'Cleared for this page. Browser storage is unavailable.';
    });
  }).catch(()=>{status.textContent='Backup tools could not load. Refresh this page to try again.';});
})();
