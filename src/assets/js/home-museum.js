(() => {
  const film=document.querySelector('.museum-film');
  if(!film)return;
  const video=film.querySelector('video');
  const toggle=film.querySelector('.museum-video-toggle');
  const header=document.querySelector('.site-header');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  // Observed centre of the golden shikhara in the uncropped owner footage.
  const focus=[[0,.57577,.48301],[1,.57622,.48379],[2,.57643,.48612],[3,.58039,.49185],[4,.58222,.50012],[5,.58203,.50757],[6,.58658,.5187],[7,.59237,.53303],[8,.5977,.54979],[9,.6087,.57368],[10,.62074,.60109],[11,.63616,.63672],[12,.6556,.67711],[13,.6773,.73554],[14,.70464,.79244],[15,.74504,.80779],[16,.81773,.82145],[16.7,.89479,.84564],[16.74,.8992,.847]];
  function frame(time=video.currentTime||0){
    const end=focus.findIndex(point=>point[0]>=time);
    const a=focus[Math.max(0,(end<0?focus.length-1:end)-1)],b=focus[end<0?focus.length-1:end];
    const mix=b[0]===a[0]?0:Math.max(0,Math.min(1,(time-a[0])/(b[0]-a[0])));
    const x=a[1]+(b[1]-a[1])*mix,y=a[2]+(b[2]-a[2])*mix;
    const width=film.clientWidth,height=film.clientHeight;
    if(!width||!height)return;
    const ratio=(video.videoWidth||1920)/(video.videoHeight||1080);
    // Extra scale is necessary near a source edge: centring must never expose a gap.
    const renderedWidth=Math.max(width/(2*Math.min(x,1-x)),height*ratio/(2*Math.min(y,1-y)));
    const scale=renderedWidth/width;
    video.style.transform=`matrix(${scale},0,0,${scale},${width/2-renderedWidth*x},${height/2-renderedWidth/ratio*y})`;
    video.style.visibility='visible';
    film.dataset.focusX=String(x);film.dataset.focusY=String(y);
  }
  function follow(now,metadata){frame(metadata.mediaTime);video.requestVideoFrameCallback(follow);}
  if(video.requestVideoFrameCallback)video.requestVideoFrameCallback(follow);
  else video.addEventListener('timeupdate',()=>frame());
  video.addEventListener('loadedmetadata',()=>frame());
  video.addEventListener('seeked',()=>frame());
  let inView=true;
  let wantsPlayback=!reduced.matches&&!navigator.connection?.saveData;
  function layout(){document.body.style.setProperty('--museum-header-height',`${Math.ceil(header?.getBoundingClientRect().height||94)}px`);frame();}
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
  video.addEventListener('error',()=>{wantsPlayback=false;toggle.textContent='Video unavailable';toggle.disabled=true;});
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
