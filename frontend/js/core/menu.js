const SECTION_SEARCH_ROUTES = [
  { tokens: ["trang chu", "home", "hero"], path: "index.html#hero" },
  { tokens: ["nexus", "ung dung", "app"], path: "pages/app-vrtech.html" },
  { tokens: ["san pham", "products"], path: "index.html#products" },
  { tokens: ["nen chon", "chon phien ban", "so sanh", "compare"], path: "index.html#chon-phien-ban" },
  { tokens: ["tra cuu bao hanh", "kiem tra bao hanh"], path: "pages/bao-hanh.html#tra-cuu-bao-hanh" },
  { tokens: ["chinh hang", "vat", "official"], path: "index.html#official" },
  { tokens: ["bao hanh", "warranty"], path: "pages/bao-hanh.html" },
  { tokens: ["faq", "cau hoi", "hoi dap"], path: "index.html#faq" },
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
  const dropdowns = Array.from(nav?.querySelectorAll(".nav-dropdown") || []);
  const desktopHoverQuery = window.matchMedia("(hover: hover) and (min-width: 1024px)");
  const dropdownCloseTimers = new Map();

  if (!toggle || !nav || !header || header.dataset.navReady === "true") {
    document.querySelectorAll(".search-box").forEach(handleSearch);
    return;
  }

  header.dataset.navReady = "true";

  const closeNav = () => {
    nav.classList.remove("open");
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("open");
      dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
    });
  };

  const openNav = () => {
    nav.classList.add("open");
    header.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  const setDropdownState = (dropdown, isOpen) => {
    const closeTimer = dropdownCloseTimers.get(dropdown);
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      dropdownCloseTimers.delete(dropdown);
    }

    dropdowns.forEach((item) => {
      if (item !== dropdown) {
        item.classList.remove("open");
        item.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
      }
    });

    dropdown.classList.toggle("open", isOpen);
    dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", String(isOpen));
    header.classList.toggle("nav-open", dropdowns.some((item) => item.classList.contains("open")) || nav.classList.contains("open"));
  };

  const scheduleDropdownClose = (dropdown) => {
    const closeTimer = dropdownCloseTimers.get(dropdown);
    if (closeTimer) {
      window.clearTimeout(closeTimer);
    }

    dropdownCloseTimers.set(
      dropdown,
      window.setTimeout(() => {
        setDropdownState(dropdown, false);
      }, 180)
    );
  };

  toggle.addEventListener("click", () => {
    if (nav.classList.contains("open")) {
      closeNav();
      return;
    }

    openNav();
  });

  dropdowns.forEach((dropdown) => {
    const dropdownToggle = dropdown.querySelector(".nav-dropdown-toggle");

    dropdownToggle?.addEventListener("click", () => {
      const isOpen = dropdown.classList.contains("open");
      setDropdownState(dropdown, !isOpen);
    });

    dropdown.addEventListener("mouseenter", () => {
      if (!desktopHoverQuery.matches) {
        return;
      }

      setDropdownState(dropdown, true);
    });

    dropdown.addEventListener("mouseleave", () => {
      if (!desktopHoverQuery.matches) {
        return;
      }

      scheduleDropdownClose(dropdown);
    });

    dropdown.addEventListener("focusin", () => {
      if (!desktopHoverQuery.matches) {
        return;
      }

      setDropdownState(dropdown, true);
    });

    dropdown.addEventListener("focusout", (event) => {
      if (!desktopHoverQuery.matches) {
        return;
      }

      const nextFocused = event.relatedTarget;
      if (nextFocused instanceof Node && dropdown.contains(nextFocused)) {
        return;
      }

      scheduleDropdownClose(dropdown);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("open")) {
      const openDropdown = dropdowns.find((dropdown) => dropdown.classList.contains("open"));
      if (openDropdown && event.target instanceof Node && !openDropdown.contains(event.target)) {
        setDropdownState(openDropdown, false);
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
