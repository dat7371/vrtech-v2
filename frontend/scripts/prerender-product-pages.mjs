import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

const productPages = {
  s2a: "pages/products/s2a.html",
  s2p: "pages/products/s2p.html",
  plus: "pages/products/plus.html",
  ambient: "pages/products/ambient.html",
  ultra: "pages/products/ultra.html",
  vietmap: "pages/products/vietmap.html",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function pageAsset(pathValue) {
  return pathValue ? `../../${String(pathValue).replace(/^\.?\//, "")}` : "";
}

function formatPhoneHref(phone) {
  return `tel:${String(phone || "").replace(/[^\d+]/g, "")}`;
}

function getArray(value) {
  return Array.isArray(value) ? value : [];
}

function getCompactProductName(product) {
  if (product?.short_name) {
    return product.short_name;
  }

  const fullName = product?.name || "";
  const afterBrand = fullName.includes("|") ? fullName.split("|")[1].trim() : fullName;
  return afterBrand.split(" - ")[0].trim();
}

function getTopBarTitle(product) {
  return product?.top_title || getCompactProductName(product);
}

function getProductDetailTitle(product) {
  return product?.detail_title || `Giới thiệu và đánh giá ${getCompactProductName(product)}`;
}

function getVariant(product, index = 0) {
  return getArray(product?.variants)[index] || getArray(product?.variants)[0] || null;
}

function getPrice(product, variant = null) {
  return variant?.price || product?.price || "";
}

function getCondition(product, variant = null) {
  return variant?.condition || product?.condition || "";
}

function getHeroGallery(product) {
  const extraGallery = getArray(product?.gallery_extra).map((item) => item.image).filter(Boolean);
  return [product.hero_image, ...getArray(product.gallery).slice(0, 5), ...extraGallery].filter(Boolean);
}

function renderVariantOptions(product) {
  const variants = getArray(product.variants);

  if (variants.length < 2) {
    return "";
  }

  return `
        <div class="product-variant-block" data-product-variant-block>
          <span class="product-variant-label">Cấu hình</span>
          <div class="product-variant-options" data-product-variant-options>
            ${variants.map((variant, index) => `
            <button
              type="button"
              class="product-variant-option${index === 0 ? " active" : ""}"
              data-product-variant-index="${index}"
              aria-pressed="${index === 0 ? "true" : "false"}"
            >
              <span>${escapeHtml(variant.label || `Cấu hình ${index + 1}`)}</span>
              <strong>${escapeHtml(variant.price || product.price || "")}</strong>
              ${variant.badge ? `<em>${escapeHtml(variant.badge)}</em>` : ""}
            </button>`).join("")}
          </div>
        </div>`;
}

function renderDetailBlocks(product) {
  const sections = getArray(product.detail_sections);

  if (sections.length) {
    return sections.map((section) => {
      const title = section?.title ? `<h3>${escapeHtml(section.title)}</h3>` : "";
      const paragraphs = getArray(section?.paragraphs).map((item) => `<p>${escapeHtml(item)}</p>`).join("");
      const bullets = getArray(section?.bullets).length
        ? `<ul class="product-detail-bullets">${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : "";
      const note = section?.note ? `<p class="product-detail-note">${escapeHtml(section.note)}</p>` : "";
      const image = section?.image?.src
        ? `<figure class="product-detail-figure product-detail-zoom-trigger" tabindex="0" role="button" aria-label="Phóng to ${escapeHtml(section.image.alt || section.title || "ảnh minh họa sản phẩm")}">
            <img
              src="${escapeHtml(pageAsset(section.image.src))}"
              alt="${escapeHtml(section.image.alt || section.title || "Hình minh họa sản phẩm")}"
              width="${escapeHtml(section.image.width || 1600)}"
              height="${escapeHtml(section.image.height || 1600)}"
              data-detail-lightbox-image
              loading="lazy"
              decoding="async"
            >
          </figure>`
        : "";

      return `<div class="product-detail-block">${title}${paragraphs}${bullets}${note}${image}</div>`;
    }).join("");
  }

  return [
    product?.desc ? `<div class="product-detail-block"><p>${escapeHtml(product.desc)}</p></div>` : "",
    getArray(product?.highlights).length
      ? `<div class="product-detail-block"><h3>Điểm nổi bật</h3><ul class="product-detail-bullets">${product.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>`
      : "",
    getArray(product?.reasons).length
      ? `<div class="product-detail-block"><h3>Lý do nên chọn</h3><ul class="product-detail-bullets">${product.reasons.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>`
      : "",
  ].join("");
}

function renderSpecSections(product) {
  const specSections = getArray(product.spec_sections);

  if (specSections.length) {
    return specSections.map((section) => `
      <section class="product-spec-section">
        <div class="product-spec-section-head">
          <span class="product-spec-dot" aria-hidden="true"></span>
          <h3>${escapeHtml(section.title)}</h3>
        </div>
        <div class="product-spec-table" role="table" aria-label="${escapeHtml(section.title)}">
          ${getArray(section.rows).map((row) => `
            <div class="product-spec-row" role="row">
              <div class="product-spec-key" role="rowheader">${escapeHtml(row.label)}</div>
              <div class="product-spec-data" role="cell">${escapeHtml(row.value)}</div>
            </div>`).join("")}
        </div>
      </section>`).join("");
  }

  return `<div class="product-spec-grid">${getArray(product.specs).map((item) => `
    <article class="product-spec-card">
      <span class="product-spec-label">${escapeHtml(item.label)}</span>
      <strong class="product-spec-value">${escapeHtml(item.value)}</strong>
    </article>`).join("")}</div>`;
}

function getAssuranceIconType(title) {
  const normalizedTitle = String(title || "").toLowerCase();

  if (normalizedTitle.includes("official") || normalizedTitle.includes("chính thức") || normalizedTitle.includes("viet nam") || normalizedTitle.includes("việt nam")) {
    return "official";
  }

  if (normalizedTitle.includes("cam kết") || normalizedTitle.includes("sản phẩm") || normalizedTitle.includes("san pham")) {
    return "product";
  }

  if (normalizedTitle.includes("bảo hành") || normalizedTitle.includes("bao hanh")) {
    return "warranty";
  }

  if (normalizedTitle.includes("kỹ thuật") || normalizedTitle.includes("ky thuat") || normalizedTitle.includes("hỗ trợ") || normalizedTitle.includes("ho tro")) {
    return "support";
  }

  if (normalizedTitle.includes("giao hàng") || normalizedTitle.includes("giao hang") || normalizedTitle.includes("vận chuyển") || normalizedTitle.includes("van chuyen")) {
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

function renderAssurances(product) {
  return getArray(product.assurances).map((item) => {
    const iconType = getAssuranceIconType(item.title);

    return `
        <article class="product-assurance-item reveal">
          <div class="product-assurance-icon" data-icon="${iconType}" aria-hidden="true">${getAssuranceIconSvg(iconType)}</div>
          <div class="product-assurance-copy">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.desc)}</p>
          </div>
        </article>`;
  }).join("");
}

function renderRelatedProducts(currentKey, products) {
  const keys = Object.keys(products).filter((key) => key !== currentKey).slice(0, 5);

  return keys.map((key) => {
    const product = products[key];
    const variant = getVariant(product);
    const oldPrice = product?.old_price ? `<span>${escapeHtml(product.old_price)}</span>` : "";

    return `
          <a class="product-related-card" href="${escapeHtml(`${key}.html`)}">
            <span class="product-related-media">
              <img src="${escapeHtml(pageAsset(product.hero_image))}" alt="${escapeHtml(getCompactProductName(product))}" width="800" height="800" loading="lazy" decoding="async">
            </span>
            <span class="product-related-copy">
              <span class="product-related-badge">${escapeHtml(product?.badge || product?.brand || "Sản phẩm liên quan")}</span>
              <strong>${escapeHtml(getCompactProductName(product))}</strong>
              <span class="product-related-price">
                <em>${escapeHtml(getPrice(product, variant) || "Liên hệ")}</em>
                ${oldPrice}
              </span>
            </span>
          </a>`;
  }).join("");
}

function renderProductHero(product) {
  const variant = getVariant(product);
  const gallery = getHeroGallery(product);

  return `<section class="product-hero">
  <div class="container">
    <div class="product-title-bar reveal show">
      <h1 class="product-page-title" data-product-name-full>${escapeHtml(getTopBarTitle(product))}</h1>
      <button type="button" class="product-compare-toggle" data-product-compare-toggle aria-expanded="false" aria-controls="productComparePanel">
        <span aria-hidden="true">⊕</span>
        <span>So sánh</span>
      </button>
    </div>

    <div class="product-compare-panel" id="productComparePanel" data-product-compare-panel hidden>
      <div class="product-compare-panel-head">
        <div>
          <p class="product-compare-eyebrow">So sánh nhanh</p>
          <h2>Đối chiếu với các phiên bản Carlinkit V2 khác</h2>
        </div>
        <div class="product-compare-controls">
          <label class="product-compare-select-wrap"><span>Chọn model</span><select data-product-compare-select aria-label="Chọn sản phẩm để so sánh"></select></label>
          <label class="product-compare-select-wrap" data-product-compare-current-variant-wrap hidden><span>Cấu hình đang xem</span><select data-product-compare-current-variant aria-label="Chọn cấu hình của sản phẩm đang xem"></select></label>
          <label class="product-compare-select-wrap" data-product-compare-target-variant-wrap hidden><span>Cấu hình so sánh</span><select data-product-compare-target-variant aria-label="Chọn cấu hình của sản phẩm so sánh"></select></label>
        </div>
      </div>
      <div class="product-compare-mini-grid" data-product-compare-results></div>
    </div>
  </div>

  <div class="container product-hero-layout">
    <div class="product-hero-media reveal show">
      <div class="product-hero-main">
        <button type="button" class="product-hero-nav product-hero-nav-prev" data-hero-prev aria-label="Xem ảnh trước"><span aria-hidden="true">‹</span></button>
        <button type="button" class="product-hero-frame product-hero-trigger" data-product-hero-trigger aria-label="Xem toàn màn hình ảnh sản phẩm">
          <img data-product-hero-image src="${escapeHtml(pageAsset(product.hero_image))}" alt="${escapeHtml(product.name)}" width="1600" height="1600" decoding="async" fetchpriority="high">
        </button>
        <button type="button" class="product-hero-nav product-hero-nav-next" data-hero-next aria-label="Xem ảnh tiếp theo"><span aria-hidden="true">›</span></button>
      </div>
      <div class="product-hero-thumbs" id="product-hero-thumbs">
        ${gallery.map((image, index) => `
        <button type="button" class="product-thumb-button${index === 0 ? " active" : ""}" data-hero-image="${escapeHtml(pageAsset(image))}" data-hero-alt="${escapeHtml(`${product.name} - góc nhìn ${index + 1}`)}" aria-label="Xem ảnh ${index + 1} của ${escapeHtml(product.name)}">
          <img src="${escapeHtml(pageAsset(image))}" alt="${escapeHtml(`${product.name} - thumbnail ${index + 1}`)}" width="800" height="800" loading="lazy" decoding="async">
        </button>`).join("")}
      </div>
    </div>

    <div class="product-hero-content reveal show">
      <div class="product-summary-card">
        <div class="product-meta-line">
          <span><strong>Tình trạng:</strong> <span data-product-stock>${escapeHtml(product.stock_status || "Đang cập nhật")}</span></span>
          <span><strong>Thương hiệu:</strong> <span data-product-brand>${escapeHtml(product.brand || "Carlinkit")}</span></span>
          <span><strong>Loại:</strong> <span data-product-category>${escapeHtml(product.category || "Android Box Ô Tô")}</span></span>
        </div>
        <h2 class="product-title-compact" data-product-name-compact>${escapeHtml(getCompactProductName(product))}</h2>
        <h3 class="product-subtitle" data-product-subtitle>${escapeHtml(product.subtitle || "")}</h3>
        <p class="product-desc" data-product-desc>${escapeHtml(product.desc || "")}</p>
        ${renderVariantOptions(product)}
        <div class="product-price-panel">
          <div class="product-price-row">
            <span class="product-old-price" data-product-old-price${product.old_price ? "" : " hidden"}>${escapeHtml(product.old_price || "")}</span>
            <strong class="product-current-price" data-product-price>${escapeHtml(getPrice(product, variant))}</strong>
            <span class="product-vat-note" data-product-vat>${escapeHtml(product.vat_label || "")}</span>
          </div>
          <p class="product-condition" data-product-condition>${escapeHtml(getCondition(product, variant))}</p>
          <div class="product-warranty-chip" data-product-warranty>${escapeHtml(product.warranty_label || "Bảo hành 12 tháng")}</div>
        </div>
        <div class="product-quantity-block">
          <span class="product-quantity-label">Số lượng</span>
          <div class="product-quantity-controls" aria-label="Điều chỉnh số lượng">
            <button type="button" class="quantity-button" data-quantity-decrease aria-label="Giảm số lượng">-</button>
            <input type="number" class="quantity-input" data-quantity-input value="1" min="1" inputmode="numeric" aria-label="Số lượng sản phẩm">
            <button type="button" class="quantity-button" data-quantity-increase aria-label="Tăng số lượng">+</button>
          </div>
        </div>
        <div class="product-cta-row">
          <a href="#contact" class="btn btn-primary product-buy-button" data-product-primary-cta>${escapeHtml(product.primary_cta || "MUA NGAY")}</a>
          <a href="tel:0334532635" class="btn btn-outline product-support-button" data-product-support-cta>${escapeHtml(product.support_cta || "GỌI TƯ VẤN")}</a>
        </div>
        <div class="product-promo-box" data-product-promo-box${product.promo ? "" : " hidden"}>
          <div class="product-promo-head">Ưu đãi hiện tại</div>
          <p class="product-promo-text" data-product-promo>${escapeHtml(product.promo || "")}</p>
        </div>
      </div>
    </div>

    <aside class="product-side-rail reveal show">
      <a class="product-hotline-box" data-product-hotline-link href="${escapeHtml(formatPhoneHref(product.support_phone || "033 453 2635"))}">
        <span class="product-hotline-head">
          <span class="product-hotline-label">Gọi ngay</span>
          <strong data-product-hotline>${escapeHtml(product.support_phone || "033 453 2635")}</strong>
        </span>
        <span class="product-hotline-note">để được tư vấn tốt nhất</span>
      </a>
      <div class="product-assurance-list" id="product-assurance-list">${renderAssurances(product)}</div>
    </aside>
  </div>
</section>`;
}

function renderProductSpecs(product) {
  return `<section class="product-specs">
  <div class="container product-detail-layout">
    <div class="product-detail-main reveal show">
      <div class="product-detail-shell">
        <p class="product-detail-label">Thông tin chi tiết</p>
        <h2 class="product-detail-title" data-product-detail-title>${escapeHtml(getProductDetailTitle(product))}</h2>
        <p class="product-detail-intro" data-product-detail-intro>${escapeHtml(product.detail_intro || product.subtitle || "Nội dung mô tả chi tiết sản phẩm và các điểm cần biết trước khi chọn.")}</p>
        <div class="product-detail-copy-wrap">
          <div class="product-detail-copy" data-product-detail-copy>${renderDetailBlocks(product)}</div>
        </div>
        <button type="button" class="product-detail-toggle" data-product-detail-toggle hidden aria-expanded="false">Xem thêm</button>
      </div>
    </div>
    <aside class="product-detail-side reveal show">
      <div class="product-detail-side-card">
        <h3 class="product-detail-side-title">Thông số kỹ thuật</h3>
        <div class="product-spec-list" id="product-spec-list">${renderSpecSections(product)}</div>
        <button type="button" class="product-spec-toggle" data-product-spec-toggle hidden aria-expanded="false">Xem chi tiết cấu hình</button>
      </div>
    </aside>
  </div>
</section>`;
}

function renderRelatedSection(currentKey, products) {
  return `<section class="product-related" data-product-related-section>
  <div class="container">
    <div class="product-related-shell reveal show">
      <div class="product-related-head">
        <div>
          <p class="product-detail-label">Gợi ý thêm</p>
          <h2>Sản phẩm liên quan</h2>
        </div>
        <div class="product-related-nav" aria-label="Điều hướng sản phẩm liên quan">
          <button class="product-related-arrow" type="button" data-product-related-prev aria-label="Sản phẩm trước"><span aria-hidden="true">‹</span></button>
          <button class="product-related-arrow" type="button" data-product-related-next aria-label="Sản phẩm tiếp theo"><span aria-hidden="true">›</span></button>
        </div>
      </div>
      <div class="product-related-grid" data-product-related-grid>${renderRelatedProducts(currentKey, products)}</div>
    </div>
  </div>
</section>`;
}

async function loadProducts() {
  const source = await readFile(path.join(projectRoot, "js/data/products-data.js"), "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "products-data.js" });
  return sandbox.window.PRODUCTS;
}

async function loadProductPageShellComponents() {
  const [header, footer] = await Promise.all([
    readFile(path.join(projectRoot, "components/shared/header.html"), "utf8"),
    readFile(path.join(projectRoot, "components/shared/footer.html"), "utf8"),
  ]);

  const rewriteForProductPage = (source) => source
    .trim()
    .replaceAll('href="index.html', 'href="../../index.html')
    .replaceAll('href="pages/', 'href="../../pages/')
    .replaceAll('src="images/', 'src="../../images/');

  return {
    header: rewriteForProductPage(header),
    footer: rewriteForProductPage(footer),
  };
}

async function updateProductPage(productKey, product, products, shellComponents) {
  const pagePath = path.join(projectRoot, productPages[productKey]);
  const html = await readFile(pagePath, "utf8");
  const main = `<main id="main-content">
    ${renderProductHero(product)}
    ${renderProductSpecs(product)}
    ${renderRelatedSection(productKey, products)}
    <section class="product-cta" id="contact">
      <div class="container narrow center reveal show">
        <h2 class="section-title">Chọn đúng phiên bản cho xe của bạn ngay hôm nay</h2>
        <p class="section-desc" style="margin-bottom: 32px;">Tư vấn theo dòng xe, giao hàng toàn quốc và hướng dẫn lắp đặt đơn giản.</p>
        <div class="product-cta-actions">
          <a href="#contact" class="btn btn-primary">MUA NGAY</a>
          <a href="#contact" class="btn btn-outline">LIÊN HỆ TƯ VẤN</a>
        </div>
        <div class="contact-details">
          <a href="tel:0334532635" class="contact-detail-pill">Hotline: 033 453 2635</a>
          <a href="mailto:support@vrtech.vn" class="contact-detail-pill">Email: support@vrtech.vn</a>
        </div>
      </div>
    </section>
  </main>`;

  const mainPattern = /<main id="main-content">[\s\S]*?<\/main>/;

  if (!mainPattern.test(html)) {
    throw new Error(`Could not replace main content in ${productPages[productKey]}`);
  }

  const updated = html
    .replace(/<div id="header"><\/div>|<header class="site-header">[\s\S]*?<\/header>/, shellComponents.header)
    .replace(mainPattern, main)
    .replace(/<div id="footer"><\/div>|<footer class="site-footer">[\s\S]*?<\/footer>/, shellComponents.footer);

  await writeFile(pagePath, updated, "utf8");
}

const products = await loadProducts();
const shellComponents = await loadProductPageShellComponents();

await Promise.all(
  Object.entries(productPages).map(([productKey]) => {
    const product = products?.[productKey];

    if (!product) {
      throw new Error(`Missing product data for ${productKey}`);
    }

    return updateProductPage(productKey, product, products, shellComponents);
  })
);

console.log(`Product pages prerendered: ${Object.keys(productPages).join(", ")}`);
