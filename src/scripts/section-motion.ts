const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const sections = Array.from(
  document.querySelectorAll<HTMLElement>("[data-section-motion]"),
);

if (reducedMotion.matches) {
  sections.forEach((section) => {
    section.dataset.motionState = "reduced";
  });
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = entry.target as HTMLElement;
        if (section.dataset.motionState !== "dormant") return;

        section.dataset.motionState = "entering";
        const duration = Number.parseInt(
          section.dataset.motionEntranceDuration ?? "1800",
          10,
        );
        window.setTimeout(() => {
          section.dataset.motionState = "living";
        }, duration);
        observer.unobserve(section);
      });
    },
    { threshold: 0.15 },
  );

  sections.forEach((section) => {
    section.dataset.motionState = "dormant";
    observer.observe(section);
  });
}
