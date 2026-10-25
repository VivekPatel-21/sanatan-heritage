(() => {
  const film=document.querySelector('.museum-film');
  if(!film)return;
  const video=film.querySelector('video');
  const toggle=film.querySelector('.museum-video-toggle');
  const header=document.querySelector('.site-header');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let inView=true;
  let wantsPlayback=!reduced.matches&&!navigator.connection?.saveData;
  function layout(){document.body.style.setProperty('--museum-header-height',`${Math.ceil(header?.getBoundingClientRect().height||94)}px`);}
  function label(){toggle.textContent=video.paused?'Play video':'Pause video';}
  function sync(){
    if(!wantsPlayback||!inView||document.hidden){video.pause();return;}
    const attempt=video.play();
    if(attempt)attempt.catch(()=>{label();});
  }
  toggle.hidden=false;
  video.controls=false;
  video.muted=true;
  video.addEventListener('play',label);
  video.addEventListener('pause',label);
  video.addEventListener('error',()=>{wantsPlayback=false;label();});
  toggle.addEventListener('click',()=>{wantsPlayback=video.paused;sync();});
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',()=>{if(reduced.matches)wantsPlayback=false;sync();});
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{threshold:0});
    observer.observe(film);
  }
  if('ResizeObserver' in window&&header)new ResizeObserver(layout).observe(header);
  window.addEventListener('resize',layout,{passive:true});
  layout();label();sync();
})();
