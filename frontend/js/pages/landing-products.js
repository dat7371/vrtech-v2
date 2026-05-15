const PRODUCT_PAGE_BY_SLUG = {
  "tbox-s2a-v2": "pages/products/s2a.html",
  "tbox-s2p-v2": "pages/products/s2p.html",
  "tbox-plus-v2": "pages/products/plus.html",
  "tbox-ambient-v2": "pages/products/ambient.html",
  "tbox-ultra-max-v2": "pages/products/ultra.html",
};

const PRODUCT_LABEL_BY_SLUG = {
  "tbox-s2a-v2": "Ban tieu chuan",
  "tbox-s2p-v2": "Ban chay nhat",
  "tbox-plus-v2": "Nang cap hop ly",
  "tbox-ambient-v2": "Tham my cao cap",
  "tbox-ultra-max-v2": "Hieu nang manh nhat",
};

function getLandingApiBase() {
  return (window.VRTECH_API_BASE || window.location.origin).replace(/\/$/, "");
}

function normalizeProductAsset(path) {
  if (!path) {
    return "";
  }

  const value = String(path).replace(/\\/g, "/");
  if (/^(?:https?:)?\/\//.test(value) || value.startsWith("data:")) {
    return value;
  }

  return `/${value.replace(/^\/+/, "")}`;
}

function escapeLandingHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getProductHref(product) {
  return PRODUCT_PAGE_BY_SLUG[product.slug] || "#contact";
}

function getProductLabel(product) {
  return product.badge || PRODUCT_LABEL_BY_SLUG[product.slug] || product.category?.name || "San pham";
}

function renderLandingProductCard(product) {
  const image = normalizeProductAsset(product.main_image);
  const imageMarkup = image
    ? `<img src="${escapeLandingHtml(image)}" alt="${escapeLandingHtml(product.name)}" width="800" height="800" loading="lazy" decoding="async">`
    : `<span class="product-fallback-mark">VRTECH</span>`;

  return `
    <a class="product-card reveal" href="${escapeLandingHtml(getProductHref(product))}" data-product-slug="${escapeLandingHtml(product.slug)}">
      <div class="product-thumb">
        ${imageMarkup}
      </div>
      <span class="product-label">${escapeLandingHtml(getProductLabel(product))}</span>
      <h3>${escapeLandingHtml(product.name)}</h3>
      <p>${escapeLandingHtml(product.short_description || product.description || "")}</p>
    </a>
  `;
}

function renderLandingProducts(products) {
  const grid = document.querySelector("#products .product-grid");
  if (!grid || !Array.isArray(products) || !products.length) {
    return;
  }

  grid.innerHTML = products.map(renderLandingProductCard).join("");
}

function renderProductMenu(products) {
  const menu = document.getElementById("productsMenu");
  if (!menu || !Array.isArray(products) || !products.length) {
    return;
  }

  menu.innerHTML = products
    .map((product) => `<a href="${escapeLandingHtml(getProductHref(product))}">${escapeLandingHtml(product.name)}</a>`)
    .join("");
}

function renderProductInterestOptions(products) {
  const select = document.querySelector('select[name="product_interest"]');
  if (!(select instanceof HTMLSelectElement) || !Array.isArray(products) || !products.length) {
    return;
  }

  select.innerHTML = [
    `<option value="">Chon san pham</option>`,
    ...products.map((product) => `<option>${escapeLandingHtml(product.name)}</option>`),
  ].join("");
}

async function fetchLandingProducts() {
  const response = await fetch(`${getLandingApiBase()}/api/products`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Could not load products");
  }

  const json = await response.json();
  return Array.isArray(json.data) ? json.data : [];
}

async function syncLandingProductsFromBackend() {
  if (document.body.dataset.page !== "landing" || document.body.dataset.productsSynced === "true") {
    return;
  }

  document.body.dataset.productsSynced = "true";

  try {
    const products = await fetchLandingProducts();
    renderLandingProducts(products);
    renderProductMenu(products);
    renderProductInterestOptions(products);
    document.dispatchEvent(new Event("componentsLoaded"));
  } catch {
    document.body.dataset.productsSynced = "failed";
  }
}

document.addEventListener("DOMContentLoaded", syncLandingProductsFromBackend);
document.addEventListener("componentsLoaded", syncLandingProductsFromBackend);
