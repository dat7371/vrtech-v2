function loadProductComponent(id, file) {
  return fetch(file)
    .then((res) => {
      if (!res.ok) throw new Error(`Không tải được ${file}`);
      return res.text();
    })
    .then((html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
}

async function loadProductPage() {
  await Promise.all([
    loadProductComponent("header", "components/header.html"),
    loadProductComponent("product-hero", "components/product-hero.html"),
    loadProductComponent("product-reasons", "components/product-reasons.html"),
    loadProductComponent("product-nexus", "components/product-nexus.html"),
    loadProductComponent("product-performance", "components/product-performance.html"),
    loadProductComponent("product-features", "components/product-features.html"),
    loadProductComponent("product-images", "components/product-images.html"),
    loadProductComponent("product-compare", "components/product-compare.html"),
    loadProductComponent("product-warranty", "components/product-warranty.html"),
    loadProductComponent("product-cta", "components/product-cta.html"),
    loadProductComponent("footer", "components/footer.html")
  ]);

  renderProductData();
  document.dispatchEvent(new Event("componentsLoaded"));
}

function renderProductData() {
  const key = document.body.dataset.product;
  const product = window.PRODUCTS?.[key];
  if (!product) return;

  document.querySelectorAll("[data-product-name]").forEach(el => el.textContent = product.name);
  document.querySelectorAll("[data-product-badge]").forEach(el => el.textContent = product.badge);
  document.querySelectorAll("[data-product-subtitle]").forEach(el => el.textContent = product.subtitle);
  document.querySelectorAll("[data-product-desc]").forEach(el => el.textContent = product.desc);

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