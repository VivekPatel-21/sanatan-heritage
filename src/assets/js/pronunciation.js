(() => {
  const buttons = [...document.querySelectorAll('[data-pronounce]')];
  const status = document.querySelector('#pronunciation-status');
  if (!buttons.length || !status) return;
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance !== 'function') { status.textContent = 'Listening is unavailable in this browser. The written pronunciation hints remain available.'; return; }
  const speech = window.speechSynthesis;
  buttons.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') { speech.cancel(); buttons.forEach(item => item.setAttribute('aria-pressed', 'false')); status.textContent = 'Listening stopped.'; return; }
      speech.cancel(); buttons.forEach(item => item.setAttribute('aria-pressed', 'false'));
      const voices = speech.getVoices();
      const voice = voices.find(item => /^sa(?:-|$)/i.test(item.lang)) || voices.find(item => /^hi(?:-|$)/i.test(item.lang));
      if (!voice) { status.textContent = 'No Sanskrit or Hindi voice is available on this device. Use the written hint; browser speech is approximate.'; return; }
      const utterance = new SpeechSynthesisUtterance(button.dataset.pronounce);
      utterance.voice = voice; utterance.lang = voice.lang; utterance.rate = .75;
      button.setAttribute('aria-pressed', 'true');
      status.textContent = `Listening to ${button.dataset.term}: approximate browser speech, not a reviewed Sanskrit recording.`;
      const finish = () => { button.setAttribute('aria-pressed', 'false'); };
      utterance.onend = finish;
      utterance.onerror = () => { finish(); status.textContent = 'The browser could not speak this term. Use the written pronunciation hint.'; };
      speech.speak(utterance);
    });
  });
  window.addEventListener('pagehide', () => speech.cancel());
})();
