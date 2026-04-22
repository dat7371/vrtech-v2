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
  window.VRTECH_ASSETS?.applyAssetPaths?.(container);
}

function isImageElement(element) {
  return !!element && element instanceof HTMLElement && element.tagName === "IMG";
}

function isButtonElement(element) {
  return !!element && element instanceof HTMLElement && element.tagName === "BUTTON";
}

function formatPhoneHref(phone) {
  return `tel:${String(phone || "").replace(/[^\d+]/g, "")}`;
}

function getCompactProductName(product) {
  if (product?.short_name) {
    return product.short_name;
  }

  const fullName = product?.name || "";

  if (!fullName) {
    return "";
  }

  const afterBrand = fullName.includes("|") ? fullName.split("|")[1].trim() : fullName;
  return afterBrand.split(" - ")[0].trim();
}

function getTopBarTitle(product) {
  if (product?.top_title) {
    return product.top_title;
  }

  return getCompactProductName(product);
}

function getProductDetailTitle(product) {
  return product?.detail_title || `Giới thiệu và đánh giá ${getCompactProductName(product)}`;
}

function getAssuranceIconType(title) {
  const normalizedTitle = String(title || "").toLowerCase();

  if (normalizedTitle.includes("official") || normalizedTitle.includes("chinh thuc") || normalizedTitle.includes("việt nam") || normalizedTitle.includes("viet nam")) {
    return "official";
  }

  if (normalizedTitle.includes("cam ket") || normalizedTitle.includes("sản phẩm") || normalizedTitle.includes("san pham")) {
    return "product";
  }

  if (normalizedTitle.includes("bao hanh") || normalizedTitle.includes("bảo hành")) {
    return "warranty";
  }

  if (normalizedTitle.includes("ky thuat") || normalizedTitle.includes("kỹ thuật") || normalizedTitle.includes("ho tro")) {
    return "support";
  }

  if (normalizedTitle.includes("giao hang") || normalizedTitle.includes("vận chuyển") || normalizedTitle.includes("van chuyen")) {
    return "delivery";
  }

  return "official";
}

function getAssuranceIconSvg(iconType) {
  const icons = {
    official: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.3-2.5 8.1-7 10-4.5-1.9-7-5.7-7-10V6l7-3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 12.2l1.7 1.7 3.4-3.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    product: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    warranty: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.3-2.5 8.1-7 10-4.5-1.9-7-5.7-7-10V6l7-3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 12.2l1.7 1.7 3.4-3.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    support: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 0l-2 2a4 4 0 0 0 0 5.4l3 3a4 4 0 0 0 5.4 0l2-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 14l4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    delivery: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v8H3zM14 10h3l3 3v2h-6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7.5" cy="17.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.5" cy="17.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  };

  return icons[iconType] || icons.official;
}

function buildProductDetailBlocks(product) {
  const blocks = [];

  if (product?.desc) {
    blocks.push(`
      <div class="product-detail-block">
        <p>${product.desc}</p>
      </div>
    `);
  }

  if (Array.isArray(product?.highlights) && product.highlights.length) {
    blocks.push(`
      <div class="product-detail-block">
        <h3>Điểm nổi bật</h3>
        <ul class="product-detail-bullets">
          ${product.highlights.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `);
  }

  if (Array.isArray(product?.reasons) && product.reasons.length) {
    blocks.push(`
      <div class="product-detail-block">
        <h3>Lý do nên chọn</h3>
        <ul class="product-detail-bullets">
          ${product.reasons.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `);
  }

  return blocks.join("");
}

