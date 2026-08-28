const initializeHeroMotion = (root: HTMLElement) => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion.matches) {
    root.dataset.motion = "reduced";
    root.style.setProperty("--hero-scroll-depth", "0");
    return;
  }

  const hero = root.closest<HTMLElement>(".hero");
  if (!hero) return;

  let frame = 0;
  let visible = true;

  const updateScrollDepth = () => {
    frame = 0;
    if (!visible) return;

    const rect = hero.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / rect.height));
    root.style.setProperty("--hero-scroll-depth", progress.toFixed(4));
  };

  const scheduleScrollDepth = () => {
    if (!frame) frame = requestAnimationFrame(updateScrollDepth);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    root.dataset.motion = visible ? "active" : "paused";
    if (visible) scheduleScrollDepth();
  });

  root.dataset.motion = "active";
  root.style.setProperty("--hero-scroll-depth", "0");
  observer.observe(hero);
  window.addEventListener("scroll", scheduleScrollDepth, { passive: true });
  window.addEventListener("resize", scheduleScrollDepth, { passive: true });
  scheduleScrollDepth();
};

document
  .querySelectorAll<HTMLElement>("[data-hero-motion]")
  .forEach(initializeHeroMotion);
