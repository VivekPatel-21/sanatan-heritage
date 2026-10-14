(() => {
  const hero = document.querySelector('.immersive-hero');
  const image = hero?.querySelector('.hero-backdrop img');
  if (!hero || !image || typeof matchMedia !== 'function') return;
  const enabled = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let target = 0;
  let position = 0;
  let frame = 0;
  let visible = true;
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    target = position = 0;
    image.style.removeProperty('--hero-shift');
    image.style.removeProperty('will-change');
  };
  const animate = () => {
    if (!enabled.matches || !visible || document.hidden) { reset(); return; }
    position += (target - position) * 0.085;
    if (Math.abs(target - position) < 0.05) position = target;
    image.style.setProperty('--hero-shift', `${position.toFixed(2)}px`);
    if (position !== target) frame = requestAnimationFrame(animate);
    else { frame = 0; image.style.removeProperty('will-change'); }
  };
  const schedule = () => {
    if (!enabled.matches || !visible || document.hidden || frame) return;
    image.style.willChange = 'transform';
    frame = requestAnimationFrame(animate);
  };
  hero.addEventListener('pointermove', event => {
    if (!enabled.matches || event.pointerType !== 'mouse') return;
    const bounds = hero.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    const distance = Math.min(24, bounds.height * 0.025);
    target = (0.5 - ratio) * 2 * distance;
    schedule();
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { target = 0; schedule(); });
  enabled.addEventListener('change', reset);
  window.addEventListener('resize', reset);
  document.addEventListener('visibilitychange', reset);
  if (typeof IntersectionObserver === 'function') {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) reset();
    }).observe(hero);
  }
})();
