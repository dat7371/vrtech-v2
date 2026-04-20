const PRODUCT_PAGE_COMPONENTS = [
  ["header", "header"],
  ["product-hero", "product-hero"],
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

  if (!isImageElement(lightboxImage) || !isButtonElement(zoomInButton) || !isButtonElement(zoomOutButton)) {
    return;
  }

  let currentScale = LIGHTBOX_MIN_SCALE;

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
  };

  const openLightbox = (image) => {
    if (!isImageElement(image)) {
      return;
    }

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    currentScale = LIGHTBOX_MIN_SCALE;
    syncZoomState();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  };

  gallery.addEventListener("click", (event) => {
    const clickedImage = event.target instanceof HTMLElement ? event.target.closest(".product-gallery-card img") : null;
    if (!isImageElement(clickedImage)) {
      return;
    }

    openLightbox(clickedImage);
  });

  gallery.querySelectorAll(".product-gallery-card img").forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `${image.alt}. Nhấn để xem toàn màn hình`);

    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
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

  const nexusImage = document.querySelector("[data-product-nexus-image]");
  if (nexusImage && nexusImage.tagName === "IMG") {
    const nexusImagePath = product.nexus_image || "images/products/app/app-vrtechnexus.jpg";
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
        <img
          src="../../${image}"
          alt="${product.name} - hình thực tế ${index + 1}"
          width="2000"
          height="2000"
          loading="lazy"
        >
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
}

loadProductPage();
