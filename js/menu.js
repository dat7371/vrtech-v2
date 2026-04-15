document.addEventListener("componentsLoaded", () => {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mobileNav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  // Handle anchor links on same page
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

  // Handle navigation links (close menu and let browser handle navigation)
  document.querySelectorAll('a[href*="index.html"], a[href*="pages/"]').forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
      // Let browser handle navigation naturally
    });
  });

  // Handle links that go to index.html#anchor from product pages
  // This allows cross-page anchor navigation
  document.querySelectorAll('a[href*="index.html#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      // On product page, just close menu and let browser navigate
      nav?.classList.remove("open");
      // Don't prevent default - let the browser navigate
    });
  });
});