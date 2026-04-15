document.addEventListener("componentsLoaded", () => {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mobileNav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      const target = document.querySelector(id);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        nav?.classList.remove("open");
      }
    });
  });

  document.querySelectorAll('a[href*="index.html"], a[href*="pages/"]').forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
    });
  });
});