function getCompareSummary(product) {
  const specs = Array.isArray(product?.specs) ? product.specs : [];
  const getSpecValue = (label) => specs.find((item) => item.label === label)?.value || "";

  return {
    compactName: getCompactProductName(product),
    price: product?.price || "Lien he",
    category: product?.category || "Android Box O To",
    segment: getSpecValue("Phân khúc") || getSpecValue("Phan khuc") || product?.badge || "",
    connection: getSpecValue("Kết nối") || getSpecValue("Ket noi") || "Wi-Fi / Bluetooth",
    aftersales: getSpecValue("Hậu mãi") || getSpecValue("Hau mai") || product?.warranty_label || "",
    strengths: Array.isArray(product?.compare_good) ? product.compare_good.slice(0, 3) : [],
  };
}

function getProductPagePath(productKey) {
  return `../../pages/products/${productKey}.html`;
}

function fixProductPagePaths() {
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

function initializeProductCompare(currentKey) {
  const toggle = document.querySelector("[data-product-compare-toggle]");
  const panel = document.querySelector("[data-product-compare-panel]");
  const select = document.querySelector("[data-product-compare-select]");
  const results = document.querySelector("[data-product-compare-results]");
  const products = window.PRODUCTS || {};
  const compareKeys = Object.keys(products).filter((key) => key !== currentKey);

  if (!(toggle instanceof HTMLElement) || !(panel instanceof HTMLElement) || !(select instanceof HTMLSelectElement) || !(results instanceof HTMLElement)) {
    return;
  }

  if (!compareKeys.length) {
    toggle.hidden = true;
    panel.hidden = true;
    return;
  }

  const renderCompare = (targetKey) => {
    const currentProduct = products[currentKey];
    const targetProduct = products[targetKey];

    if (!currentProduct || !targetProduct) {
      return;
    }

    const currentSummary = getCompareSummary(currentProduct);
    const targetSummary = getCompareSummary(targetProduct);

    results.innerHTML = [currentSummary, targetSummary].map((summary, index) => {
      const linkedKey = index === 0 ? currentKey : targetKey;
      const linkedLabel = index === 0 ? "Bạn đang xem" : "Model đang so sánh";

      return `
        <article class="product-compare-mini-card">
          <div class="product-compare-mini-head">
            <span class="product-compare-mini-tag">${linkedLabel}</span>
            <h3>${summary.compactName}</h3>
          </div>
          <div class="product-compare-mini-table">
            <div><span>Phân khúc</span><strong>${summary.segment}</strong></div>
            <div><span>Giá</span><strong>${summary.price}</strong></div>
            <div><span>Loại</span><strong>${summary.category}</strong></div>
            <div><span>Kết nối</span><strong>${summary.connection}</strong></div>
            <div><span>Hậu mãi</span><strong>${summary.aftersales}</strong></div>
          </div>
          <ul class="product-compare-mini-points">
            ${summary.strengths.map((item) => `<li>${item}</li>`).join("")}
          </ul>
          <a class="product-compare-mini-link" href="${getProductPagePath(linkedKey)}">Xem trang sản phẩm</a>
        </article>
      `;
    }).join("");
  };

  select.innerHTML = compareKeys.map((key) => `<option value="${key}">${getCompactProductName(products[key])}</option>`).join("");
  renderCompare(compareKeys[0]);

  toggle.addEventListener("click", () => {
    const isHidden = panel.hidden;
    panel.hidden = !isHidden;
    toggle.setAttribute("aria-expanded", String(isHidden));
  });

  select.addEventListener("change", () => {
    renderCompare(select.value);
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
  const heroTrigger = document.querySelector("[data-product-hero-trigger]");
  const heroImage = document.querySelector("[data-product-hero-image]");
  const heroThumbs = document.getElementById("product-hero-thumbs");

  if (!gallery && !heroTrigger) {
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
        <button type="button" class="gallery-lightbox-nav gallery-lightbox-prev" data-lightbox-prev aria-label="Xem ảnh trước">
          <span aria-hidden="true">‹</span>
        </button>
        <img class="gallery-lightbox-image" alt="">
        <button type="button" class="gallery-lightbox-nav gallery-lightbox-next" data-lightbox-next aria-label="Xem ảnh tiếp theo">
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <div class="gallery-lightbox-strip" data-lightbox-strip></div>
    </div>
  `;

  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector(".gallery-lightbox-image");
  const zoomInButton = lightbox.querySelector("[data-lightbox-zoom-in]");
  const zoomOutButton = lightbox.querySelector("[data-lightbox-zoom-out]");
  const closeButtons = lightbox.querySelectorAll("[data-lightbox-close]");
  const lightboxDialog = lightbox.querySelector(".gallery-lightbox-dialog");
  const prevButton = lightbox.querySelector("[data-lightbox-prev]");
  const nextButton = lightbox.querySelector("[data-lightbox-next]");
  const lightboxStrip = lightbox.querySelector("[data-lightbox-strip]");

  if (
    !isImageElement(lightboxImage) ||
    !isButtonElement(zoomInButton) ||
    !isButtonElement(zoomOutButton) ||
    !isButtonElement(prevButton) ||
    !isButtonElement(nextButton) ||
    !(lightboxDialog instanceof HTMLElement) ||
    !(lightboxStrip instanceof HTMLElement)
  ) {
    return;
  }

  let currentScale = LIGHTBOX_MIN_SCALE;
  let lastFocusedElement = null;
  let currentIndex = 0;
  let activeItems = [];

  const getFocusableElements = () =>
    Array.from(lightbox.querySelectorAll(LIGHTBOX_FOCUSABLE_SELECTORS)).filter(
      (element) => element instanceof HTMLElement && !element.hasAttribute("hidden")
    );

  const syncZoomState = () => {
    lightboxImage.style.transform = `scale(${currentScale})`;
    zoomOutButton.disabled = currentScale <= LIGHTBOX_MIN_SCALE;
    zoomInButton.disabled = currentScale >= LIGHTBOX_MAX_SCALE;
  };

  const syncCarouselState = () => {
    const currentItem = activeItems[currentIndex];
    if (!currentItem) {
      return;
    }

    lightboxImage.src = currentItem.src;
    lightboxImage.alt = currentItem.alt;
    prevButton.hidden = activeItems.length <= 1;
    nextButton.hidden = activeItems.length <= 1;

    lightboxStrip.innerHTML = activeItems.map((item, index) => `
      <button
        type="button"
        class="gallery-lightbox-thumb${index === currentIndex ? " active" : ""}"
        data-lightbox-thumb="${index}"
        aria-label="Xem ảnh ${index + 1}"
      >
        <img src="${item.src}" alt="${item.alt}" width="200" height="200" loading="lazy">
      </button>
    `).join("");
  };

  const collectHeroItems = () => {
    if (!heroThumbs) {
      return [];
    }

    return Array.from(heroThumbs.querySelectorAll(".product-thumb-button")).map((button, index) => ({
      src: button.getAttribute("data-hero-image") || "",
      alt: button.getAttribute("data-hero-alt") || `Ảnh sản phẩm ${index + 1}`,
    })).filter((item) => item.src);
  };

  const setCurrentIndex = (nextIndex) => {
    if (!activeItems.length) {
      return;
    }

    currentIndex = (nextIndex + activeItems.length) % activeItems.length;
    currentScale = LIGHTBOX_MIN_SCALE;
    syncZoomState();
    syncCarouselState();
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

  const openLightbox = (items, startIndex = 0) => {
    if (!Array.isArray(items) || !items.length) {
      return;
    }

    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    activeItems = items;
    currentIndex = startIndex >= 0 ? startIndex : 0;
    currentScale = LIGHTBOX_MIN_SCALE;
    syncZoomState();
    syncCarouselState();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    closeButtons[closeButtons.length - 1]?.focus();
  };

  gallery?.addEventListener("click", (event) => {
    const clickedButton = event.target instanceof HTMLElement ? event.target.closest(".product-gallery-trigger") : null;
    const galleryButtons = Array.from(gallery.querySelectorAll(".product-gallery-trigger"));
    const clickedIndex = galleryButtons.findIndex((button) => button === clickedButton);
    const items = galleryButtons.map((button, index) => {
      const image = button.querySelector("img");
      return isImageElement(image)
        ? {
            src: image.currentSrc || image.src,
            alt: image.alt || `Ảnh sản phẩm ${index + 1}`,
          }
        : null;
    }).filter(Boolean);

    if (clickedIndex < 0 || !items.length) {
      return;
    }

    openLightbox(items, clickedIndex);
  });

  heroTrigger?.addEventListener("click", () => {
    const items = collectHeroItems();
    const activeHeroIndex = items.findIndex((item) => item.src === heroImage?.getAttribute("src"));

    if (items.length) {
      openLightbox(items, activeHeroIndex >= 0 ? activeHeroIndex : 0);
      return;
    }

    if (isImageElement(heroImage)) {
      openLightbox([
        {
          src: heroImage.currentSrc || heroImage.src,
          alt: heroImage.alt || "Ảnh sản phẩm",
        },
      ]);
    }
  });

  prevButton.addEventListener("click", () => {
    setCurrentIndex(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    setCurrentIndex(currentIndex + 1);
  });

  lightboxStrip.addEventListener("click", (event) => {
    const thumb = event.target instanceof HTMLElement ? event.target.closest("[data-lightbox-thumb]") : null;
    if (!(thumb instanceof HTMLElement)) {
      return;
    }

    const nextIndex = Number.parseInt(thumb.getAttribute("data-lightbox-thumb") || "", 10);
    if (Number.isNaN(nextIndex)) {
      return;
    }

    setCurrentIndex(nextIndex);
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

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prevButton.click();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextButton.click();
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
  document.querySelectorAll("[data-product-name-full]").forEach(el => el.textContent = getTopBarTitle(product));
  document.querySelectorAll("[data-product-name-compact]").forEach(el => el.textContent = getCompactProductName(product));
  document.querySelectorAll("[data-product-detail-title]").forEach(el => el.textContent = getProductDetailTitle(product));
  document.querySelectorAll("[data-product-detail-intro]").forEach((el) => {
    el.textContent = product.subtitle || "Nội dung mô tả chi tiết sản phẩm và các điểm cần biết trước khi chọn.";
  });
  document.querySelectorAll("[data-product-detail-copy]").forEach((el) => {
    el.innerHTML = buildProductDetailBlocks(product);
  });
  document.querySelectorAll("[data-product-badge]").forEach(el => el.textContent = product.badge);
  document.querySelectorAll("[data-product-subtitle]").forEach(el => el.textContent = product.subtitle);
  document.querySelectorAll("[data-product-desc]").forEach(el => el.textContent = product.desc);
  document.querySelectorAll("[data-product-stock]").forEach(el => el.textContent = product.stock_status || "Con hang");
  document.querySelectorAll("[data-product-brand]").forEach(el => el.textContent = product.brand || "Carlinkit");
  document.querySelectorAll("[data-product-category]").forEach(el => el.textContent = product.category || "Android Box O To");
  document.querySelectorAll("[data-product-condition]").forEach(el => el.textContent = product.condition || "");
  document.querySelectorAll("[data-product-warranty]").forEach(el => el.textContent = product.warranty_label || "Bao hanh 12 thang");
  document.querySelectorAll("[data-product-price]").forEach(el => el.textContent = product.price || "");
  document.querySelectorAll("[data-product-vat]").forEach(el => el.textContent = product.vat_label || "");
  document.querySelectorAll("[data-product-primary-cta]").forEach(el => el.textContent = product.primary_cta || "Mua ngay");
  document.querySelectorAll("[data-product-support-cta]").forEach(el => el.textContent = product.support_cta || "Goi tu van");
  document.querySelectorAll("[data-product-hotline]").forEach(el => el.textContent = product.support_phone || "0921515868");
  document.querySelectorAll("[data-product-hotline-link]").forEach((el) => {
    el.setAttribute("href", formatPhoneHref(product.support_phone || "0921515868"));
  });

  const oldPriceElements = document.querySelectorAll("[data-product-old-price]");
  oldPriceElements.forEach((el) => {
    const hasOldPrice = Boolean(product.old_price);
    el.textContent = product.old_price || "";
    el.hidden = !hasOldPrice;
  });

  document.querySelectorAll("[data-product-promo]").forEach((el) => {
    el.textContent = product.promo || "";
  });

  document.querySelectorAll("[data-product-promo-box]").forEach((el) => {
    el.hidden = !product.promo;
  });

  const quantityInput = document.querySelector("[data-quantity-input]");
  const decreaseButton = document.querySelector("[data-quantity-decrease]");
  const increaseButton = document.querySelector("[data-quantity-increase]");

  if (quantityInput instanceof HTMLInputElement && decreaseButton instanceof HTMLElement && increaseButton instanceof HTMLElement) {
    const syncQuantity = (nextValue) => {
      const parsed = Number.parseInt(String(nextValue), 10);
      quantityInput.value = String(Math.max(Number.isNaN(parsed) ? 1 : parsed, 1));
    };

    decreaseButton.addEventListener("click", () => {
      syncQuantity(Number.parseInt(quantityInput.value || "1", 10) - 1);
    });

    increaseButton.addEventListener("click", () => {
      syncQuantity(Number.parseInt(quantityInput.value || "1", 10) + 1);
    });

    quantityInput.addEventListener("input", () => {
      syncQuantity(quantityInput.value);
    });
  }

  const heroImage = document.querySelector("[data-product-hero-image]");
  if (heroImage && heroImage.tagName === "IMG" && product.hero_image) {
    heroImage.src = window.VRTECH_ASSETS?.asset?.(product.hero_image) || product.hero_image;
    heroImage.alt = product.name;
  }

  const heroThumbs = document.getElementById("product-hero-thumbs");
  if (heroThumbs && product.hero_image) {
    const extraGallery = Array.isArray(product.gallery_extra) ? product.gallery_extra.map((item) => item.image) : [];
    const heroGallery = [product.hero_image, ...(product.gallery || []).slice(0, 5), ...extraGallery];
    heroThumbs.innerHTML = heroGallery.map((image, index) => `
      <button
        type="button"
        class="product-thumb-button${index === 0 ? " active" : ""}"
        data-hero-image="${window.VRTECH_ASSETS?.asset?.(image) || image}"
        data-hero-alt="${product.name} - góc nhìn ${index + 1}"
        aria-label="Xem ảnh ${index + 1} của ${product.name}"
      >
        <img src="${window.VRTECH_ASSETS?.asset?.(image) || image}" alt="${product.name} - thumbnail ${index + 1}" width="800" height="800" loading="lazy">
      </button>
    `).join("");
  }

  const nexusImage = document.querySelector("[data-product-nexus-image]");
  if (nexusImage && nexusImage.tagName === "IMG") {
    const nexusImagePath = product.nexus_image || "images/products12thv2/app/appvrtechnexus.jpg";
    nexusImage.src = window.VRTECH_ASSETS?.asset?.(nexusImagePath) || nexusImagePath;
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
            src="${window.VRTECH_ASSETS?.asset?.(image) || image}"
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

  const assuranceMarkup = Array.isArray(product.assurances) ? product.assurances.map((item) => `
      <article class="product-assurance-item reveal">
        <div class="product-assurance-icon" data-icon="${getAssuranceIconType(item.title)}" aria-hidden="true">
          ${getAssuranceIconSvg(getAssuranceIconType(item.title))}
        </div>
        <div class="product-assurance-copy">
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
        </div>
      </article>
    `).join("") : "";

  const assuranceWrap = document.getElementById("product-assurance-list");
  if (assuranceWrap) {
    assuranceWrap.innerHTML = assuranceMarkup;
  }

  const specWrap = document.getElementById("product-spec-list");
  const specToggle = document.querySelector("[data-product-spec-toggle]");
  if (specWrap && Array.isArray(product.spec_sections) && product.spec_sections.length) {
    specWrap.innerHTML = product.spec_sections.map((section) => `
      <section class="product-spec-section reveal">
        <div class="product-spec-section-head">
          <span class="product-spec-dot" aria-hidden="true"></span>
          <h3>${section.title}</h3>
        </div>
        <div class="product-spec-table" role="table" aria-label="${section.title}">
          ${section.rows.map((row) => `
            <div class="product-spec-row" role="row">
              <div class="product-spec-key" role="rowheader">${row.label}</div>
              <div class="product-spec-data" role="cell">${row.value}</div>
            </div>
          `).join("")}
        </div>
      </section>
    `).join("");

    if (specToggle instanceof HTMLButtonElement) {
      const shouldCollapse = product.spec_sections.length > 2;
      specWrap.classList.toggle("is-collapsed", shouldCollapse);
      specToggle.hidden = !shouldCollapse;
      specToggle.setAttribute("aria-expanded", shouldCollapse ? "false" : "true");
      specToggle.textContent = "Xem chi tiết cấu hình";
      specToggle.onclick = shouldCollapse
        ? () => {
            const isCollapsed = specWrap.classList.toggle("is-collapsed");
            specToggle.setAttribute("aria-expanded", String(!isCollapsed));
            specToggle.textContent = isCollapsed ? "Xem chi tiết cấu hình" : "Thu gọn cấu hình";
          }
        : null;
    }
  } else if (specWrap && Array.isArray(product.specs)) {
    specWrap.innerHTML = `
      <div class="product-spec-grid">
        ${product.specs.map(item => `
          <article class="product-spec-card reveal">
            <span class="product-spec-label">${item.label}</span>
            <strong class="product-spec-value">${item.value}</strong>
          </article>
        `).join("")}
      </div>
    `;
    if (specToggle instanceof HTMLButtonElement) {
      specToggle.hidden = true;
      specToggle.onclick = null;
    }
  }

  initializeHeroGallery();
  initializeProductCompare(key);
}

function initializeHeroGallery() {
  const heroImage = document.querySelector("[data-product-hero-image]");
  const heroThumbs = document.getElementById("product-hero-thumbs");
  const prevButton = document.querySelector("[data-hero-prev]");
  const nextButton = document.querySelector("[data-hero-next]");

  if (!(heroImage instanceof HTMLElement) || !heroThumbs) {
    return;
  }

  const thumbButtons = () => Array.from(heroThumbs.querySelectorAll(".product-thumb-button"));

  if (!thumbButtons().length) {
    if (prevButton instanceof HTMLButtonElement) {
      prevButton.hidden = true;
    }

    if (nextButton instanceof HTMLButtonElement) {
      nextButton.hidden = true;
    }

    return;
  }

  const setActiveImage = (button) => {
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

    thumbButtons().forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");
  };

  const moveActiveImage = (direction) => {
    const buttons = thumbButtons();
    if (!buttons.length) {
      return;
    }

    const currentIndex = buttons.findIndex((button) => button.classList.contains("active"));
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (safeIndex + direction + buttons.length) % buttons.length;
    setActiveImage(buttons[nextIndex]);
  };

  heroThumbs.addEventListener("click", (event) => {
    const button = event.target instanceof HTMLElement ? event.target.closest(".product-thumb-button") : null;
    if (!(button instanceof HTMLElement)) {
      return;
    }

    setActiveImage(button);
  });

  prevButton?.addEventListener("click", () => {
    moveActiveImage(-1);
  });

  nextButton?.addEventListener("click", () => {
    moveActiveImage(1);
  });
}

loadProductPage();
