function injectStaticPageComponents() {
  window.VRTECH_COMPONENTS?.injectComponent?.("header", "header");
  window.VRTECH_COMPONENTS?.injectComponent?.("footer", "footer");
}

function fixStaticPagePaths() {
  const prefix = "../";

  document.querySelectorAll('a[href^="index.html"], a[href^="pages/"]').forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) {
      return;
    }

    link.setAttribute("href", `${prefix}${href}`);
  });
}

function initializeStaticPage() {
  injectStaticPageComponents();
  fixStaticPagePaths();
  setTimeout(() => {
    document.dispatchEvent(new Event("componentsLoaded"));
  }, 0);
}

if (document.getElementById("header") || document.getElementById("footer")) {
  initializeStaticPage();
}
