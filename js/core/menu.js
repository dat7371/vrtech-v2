const SECTION_SEARCH_ROUTES = [
  { tokens: ["trang chu", "home", "hero"], path: "index.html#hero" },
  { tokens: ["nexus", "ung dung", "app"], path: "pages/app-vrtech.html" },
  { tokens: ["san pham", "products"], path: "index.html#products" },
  { tokens: ["chinh hang", "vat", "official"], path: "index.html#official" },
  { tokens: ["bao hanh", "warranty"], path: "pages/bao-hanh.html" },
  { tokens: ["lien he", "contact", "tu van"], path: "index.html#contact" },
];

const PRODUCT_SEARCH_ROUTES = [
  { tokens: ["s2a"], path: "pages/products/s2a.html" },
  { tokens: ["s2p"], path: "pages/products/s2p.html" },
  { tokens: ["plus"], path: "pages/products/plus.html" },
  { tokens: ["ambient"], path: "pages/products/ambient.html" },
  { tokens: ["ultra", "ultra max"], path: "pages/products/ultra.html" },
];

function getBasePath() {
  const path = window.location.pathname;

  if (path.includes("/pages/products/")) {
    return "../../";
  }

  if (path.includes("/pages/")) {
    return "../";
  }

  return "";
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function scrollToElement(target) {
  if (!target) {
    return;
  }

  const headerHeight = document.querySelector(".site-header")?.offsetHeight ?? 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: "smooth",
  });
}

function resolveSitePath(path) {
  if (path.startsWith("../") || path.startsWith("../../") || path.startsWith("http")) {
    return path;
  }

  return `${getBasePath()}${path}`;
}

function handleSearch(form) {
  const input = form.querySelector('input[type="search"]');
  if (!input || form.dataset.searchReady === "true") {
    return;
  }

  form.dataset.searchReady = "true";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = normalizeText(input.value);
    if (!query) {
      input.focus();
      return;
    }

    const productMatch = PRODUCT_SEARCH_ROUTES.find(({ tokens }) =>
      tokens.some((token) => query.includes(token))
    );

    if (productMatch) {
      window.location.href = resolveSitePath(productMatch.path);
      return;
    }

    const sectionMatch = SECTION_SEARCH_ROUTES.find(({ tokens }) =>
      tokens.some((token) => query.includes(token))
    );

    if (sectionMatch) {
      window.location.href = resolveSitePath(sectionMatch.path);
      return;
    }

    const productCard = Array.from(document.querySelectorAll(".product-card")).find((card) =>
      normalizeText(card.textContent || "").includes(query)
    );

    if (productCard instanceof HTMLElement) {
      productCard.focus();
      scrollToElement(productCard);
      return;
    }

    input.setCustomValidity("Chua tim thay noi dung phu hop.");
    input.reportValidity();
    input.addEventListener(
      "input",
      () => {
        input.setCustomValidity("");
      },
      { once: true }
    );
  });
}

function initializeHeader() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mobileNav");
  const header = document.querySelector(".site-header");
  const productDropdown = nav?.querySelector(".nav-dropdown");
  const productToggle = productDropdown?.querySelector(".nav-dropdown-toggle");
  const desktopHoverQuery = window.matchMedia("(hover: hover) and (min-width: 1024px)");
  let productDropdownCloseTimer = null;

  if (!toggle || !nav || !header || header.dataset.navReady === "true") {
    document.querySelectorAll(".search-box").forEach(handleSearch);
    return;
  }

  header.dataset.navReady = "true";

  const closeNav = () => {
    nav.classList.remove("open");
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    productDropdown?.classList.remove("open");
    productToggle?.setAttribute("aria-expanded", "false");
  };

  const openNav = () => {
    nav.classList.add("open");
    header.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  const setProductDropdownState = (isOpen) => {
    if (productDropdownCloseTimer) {
      window.clearTimeout(productDropdownCloseTimer);
      productDropdownCloseTimer = null;
    }

    productDropdown?.classList.toggle("open", isOpen);
    productToggle?.setAttribute("aria-expanded", String(isOpen));
    header.classList.toggle("nav-open", isOpen || nav.classList.contains("open"));
  };

  const scheduleProductDropdownClose = () => {
    if (productDropdownCloseTimer) {
      window.clearTimeout(productDropdownCloseTimer);
    }

    productDropdownCloseTimer = window.setTimeout(() => {
      setProductDropdownState(false);
    }, 180);
  };

  toggle.addEventListener("click", () => {
    if (nav.classList.contains("open")) {
      closeNav();
      return;
    }

    openNav();
  });

  productToggle?.addEventListener("click", () => {
    const isOpen = productDropdown?.classList.contains("open");
    setProductDropdownState(!isOpen);
  });

  productDropdown?.addEventListener("mouseenter", () => {
    if (!desktopHoverQuery.matches) {
      return;
    }

    setProductDropdownState(true);
  });

  productDropdown?.addEventListener("mouseleave", () => {
    if (!desktopHoverQuery.matches) {
      return;
    }

    scheduleProductDropdownClose();
  });

  productDropdown?.addEventListener("focusin", () => {
    if (!desktopHoverQuery.matches) {
      return;
    }

    setProductDropdownState(true);
  });

  productDropdown?.addEventListener("focusout", (event) => {
    if (!desktopHoverQuery.matches) {
      return;
    }

    const nextFocused = event.relatedTarget;
    if (nextFocused instanceof Node && productDropdown.contains(nextFocused)) {
      return;
    }

    scheduleProductDropdownClose();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("open")) {
      if (productDropdown?.classList.contains("open")) {
        if (event.target instanceof Node && !productDropdown.contains(event.target)) {
          setProductDropdownState(false);
        }
      }

      return;
    }

    if (event.target instanceof Node && !header.contains(event.target)) {
      closeNav();
    }
  });

  nav.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", () => {
      closeNav();
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      const target = id ? document.querySelector(id) : null;

      if (!target) {
        return;
      }

      event.preventDefault();
      scrollToElement(target);
      closeNav();
    });
  });

  document.querySelectorAll(".search-box").forEach(handleSearch);
}

window.VRTECH_UI = window.VRTECH_UI || {};
window.VRTECH_UI.scrollToElement = scrollToElement;

document.addEventListener("DOMContentLoaded", initializeHeader);
document.addEventListener("componentsLoaded", initializeHeader);
