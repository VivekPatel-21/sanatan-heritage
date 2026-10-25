(() => {
  document.querySelectorAll('[data-language]').forEach(link=>link.addEventListener('click',()=>{try{localStorage.setItem('sanatan-language',link.dataset.language);}catch{/* Language links work without storage. */}}));
  let preferred;try{preferred=localStorage.getItem('sanatan-language');}catch{/* No preference is necessary. */}
  if(preferred==='hi'){
    const entry=document.querySelector('.museum-chapter a[href="/start-here.html"]');
    if(entry){entry.href='/hindi.html';entry.lang='hi';entry.textContent='हिन्दी में अपनी यात्रा जारी रखें ↗';}
  }
})();
