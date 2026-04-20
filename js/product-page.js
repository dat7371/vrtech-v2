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

function injectProductComponent(targetId, componentKey) {
  const container = document.getElementById(targetId);
  const template = window.COMPONENT_REGISTRY?.[componentKey];

  if (!container || !template) {
    return;
  }

  container.innerHTML = template;
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
    }
  });
}

function loadProductPage() {
  PRODUCT_PAGE_COMPONENTS.forEach(([targetId, componentKey]) => {
    injectProductComponent(targetId, componentKey);
  });

  renderProductData();
  fixProductPagePaths();
  setTimeout(() => {
    document.dispatchEvent(new Event("componentsLoaded"));
  }, 0);
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
