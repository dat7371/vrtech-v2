const PRODUCT_PAGE_COMPONENTS = [
  ["header", "header"],
  ["product-hero", "product-hero"],
  ["product-specs", "product-specs"],
  ["product-reasons", "product-reasons"],
  ["product-nexus", "product-nexus"],
  ["product-performance", "product-performance"],
  ["product-features", "product-features"],
  ["product-images", "product-images"],
  ["product-compare", "product-compare"],
  ["product-warranty", "product-warranty"],
  ["product-cta", "product-cta"],
  ["footer", "footer"],
];

const LIGHTBOX_MIN_SCALE = 1;
const LIGHTBOX_MAX_SCALE = 3;
const LIGHTBOX_SCALE_STEP = 0.25;
const LIGHTBOX_FOCUSABLE_SELECTORS = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

function injectProductComponent(targetId, componentKey) {
  const container = document.getElementById(targetId);
  const template = window.COMPONENT_REGISTRY?.[componentKey];

  if (!container || !template) {
    return;
  }

  container.innerHTML = template;
}

function isImageElement(element) {
  return !!element && element instanceof HTMLElement && element.tagName === "IMG";
}

function isButtonElement(element) {
  return !!element && element instanceof HTMLElement && element.tagName === "BUTTON";
}

function fixProductPagePaths() {
  const headerImg = document.querySelector(".logo-image img");
  if (headerImg) {
    headerImg.src = "../../images/logo/LOGO VRTECH-02.png";
  }

  const logoLink = document.querySelector(".logo-image");
  if (logoLink) {
    logoLink.setAttribute("href", "../../index.html");
  }

  document.querySelectorAll(".navbar a[href]").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) {
      return;
    }

    if (href.startsWith("index.html")) {
      link.setAttribute("href", `../../${href}`);
      return;
    }

    if (href === "pages/app-vrtech.html") {
      link.setAttribute("href", "../../pages/app-vrtech.html");
      return;
    }

    if (href.startsWith("pages/products/")) {
      link.setAttribute("href", `../../${href}`);
    }
  });
}

function loadProductPage() {
  PRODUCT_PAGE_COMPONENTS.forEach(([targetId, componentKey]) => {
    injectProductComponent(targetId, componentKey);
  });

  renderProductData();
  initializeProductGalleryLightbox();
  fixProductPagePaths();
  setTimeout(() => {
    document.dispatchEvent(new Event("componentsLoaded"));
  }, 0);
}

