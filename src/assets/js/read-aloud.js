(() => {
  const chapters=[...document.querySelectorAll('.tale-chapter[id]')];
  if(!chapters.length)return;
  const hi=document.documentElement.lang==='hi';
  const words=hi?{title:'कहानी सुनें',note:'यह आपके ब्राउज़र की कृत्रिम आवाज़ है। उच्चारण और आवाज़ की उपलब्धता अलग हो सकती है। नीचे दिया गया लिखित पाठ पढ़ते रहें।',chapter:'अध्याय',play:'सुनें',pause:'रोकें',resume:'जारी रखें',stop:'बन्द करें',speed:'गति',ready:'सुनने के लिए अध्याय चुनें।',unavailable:'इस ब्राउज़र में वाचन उपलब्ध नहीं है। नीचे कहानी पढ़ें।'}:{title:'Listen to the story',note:'Optional synthetic browser speech. Voice quality and Sanskrit pronunciation vary; this is not a reviewed recording. The written chapters below are the transcript.',chapter:'Chapter',play:'Play',pause:'Pause',resume:'Resume',stop:'Stop',speed:'Speed',ready:'Choose a chapter, then press Play.',unavailable:'Read-aloud is unavailable in this browser. The complete written story remains below.'};
  const details=document.createElement('details');details.className='read-aloud';details.setAttribute('data-pagefind-ignore','');
  const summary=document.createElement('summary');summary.textContent=words.title;
  const note=document.createElement('p');note.textContent=words.note;
  const status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.textContent=words.ready;
  details.append(summary,note);
  const body=document.querySelector('.tale-body');if(body)body.insertBefore(details,body.querySelector('.tale-chapter'));else chapters[0].before(details);
  const synth=window.speechSynthesis;
  if(!synth||!window.SpeechSynthesisUtterance){status.textContent=words.unavailable;details.append(status);return;}
  const label=document.createElement('label');label.textContent=words.chapter;
  const select=document.createElement('select');select.id='listen-chapter';label.htmlFor=select.id;
  chapters.forEach((chapter,index)=>{const option=document.createElement('option');option.value=String(index);option.textContent=chapter.querySelector('h2')?.textContent||String(index+1);select.append(option);});
  const speedLabel=document.createElement('label');speedLabel.textContent=words.speed;
  const speed=document.createElement('select');speed.id='listen-speed';speedLabel.htmlFor=speed.id;
  for(const rate of [.8,1,1.15]){const option=document.createElement('option');option.value=String(rate);option.textContent=`${rate}×`;option.selected=rate===1;speed.append(option);}
  const play=document.createElement('button');play.type='button';play.textContent=words.play;
  const pause=document.createElement('button');pause.type='button';pause.textContent=words.pause;pause.disabled=true;
  const stop=document.createElement('button');stop.type='button';stop.textContent=words.stop;stop.disabled=true;
  const controls=document.createElement('div');controls.className='listen-controls';controls.append(label,select,speedLabel,speed,play,pause,stop);
  details.append(controls,status);
  let token=0,active=false,paused=false,queue=[],chapterIndex=0,chunkIndex=0;
  function reset(){token++;synth.cancel();active=false;paused=false;pause.disabled=true;stop.disabled=true;pause.textContent=words.pause;play.disabled=false;}
  function speak(){
    if(!active)return;
    if(chunkIndex>=queue.length){
      chapterIndex++;
      if(chapterIndex>=chapters.length){reset();status.textContent=hi?'कहानी का वाचन पूरा हुआ।':'You have reached the end of the story.';return;}
      select.value=String(chapterIndex);loadChapter();
    }
    const generation=token,utterance=new SpeechSynthesisUtterance(queue[chunkIndex]);
    utterance.lang=hi?'hi-IN':'en-IN';utterance.rate=Number(speed.value);
    const voices=synth.getVoices();
    utterance.voice=voices.find(v=>v.lang.toLowerCase()===utterance.lang.toLowerCase()&&v.localService)||voices.find(v=>v.lang.toLowerCase()===utterance.lang.toLowerCase())||voices.find(v=>v.lang.toLowerCase().startsWith(hi?'hi':'en'))||null;
    utterance.onend=()=>{if(generation!==token)return;chunkIndex++;speak();};
    utterance.onerror=event=>{if(generation!==token||event.error==='canceled'||event.error==='interrupted')return;reset();status.textContent=hi?'वाचन उपलब्ध नहीं है। कृपया लिखित पाठ पढ़ें।':'Speech could not continue. Try Play again or read the written chapter below.';};
    // Retain a reference until the utterance finishes (required by some browsers).
    details.currentUtterance=utterance;synth.speak(utterance);
  }
  function loadChapter(){
    const chapter=chapters[chapterIndex];chunkIndex=0;
    const paragraphs=[chapter.querySelector('h2')?.textContent,...[...chapter.querySelectorAll(':scope > p')].map(p=>p.textContent)].filter(Boolean);
    queue=paragraphs.flatMap(text=>text.match(/[^.!?।]+[.!?।]?/gu)||[text]).flatMap(text=>text.length<=1800?[text]:text.match(/.{1,1500}(?:\s|$)/gu)||[text]);
    status.textContent=`${words.chapter} ${chapterIndex+1}: ${chapter.querySelector('h2')?.textContent}`;
  }
  play.addEventListener('click',()=>{reset();chapterIndex=Number(select.value);loadChapter();active=true;play.disabled=true;pause.disabled=false;stop.disabled=false;speak();});
  pause.addEventListener('click',()=>{if(!active)return;paused=!paused;if(paused)synth.pause();else synth.resume();pause.textContent=paused?words.resume:words.pause;});
  stop.addEventListener('click',()=>{reset();status.textContent=words.ready;});
  select.addEventListener('change',()=>{reset();status.textContent=words.ready;});
  speed.addEventListener('change',()=>{reset();status.textContent=words.ready;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&active&&!paused){paused=true;synth.pause();pause.textContent=words.resume;}});
  window.addEventListener('pagehide',reset);
})();
