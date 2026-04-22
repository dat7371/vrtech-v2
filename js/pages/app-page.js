function injectAppHeader() {
  const container = document.getElementById("header");
  const template = window.COMPONENT_REGISTRY?.header;

  if (!container || !template) {
    return;
  }

  container.innerHTML = template;
  window.VRTECH_ASSETS?.applyAssetPaths?.(container);
}

function fixAppPageHeaderPaths() {
  const logoLink = document.querySelector(".logo-image");
  if (logoLink) {
    logoLink.setAttribute("href", "../index.html");
  }

  document.querySelectorAll(".navbar a[href]").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) {
      return;
    }

    if (href.startsWith("index.html")) {
      link.setAttribute("href", `../${href}`);
      return;
    }

    if (href === "pages/app-vrtech.html") {
      link.setAttribute("href", "../pages/app-vrtech.html");
      return;
    }

    if (href.startsWith("pages/products/")) {
      link.setAttribute("href", `../${href}`);
    }
  });
}

function initializeAppPage() {
  injectAppHeader();
  fixAppPageHeaderPaths();
  setTimeout(() => {
    document.dispatchEvent(new Event("componentsLoaded"));
  }, 0);
}

if (document.getElementById("header")) {
  initializeAppPage();
}