function initializeProductGalleryLightbox() {
  if (document.body.dataset.galleryLightboxReady === "true") {
    return;
  }

  const gallery = document.getElementById("product-gallery-list");
  if (!gallery) {
    return;
  }

  document.body.dataset.galleryLightboxReady = "true";

  const lightbox = document.createElement("div");
  lightbox.className = "gallery-lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <div class="gallery-lightbox-backdrop" data-lightbox-close></div>
    <div class="gallery-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Xem ảnh sản phẩm">
      <div class="gallery-lightbox-toolbar">
        <button type="button" class="lightbox-action" data-lightbox-zoom-out aria-label="Thu nhỏ ảnh">-</button>
        <button type="button" class="lightbox-action" data-lightbox-zoom-in aria-label="Phóng to ảnh">+</button>
        <button type="button" class="lightbox-action lightbox-close" data-lightbox-close aria-label="Đóng ảnh">×</button>
      </div>
      <div class="gallery-lightbox-viewport">
        <img class="gallery-lightbox-image" alt="">
      </div>
    </div>
  `;

  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector(".gallery-lightbox-image");
  const zoomInButton = lightbox.querySelector("[data-lightbox-zoom-in]");
  const zoomOutButton = lightbox.querySelector("[data-lightbox-zoom-out]");
  const closeButtons = lightbox.querySelectorAll("[data-lightbox-close]");
  const lightboxDialog = lightbox.querySelector(".gallery-lightbox-dialog");

  if (
    !isImageElement(lightboxImage) ||
    !isButtonElement(zoomInButton) ||
    !isButtonElement(zoomOutButton) ||
    !(lightboxDialog instanceof HTMLElement)
  ) {
    return;
  }

  let currentScale = LIGHTBOX_MIN_SCALE;
  let lastFocusedElement = null;

  const getFocusableElements = () =>
    Array.from(lightbox.querySelectorAll(LIGHTBOX_FOCUSABLE_SELECTORS)).filter(
      (element) => element instanceof HTMLElement && !element.hasAttribute("hidden")
    );

  const syncZoomState = () => {
    lightboxImage.style.transform = `scale(${currentScale})`;
    zoomOutButton.disabled = currentScale <= LIGHTBOX_MIN_SCALE;
    zoomInButton.disabled = currentScale >= LIGHTBOX_MAX_SCALE;
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    currentScale = LIGHTBOX_MIN_SCALE;
    syncZoomState();
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  };

  const openLightbox = (image) => {
    if (!isImageElement(image)) {
      return;
    }

    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    currentScale = LIGHTBOX_MIN_SCALE;
    syncZoomState();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    closeButtons[closeButtons.length - 1]?.focus();
  };

  gallery.addEventListener("click", (event) => {
    const clickedButton = event.target instanceof HTMLElement ? event.target.closest(".product-gallery-trigger") : null;
    const clickedImage = clickedButton?.querySelector("img");
    if (!isImageElement(clickedImage)) {
      return;
    }

    openLightbox(clickedImage);
  });

  zoomInButton.addEventListener("click", () => {
    currentScale = Math.min(currentScale + LIGHTBOX_SCALE_STEP, LIGHTBOX_MAX_SCALE);
    syncZoomState();
  });

  zoomOutButton.addEventListener("click", () => {
    currentScale = Math.max(currentScale - LIGHTBOX_SCALE_STEP, LIGHTBOX_MIN_SCALE);
    syncZoomState();
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
      return;
    }

    if (event.key === "Tab") {
      const focusableElements = getFocusableElements();
      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
      return;
    }

    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomInButton.click();
      return;
    }

    if (event.key === "-") {
      event.preventDefault();
      zoomOutButton.click();
    }
  });
}

function renderProductData() {
  const key = document.body.dataset.product;
  const product = window.PRODUCTS?.[key];
  if (!product) return;

  document.querySelectorAll("[data-product-name]").forEach(el => el.textContent = product.name);
  document.querySelectorAll("[data-product-badge]").forEach(el => el.textContent = product.badge);
  document.querySelectorAll("[data-product-subtitle]").forEach(el => el.textContent = product.subtitle);
  document.querySelectorAll("[data-product-desc]").forEach(el => el.textContent = product.desc);

  const heroImage = document.querySelector("[data-product-hero-image]");
  if (heroImage && heroImage.tagName === "IMG" && product.hero_image) {
    heroImage.src = `../../${product.hero_image}`;
    heroImage.alt = product.name;
  }

  const heroThumbs = document.getElementById("product-hero-thumbs");
  if (heroThumbs && product.hero_image) {
    const heroGallery = [product.hero_image, ...(product.gallery || []).slice(0, 4)];
    heroThumbs.innerHTML = heroGallery.map((image, index) => `
      <button
        type="button"
        class="product-thumb-button${index === 0 ? " active" : ""}"
        data-hero-image="../../${image}"
        data-hero-alt="${product.name} - góc nhìn ${index + 1}"
        aria-label="Xem ảnh ${index + 1} của ${product.name}"
      >
        <img src="../../${image}" alt="${product.name} - thumbnail ${index + 1}" width="800" height="800" loading="lazy">
      </button>
    `).join("");
  }

  const nexusImage = document.querySelector("[data-product-nexus-image]");
  if (nexusImage && nexusImage.tagName === "IMG") {
    const nexusImagePath = product.nexus_image || "images/products12th/app/appvrtechnexus.jpg";
    nexusImage.src = `../../${nexusImagePath}`;
    nexusImage.alt = `VRTECH Nexus trên ${product.name}`;
  }

  const reasonsWrap = document.getElementById("product-reasons-list");
  if (reasonsWrap) {
    reasonsWrap.innerHTML = product.reasons.map(item => `
      <div class="feature-card reveal">
        <h3>${item}</h3>
        <p>Điểm mạnh giúp model này dễ chốt đơn hơn trong đúng nhóm khách hàng mục tiêu.</p>
      </div>
    `).join("");
  }

  const performanceWrap = document.getElementById("product-performance-list");
  if (performanceWrap) {
    performanceWrap.innerHTML = product.performance.map(item => `
      <div class="exp-card reveal">${item}</div>
    `).join("");
  }

  const featuresWrap = document.getElementById("product-features-list");
  if (featuresWrap) {
    featuresWrap.innerHTML = product.features.map(item => `
      <div class="exp-card reveal">${item}</div>
    `).join("");
  }

  const galleryWrap = document.getElementById("product-gallery-list");
  if (galleryWrap && Array.isArray(product.gallery)) {
    galleryWrap.innerHTML = product.gallery.map((image, index) => `
      <figure class="product-gallery-card reveal">
        <button
          type="button"
          class="product-gallery-trigger"
          aria-label="Xem toàn màn hình ảnh ${index + 1} của ${product.name}"
        >
          <img
            src="../../${image}"
            alt="${product.name} - hình thực tế ${index + 1}"
            width="2000"
            height="2000"
            loading="lazy"
          >
        </button>
      </figure>
    `).join("");
  }

  const goodWrap = document.getElementById("product-compare-good");
  if (goodWrap) {
    goodWrap.innerHTML = product.compare_good.map(item => `<li>${item}</li>`).join("");
  }

  const badWrap = document.getElementById("product-compare-bad");
  if (badWrap) {
    badWrap.innerHTML = product.compare_bad.map(item => `<li>${item}</li>`).join("");
  }

  const highlightWrap = document.getElementById("product-highlight-list");
  if (highlightWrap && Array.isArray(product.highlights)) {
    highlightWrap.innerHTML = product.highlights.map(item => `<li>${item}</li>`).join("");
  }

  const specWrap = document.getElementById("product-spec-list");
  if (specWrap && Array.isArray(product.specs)) {
    specWrap.innerHTML = product.specs.map(item => `
      <article class="product-spec-card reveal">
        <span class="product-spec-label">${item.label}</span>
        <strong class="product-spec-value">${item.value}</strong>
      </article>
    `).join("");
  }

  initializeHeroGallery();
}

function initializeHeroGallery() {
  const heroImage = document.querySelector("[data-product-hero-image]");
  const heroThumbs = document.getElementById("product-hero-thumbs");

  if (!(heroImage instanceof HTMLElement) || !heroThumbs) {
    return;
  }

  heroThumbs.addEventListener("click", (event) => {
    const button = event.target instanceof HTMLElement ? event.target.closest(".product-thumb-button") : null;
    if (!(button instanceof HTMLElement)) {
      return;
    }

    const nextImage = button.getAttribute("data-hero-image");
    const nextAlt = button.getAttribute("data-hero-alt");

    if (!nextImage) {
      return;
    }

    heroImage.setAttribute("src", nextImage);
    heroImage.setAttribute("alt", nextAlt || "");

    heroThumbs.querySelectorAll(".product-thumb-button").forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");
  });
}

loadProductPage();
