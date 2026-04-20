function updateHeaderOnScroll() {
  const header = document.querySelector(".site-header");
  if (!header) {
    return;
  }

  header.classList.toggle("scrolled", window.scrollY > 50);
}

document.addEventListener("componentsLoaded", () => {
  console.log("VRTECH landing loaded");

  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    setTimeout(() => {
      const target = document.getElementById(targetId);
      if (target) {
        if (window.VRTECH_UI?.scrollToElement) {
          window.VRTECH_UI.scrollToElement(target);
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 100);
  }

  updateHeaderOnScroll();
});

document.addEventListener("DOMContentLoaded", updateHeaderOnScroll);
window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
