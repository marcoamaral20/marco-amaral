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
  let visible = false;
  let scrollDirty = true;
  let pointerEnabled = window.matchMedia(
    "(min-width: 64rem) and (hover: hover) and (pointer: fine)",
  ).matches;
  let pointerTargetX = 0;
  let pointerTargetY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let entranceRemaining = 2360;
  let entranceStartedAt = 0;
  let entranceTimer = 0;

  const finishEntrance = () => {
    entranceTimer = 0;
    entranceRemaining = 0;
    root.dataset.motionPhase = "living";
  };

  const resumeEntrance = () => {
    if (root.dataset.motionPhase !== "entering" || entranceTimer) return;
    entranceStartedAt = performance.now();
    entranceTimer = window.setTimeout(finishEntrance, entranceRemaining);
  };

  const pauseEntrance = () => {
    if (!entranceTimer) return;
    window.clearTimeout(entranceTimer);
    entranceTimer = 0;
    entranceRemaining = Math.max(
      0,
      entranceRemaining - (performance.now() - entranceStartedAt),
    );
  };

  const writePointerDepth = () => {
    const depths = [
      ["far", 3],
      ["mid", 7],
      ["near", 11],
    ] as const;

    for (const [name, range] of depths) {
      root.style.setProperty(
        `--hero-pointer-${name}-x`,
        `${(pointerX * range).toFixed(3)}px`,
      );
      root.style.setProperty(
        `--hero-pointer-${name}-y`,
        `${(pointerY * range * 0.65).toFixed(3)}px`,
      );
    }
  };

  const updateMotion = () => {
    frame = 0;
    if (!visible) return;

    if (scrollDirty) {
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / rect.height));
      root.style.setProperty("--hero-scroll-depth", progress.toFixed(4));
      scrollDirty = false;
    }

    pointerX += (pointerTargetX - pointerX) * 0.09;
    pointerY += (pointerTargetY - pointerY) * 0.09;
    writePointerDepth();

    if (
      Math.abs(pointerTargetX - pointerX) > 0.002 ||
      Math.abs(pointerTargetY - pointerY) > 0.002
    ) {
      frame = requestAnimationFrame(updateMotion);
    }
  };

  const scheduleMotion = () => {
    if (!frame) frame = requestAnimationFrame(updateMotion);
  };

  const updatePointerTarget = (event: PointerEvent) => {
    if (!pointerEnabled || event.pointerType === "touch") return;
    const rect = hero.getBoundingClientRect();
    pointerTargetX = Math.max(
      -1,
      Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
    );
    pointerTargetY = Math.max(
      -1,
      Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
    scheduleMotion();
  };

  const neutralizePointer = () => {
    pointerTargetX = 0;
    pointerTargetY = 0;
    scheduleMotion();
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    root.dataset.motion = visible ? "active" : "paused";
    if (visible) {
      resumeEntrance();
      scrollDirty = true;
      scheduleMotion();
    } else {
      pauseEntrance();
    }
  });

  root.dataset.motion = "paused";
  root.dataset.motionPhase = "entering";
  root.style.setProperty("--hero-scroll-depth", "0");
  observer.observe(hero);
  hero.addEventListener("pointermove", updatePointerTarget, { passive: true });
  hero.addEventListener("pointerleave", neutralizePointer, { passive: true });
  window.addEventListener(
    "scroll",
    () => {
      scrollDirty = true;
      scheduleMotion();
    },
    { passive: true },
  );
  window.addEventListener(
    "resize",
    () => {
      pointerEnabled = window.matchMedia(
        "(min-width: 64rem) and (hover: hover) and (pointer: fine)",
      ).matches;
      scrollDirty = true;
      neutralizePointer();
    },
    { passive: true },
  );
};

document
  .querySelectorAll<HTMLElement>("[data-hero-motion]")
  .forEach(initializeHeroMotion);
