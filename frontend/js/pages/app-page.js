function injectAppHeader() {
  window.VRTECH_COMPONENTS?.injectComponent?.("header", "header");
  window.VRTECH_COMPONENTS?.injectComponent?.("footer", "footer");
}

function fixAppPageHeaderPaths() {
  const logoLink = document.querySelector(".logo-image");
  if (logoLink) {
    logoLink.setAttribute("href", "../index.html");
  }

  document.querySelectorAll(".site-header a[href], .site-footer a[href]").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) {
      return;
    }

    if (href.startsWith("index.html")) {
      link.setAttribute("href", `../${href}`);
      return;
    }

    if (href.startsWith("pages/")) {
      link.setAttribute("href", `../${href}`);
    }
  });
}

function initializeAppStorePreview() {
  const previewImage = document.getElementById("appPhonePreview");
  const previewButtons = Array.from(document.querySelectorAll("[data-app-preview]"));

  if (!previewImage || previewButtons.length === 0) {
    return;
  }

  let activeIndex = previewButtons.findIndex((button) => button.getAttribute("aria-pressed") === "true");
  let rotationTimer;

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  function showPreview(index) {
    const button = previewButtons[index];
    const nextImage = button.getAttribute("data-app-preview");
    const nextAlt = button.getAttribute("data-app-preview-alt");

    if (!nextImage) {
      return;
    }

    activeIndex = index;
    previewImage.setAttribute("src", nextImage);

    if (nextAlt) {
      previewImage.setAttribute("alt", nextAlt);
    }

    previewButtons.forEach((item) => {
      item.setAttribute("aria-pressed", "false");
    });
    button.setAttribute("aria-pressed", "true");
  }

  function startRotation() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    rotationTimer = window.setInterval(() => {
      showPreview((activeIndex + 1) % previewButtons.length);
    }, 3500);
  }

  previewButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      window.clearInterval(rotationTimer);
      showPreview(index);
      startRotation();
    });
  });

  showPreview(activeIndex);
  startRotation();
}

function initializeAppPage() {
  injectAppHeader();
  fixAppPageHeaderPaths();
  initializeAppStorePreview();
  setTimeout(() => {
    document.dispatchEvent(new Event("componentsLoaded"));
  }, 0);
}

if (document.body.dataset.page === "app" && (document.getElementById("header") || document.getElementById("footer"))) {
  initializeAppPage();
}
