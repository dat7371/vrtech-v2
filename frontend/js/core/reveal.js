function initializeRevealAnimations() {
  const items = Array.from(document.querySelectorAll(".reveal")).filter(
    (item) => item instanceof HTMLElement && item.dataset.revealReady !== "true"
  );
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!items.length) {
    return;
  }

  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    items.forEach((item) => {
      item.dataset.revealReady = "true";
      item.classList.add("show");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          entry.target.dataset.revealReady = "true";
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  items.forEach((item) => observer.observe(item));
}

document.addEventListener("DOMContentLoaded", initializeRevealAnimations);
document.addEventListener("componentsLoaded", initializeRevealAnimations);
