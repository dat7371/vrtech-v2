const PRODUCT_PAGE_COMPONENTS = [
  ["header", "header"],
  ["product-hero", "product-hero"],
  ["product-specs", "product-specs"],
  ["product-related", "product-related"],
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

function updateProductSeo(product) {
  if (!product) {
    return;
  }

  const pageTitle = product.page_title || `${getCompactProductName(product)} | VRTECH`;
  const metaDescription = product.meta_description || product.desc || "";
  const canonicalHref = window.location.href;

  document.title = pageTitle;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta instanceof HTMLMetaElement) {
    descriptionMeta.setAttribute("content", metaDescription);
  }

  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink instanceof HTMLLinkElement) {
    canonicalLink.setAttribute("href", canonicalHref);
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getArray(value) {
  return Array.isArray(value) ? value : [];
}

function getProductVariant(product, variantIndex = 0) {
  const variants = getArray(product?.variants);
  return variants[variantIndex] || variants[0] || null;
}

function normalizeVariantIndex(product, variantIndex = 0) {
  const variants = getArray(product?.variants);
  const parsedIndex = Number.parseInt(String(variantIndex), 10);
  const safeIndex = Number.isNaN(parsedIndex) ? 0 : parsedIndex;

  if (!variants.length) {
    return 0;
  }

  return Math.min(Math.max(safeIndex, 0), variants.length - 1);
}

function getProductPrice(product, variant = null) {
  return variant?.price || product?.price || "";
}

function getProductCondition(product, variant = null) {
  return variant?.condition || product?.condition || "";
}

function getVariantLabel(product, variant = null, variantIndex = 0) {
  if (variant?.label) {
    return variant.label;
  }

  if (getArray(product?.variants).length) {
    return `Cấu hình ${variantIndex + 1}`;
  }

  return product?.badge || "Cấu hình tiêu chuẩn";
}

function getVariantOptionLabel(product, variant = null, variantIndex = 0) {
  const label = getVariantLabel(product, variant, variantIndex);
  const price = getProductPrice(product, variant);

  return price ? `${label} - ${price}` : label;
}

function getVariantSpecValue(variant = null, specName = "") {
  const directValue = variant?.[String(specName).toLowerCase()];

  if (directValue) {
    return directValue;
  }

  const match = String(variant?.label || "").match(new RegExp(`${specName}\\s*([^/]+)`, "i"));
  return match?.[1]?.trim() || "";
}

function parsePriceValue(price) {
  const numericValue = Number.parseInt(String(price || "").replace(/[^\d]/g, ""), 10);
  return Number.isNaN(numericValue) ? 0 : numericValue;
}

function formatPriceValue(value) {
  return new Intl.NumberFormat("vi-VN").format(value);
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
  if (Array.isArray(product?.detail_sections) && product.detail_sections.length) {
    return product.detail_sections.map((section) => {
      const title = section?.title ? `<h3>${escapeHtml(section.title)}</h3>` : "";
      const paragraphs = Array.isArray(section?.paragraphs)
        ? section.paragraphs.map((item) => `<p>${escapeHtml(item)}</p>`).join("")
        : "";
      const bullets = Array.isArray(section?.bullets) && section.bullets.length
        ? `
        <ul class="product-detail-bullets">
          ${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      `
        : "";
      const note = section?.note ? `<p class="product-detail-note">${escapeHtml(section.note)}</p>` : "";
      const image = section?.image?.src
        ? `
        <figure
          class="product-detail-figure product-detail-zoom-trigger"
          tabindex="0"
          role="button"
          aria-label="Phóng to ${escapeHtml(section.image.alt || section.title || "ảnh minh họa sản phẩm")}"
        >
          <img
            src="${escapeHtml(window.VRTECH_ASSETS?.asset?.(section.image.src) || section.image.src)}"
            alt="${escapeHtml(section.image.alt || section.title || "Hình minh họa sản phẩm")}"
            width="${escapeHtml(section.image.width || 1600)}"
            height="${escapeHtml(section.image.height || 1600)}"
            data-detail-lightbox-image
            loading="lazy"
          >
        </figure>
      `
        : "";

      return `
        <div class="product-detail-block">
          ${title}
          ${paragraphs}
          ${bullets}
          ${note}
          ${image}
        </div>
      `;
    }).join("");
  }

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

function getCompareDetailSections(product, summary) {
  const specSections = getArray(product?.spec_sections);
  const topRows = [
    { label: "Cấu hình", value: summary.variantLabel || "Cấu hình tiêu chuẩn" },
    { label: "Giá", value: summary.price },
    { label: "Tình trạng", value: summary.condition },
    { label: "Phân khúc", value: summary.segment },
    { label: "Loại", value: summary.category },
    { label: "Kết nối", value: summary.connection },
    { label: "Hậu mãi", value: summary.aftersales },
  ].filter((row) => row.value);

  const detailSections = [
    {
      title: "Cấu hình đang chọn",
      rows: topRows,
    },
  ];

  if (specSections.length) {
    specSections.forEach((section) => {
      const rows = getArray(section?.rows).filter((row) => row?.label && row?.value);

      if (section?.title && rows.length) {
        detailSections.push({
          title: section.title,
          rows,
        });
      }
    });

    return detailSections;
  }

  const fallbackRows = getArray(product?.specs).filter((row) => row?.label && row?.value);
  if (fallbackRows.length) {
    detailSections.push({
      title: "Thông số chính",
      rows: fallbackRows,
    });
  }

  return detailSections;
}

function getCompareSectionTitle(title) {
  const normalizedTitle = String(title || "").toLowerCase();

  if (normalizedTitle.includes("cấu hình")) return "Cấu hình đang chọn";
  if (normalizedTitle.includes("model") || normalizedTitle.includes("thông tin chung")) return "Model sản phẩm";
  if (normalizedTitle.includes("vi xử lý") || normalizedTitle.includes("bộ xử lý")) return "Bộ vi xử lý (CPU)";
  if (normalizedTitle.includes("gpu") || normalizedTitle.includes("đồ họa")) return "Chip xử lý đồ họa";
  if (normalizedTitle.includes("bộ nhớ") || normalizedTitle.includes("lưu trữ")) return "Bộ nhớ và lưu trữ";
  if (normalizedTitle.includes("hệ điều hành")) return "Hệ điều hành";
  if (normalizedTitle.includes("cổng")) return "Cổng kết nối";
  if (normalizedTitle.includes("kết nối")) return "Chuẩn kết nối";
  if (normalizedTitle.includes("thiết kế") || normalizedTitle.includes("nguồn")) return "Thiết kế và nguồn";
  if (normalizedTitle.includes("tính năng")) return "Tính năng";
  if (normalizedTitle.includes("vrtech") || normalizedTitle.includes("phần mềm") || normalizedTitle.includes("chính sách")) return "VRTECH và chính sách";

  return title || "Thông tin khác";
}

function getCompareRowValue(summary, sectionTitle, rowLabel) {
  const matchedSection = getArray(summary?.detailSections).find(
    (section) => getCompareSectionTitle(section.title) === sectionTitle
  );
  const matchedRow = getArray(matchedSection?.rows).find((row) => row.label === rowLabel);

  return matchedRow?.value || "";
}

function buildCompareTableSections(currentSummary, targetSummary) {
  const sectionMap = new Map();

  [currentSummary, targetSummary].forEach((summary) => {
    getArray(summary?.detailSections).forEach((section) => {
      const sectionTitle = getCompareSectionTitle(section.title);
      const existing = sectionMap.get(sectionTitle) || new Set();

      getArray(section.rows).forEach((row) => {
        if (row?.label) {
          existing.add(row.label);
        }
      });

      sectionMap.set(sectionTitle, existing);
    });
  });

  return Array.from(sectionMap, ([title, labels]) => ({
    title,
    rows: Array.from(labels, (label) => ({
      label,
      current: getCompareRowValue(currentSummary, title, label),
      target: getCompareRowValue(targetSummary, title, label),
    })).filter((row) => row.current && row.target),
  })).filter((section) => section.rows.length);
}

function getCompareSummary(product, variant = null) {
  const specs = Array.isArray(product?.specs) ? product.specs : [];
  const specSections = Array.isArray(product?.spec_sections) ? product.spec_sections : [];
  const variants = getArray(product?.variants);
  const variantIndex = normalizeVariantIndex(product, variants.indexOf(variant));
  const activeVariant = variant || getProductVariant(product, variantIndex);
  const ramValue = getVariantSpecValue(activeVariant, "RAM");
  const romValue = getVariantSpecValue(activeVariant, "ROM");
  const getSpecValue = (label) => specs.find((item) => item.label === label)?.value || "";
  const getSectionRowValue = (sectionTitles, rowLabels) => {
    const titles = Array.isArray(sectionTitles) ? sectionTitles : [sectionTitles];
    const labels = Array.isArray(rowLabels) ? rowLabels : [rowLabels];

    for (const title of titles) {
      const section = specSections.find((item) => item?.title === title);
      const rows = Array.isArray(section?.rows) ? section.rows : [];

      for (const label of labels) {
        const matched = rows.find((row) => row.label === label);
        if (matched?.value) {
          return matched.value;
        }
      }
    }

    return "";
  };

  const compareSpecs = [
    {
      label: "Chip",
      value: getSpecValue("Chip xử lý") || getSectionRowValue(["Bộ xử lý", "Bộ vi xử lý (CPU)"], ["Chipset", "Model"]) || "Đang cập nhật"
    },
    {
      label: "CPU",
      value: getSectionRowValue(["Bộ xử lý", "Bộ vi xử lý (CPU)"], ["Kiến trúc CPU", "Kiến trúc", "Số nhân"]) || "Đang cập nhật"
    },
    {
      label: "GPU",
      value: getSectionRowValue(["Bộ xử lý", "Bộ vi xử lý (CPU)"], ["GPU", "Đồ họa (GPU)"]) || "Đang cập nhật"
    },
    {
      label: "RAM",
      value: getSectionRowValue(["Bộ nhớ và lưu trữ", "Bộ nhớ máy (RAM)"], ["RAM tùy chọn", "Dung lượng"]) || "Đang cập nhật"
    },
    {
      label: "ROM",
      value: getSectionRowValue(["Bộ nhớ và lưu trữ", "Bộ nhớ lưu trữ (ROM)"], ["ROM tùy chọn", "Dung lượng"]) || "Đang cập nhật"
    },
    {
      label: "Hệ điều hành",
      value: getSectionRowValue(["Hệ điều hành và nền tảng", "Hệ điều hành"], ["Hệ điều hành", "Phiên bản"]) || "Đang cập nhật"
    },
    {
      label: "SIM / Mạng",
      value: getSectionRowValue(["Kết nối không dây", "Kết nối"], ["Mạng di động", "SIM", "Khe SIM"]) || "Đang cập nhật"
    },
    {
      label: "Wi-Fi",
      value: getSectionRowValue(["Kết nối không dây", "Kết nối"], ["Wi-Fi", "WiFi"]) || "Đang cập nhật"
    },
    {
      label: "Bluetooth",
      value: getSectionRowValue(["Kết nối không dây", "Kết nối"], ["Bluetooth"]) || "Đang cập nhật"
    }
  ].map((item) => {
    if (item.label === "RAM" && ramValue) {
      return { ...item, value: ramValue };
    }

    if (item.label === "ROM" && romValue) {
      return { ...item, value: romValue };
    }

    return item;
  });

  const summary = {
    compactName: getCompactProductName(product),
    image: window.VRTECH_ASSETS?.asset?.(product?.hero_image) || product?.hero_image || "",
    variantLabel: activeVariant ? getVariantLabel(product, activeVariant, variantIndex) : "",
    price: getProductPrice(product, activeVariant) || "Liên hệ",
    condition: getProductCondition(product, activeVariant),
    category: product?.category || "Android Box O To",
    segment: getSpecValue("Phân khúc") || getSpecValue("Phan khuc") || product?.badge || "",
    connection: getSpecValue("Kết nối") || getSpecValue("Ket noi") || "Wi-Fi / Bluetooth",
    aftersales: getSpecValue("Hậu mãi") || getSpecValue("Hau mai") || product?.warranty_label || "",
    compareSpecs,
  };

  return {
    ...summary,
    detailSections: getCompareDetailSections(product, summary),
  };
}

function getProductPagePath(productKey) {
  return `../../pages/products/${productKey}.html`;
}

function getRelatedProductKeys(currentKey, products) {
  const currentProduct = products?.[currentKey];
  const currentGroup = currentProduct?.compare_group || "carlinkit-v2";
  const keys = Object.keys(products || {}).filter((key) => key !== currentKey);
  const sameGroupKeys = keys.filter((key) => (products[key]?.compare_group || "carlinkit-v2") === currentGroup);
  const otherGroupKeys = keys.filter((key) => !sameGroupKeys.includes(key));

  return [...sameGroupKeys, ...otherGroupKeys];
}

function updateRelatedCarouselState(grid, prevButton, nextButton) {
  if (!(grid instanceof HTMLElement)) {
    return;
  }

  const maxScrollLeft = Math.max(0, grid.scrollWidth - grid.clientWidth - 1);
  const hasOverflow = maxScrollLeft > 0;

  if (prevButton instanceof HTMLButtonElement) {
    prevButton.disabled = !hasOverflow || grid.scrollLeft <= 1;
  }

  if (nextButton instanceof HTMLButtonElement) {
    nextButton.disabled = !hasOverflow || grid.scrollLeft >= maxScrollLeft;
  }
}

function setupRelatedCarousel() {
  const grid = document.querySelector("[data-product-related-grid]");
  const prevButton = document.querySelector("[data-product-related-prev]");
  const nextButton = document.querySelector("[data-product-related-next]");

  if (!(grid instanceof HTMLElement)) {
    return;
  }

  const getScrollAmount = () => {
    const firstCard = grid.querySelector(".product-related-card");
    return firstCard instanceof HTMLElement
      ? firstCard.getBoundingClientRect().width + 14
      : Math.round(grid.clientWidth * 0.8);
  };

  const scrollRelated = (direction) => {
    grid.scrollBy({
      left: direction * getScrollAmount(),
      behavior: "smooth",
    });
  };

  if (prevButton instanceof HTMLButtonElement) {
    prevButton.onclick = () => scrollRelated(-1);
  }

  if (nextButton instanceof HTMLButtonElement) {
    nextButton.onclick = () => scrollRelated(1);
  }

  grid.onscroll = () => updateRelatedCarouselState(grid, prevButton, nextButton);
  window.addEventListener("resize", () => updateRelatedCarouselState(grid, prevButton, nextButton));
  window.requestAnimationFrame(() => updateRelatedCarouselState(grid, prevButton, nextButton));
}

function renderRelatedProducts(currentKey) {
  const section = document.querySelector("[data-product-related-section]");
  const grid = document.querySelector("[data-product-related-grid]");
  const products = window.PRODUCTS || {};
  const relatedKeys = getRelatedProductKeys(currentKey, products);

  if (!(section instanceof HTMLElement) || !(grid instanceof HTMLElement) || !relatedKeys.length) {
    return;
  }

  grid.innerHTML = relatedKeys.map((key) => {
    const product = products[key];
    const variant = getProductVariant(product);
    const image = window.VRTECH_ASSETS?.asset?.(product?.hero_image) || product?.hero_image || "";
    const price = getProductPrice(product, variant) || "Liên hệ";
    const oldPrice = product?.old_price ? `<span>${escapeHtml(product.old_price)}</span>` : "";

    return `
      <a class="product-related-card" href="${escapeHtml(getProductPagePath(key))}">
        <span class="product-related-media">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(getCompactProductName(product))}" width="800" height="800" loading="lazy">
        </span>
        <span class="product-related-copy">
          <span class="product-related-badge">${escapeHtml(product?.badge || product?.brand || "Sản phẩm liên quan")}</span>
          <strong>${escapeHtml(getCompactProductName(product))}</strong>
          <span class="product-related-price">
            <em>${escapeHtml(price)}</em>
            ${oldPrice}
          </span>
        </span>
      </a>
    `;
  }).join("");

  section.hidden = false;
  setupRelatedCarousel();
}

function fixProductPagePaths() {
  const logoLink = document.querySelector(".logo-image");
  if (logoLink) {
    logoLink.setAttribute("href", "../../index.html");
  }

  document.querySelectorAll(".site-header a[href], .site-footer a[href]").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) {
      return;
    }

    if (href.startsWith("index.html")) {
      link.setAttribute("href", `../../${href}`);
      return;
    }

    if (href.startsWith("pages/")) {
      link.setAttribute("href", `../../${href}`);
    }
  });
}

function initializeProductCompare(currentKey) {
  const toggle = document.querySelector("[data-product-compare-toggle]");
  const panel = document.querySelector("[data-product-compare-panel]");
  const modelSelect = document.querySelector("[data-product-compare-select]");
  const currentVariantSelect = document.querySelector("[data-product-compare-current-variant]");
  const targetVariantSelect = document.querySelector("[data-product-compare-target-variant]");
  const currentVariantWrap = document.querySelector("[data-product-compare-current-variant-wrap]");
  const targetVariantWrap = document.querySelector("[data-product-compare-target-variant-wrap]");
  const results = document.querySelector("[data-product-compare-results]");
  const products = window.PRODUCTS || {};
  const currentProduct = products[currentKey];
  const currentCompareGroup = currentProduct?.compare_group || "carlinkit-v2";
  const compareKeys = Object.keys(products).filter((key) => {
    const compareProduct = products[key];
    const compareGroup = compareProduct?.compare_group || "carlinkit-v2";

    return key !== currentKey && compareGroup === currentCompareGroup;
  });

  if (!(toggle instanceof HTMLElement) || !(panel instanceof HTMLElement) || !(modelSelect instanceof HTMLSelectElement) || !(results instanceof HTMLElement)) {
    return;
  }

  if (toggle.dataset.compareReady === "true") {
    return;
  }

  toggle.dataset.compareReady = "true";

  if (!compareKeys.length) {
    toggle.hidden = true;
    panel.hidden = true;
    return;
  }

  let currentVariantIndex = 0;
  let targetVariantIndex = 0;

  const populateVariantSelect = (variantSelect, variantWrap, product, selectedIndex) => {
    if (!(variantSelect instanceof HTMLSelectElement) || !(variantWrap instanceof HTMLElement)) {
      return;
    }

    const variants = getArray(product?.variants);
    const options = variants.length ? variants : [null];
    const safeIndex = normalizeVariantIndex(product, selectedIndex);

    variantWrap.hidden = variants.length < 2;
    variantSelect.disabled = variants.length < 2;
    variantSelect.innerHTML = options.map((variant, index) => `
      <option value="${index}">${escapeHtml(getVariantOptionLabel(product, variant, index))}</option>
    `).join("");
    variantSelect.value = String(safeIndex);
  };

  const renderCompare = (targetKey) => {
    const currentProduct = products[currentKey];
    const targetProduct = products[targetKey];

    if (!currentProduct || !targetProduct) {
      return;
    }

    currentVariantIndex = normalizeVariantIndex(currentProduct, currentVariantIndex);
    targetVariantIndex = normalizeVariantIndex(targetProduct, targetVariantIndex);

    populateVariantSelect(currentVariantSelect, currentVariantWrap, currentProduct, currentVariantIndex);
    populateVariantSelect(targetVariantSelect, targetVariantWrap, targetProduct, targetVariantIndex);

    const currentSummary = getCompareSummary(currentProduct, getProductVariant(currentProduct, currentVariantIndex));
    const targetSummary = getCompareSummary(targetProduct, getProductVariant(targetProduct, targetVariantIndex));
    const tableSections = buildCompareTableSections(currentSummary, targetSummary);

    const productCards = [
      { summary: currentSummary, key: currentKey, tag: "Bạn đang xem" },
      { summary: targetSummary, key: targetKey, tag: "Model đang so sánh" },
    ].map(({ summary, key, tag }) => `
      <article class="product-compare-product-card">
        <span class="product-compare-mini-tag">${escapeHtml(tag)}</span>
        <a class="product-compare-image-frame" href="${escapeHtml(getProductPagePath(key))}">
          <img src="${escapeHtml(summary.image)}" alt="${escapeHtml(summary.compactName)}" width="4000" height="4000" loading="eager" decoding="async">
        </a>
        <h3>${escapeHtml(summary.compactName)}</h3>
        <p>${escapeHtml(summary.variantLabel || "Cấu hình tiêu chuẩn")}</p>
        <div class="product-compare-card-meta">
          <span><strong>Loại:</strong> ${escapeHtml(summary.category)}</span>
          <span><strong>Giá:</strong> ${escapeHtml(summary.price)}</span>
        </div>
      </article>
    `).join("");

    results.innerHTML = `
      <div class="product-compare-board">
        <div class="product-compare-product-grid">
          ${productCards}
        </div>
        <div class="product-compare-table" role="table" aria-label="Bảng so sánh sản phẩm">
          ${tableSections.map((section) => `
            <section class="product-compare-table-section">
              <h4>${escapeHtml(section.title)}</h4>
              ${section.rows.map((row) => `
                <div class="product-compare-table-row" role="row">
                  <div class="product-compare-table-label" role="rowheader">${escapeHtml(row.label)}</div>
                  <div role="cell">${escapeHtml(row.current)}</div>
                  <div role="cell">${escapeHtml(row.target)}</div>
                </div>
              `).join("")}
            </section>
          `).join("")}
        </div>
      </div>
    `;
  };

  modelSelect.innerHTML = compareKeys.map((key) => `
    <option value="${escapeHtml(key)}">${escapeHtml(getCompactProductName(products[key]))}</option>
  `).join("");
  renderCompare(compareKeys[0]);
  panel.hidden = true;
  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", () => {
    const isHidden = panel.hidden;
    panel.hidden = !isHidden;
    toggle.setAttribute("aria-expanded", String(isHidden));
  });

  modelSelect.addEventListener("change", () => {
    targetVariantIndex = 0;
    renderCompare(modelSelect.value);
  });

  if (currentVariantSelect instanceof HTMLSelectElement) {
    currentVariantSelect.addEventListener("change", () => {
      currentVariantIndex = normalizeVariantIndex(products[currentKey], currentVariantSelect.value);
      renderCompare(modelSelect.value);
    });
  }

  if (targetVariantSelect instanceof HTMLSelectElement) {
    targetVariantSelect.addEventListener("change", () => {
      targetVariantIndex = normalizeVariantIndex(products[modelSelect.value], targetVariantSelect.value);
      renderCompare(modelSelect.value);
    });
  }
}

function loadProductPage() {
  window.VRTECH_COMPONENTS?.injectComponents?.(PRODUCT_PAGE_COMPONENTS);

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

  const heroTrigger = document.querySelector("[data-product-hero-trigger]");
  const heroImage = document.querySelector("[data-product-hero-image]");
  const heroThumbs = document.getElementById("product-hero-thumbs");

  if (!heroTrigger) {
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

  const collectDetailItems = () =>
    Array.from(document.querySelectorAll("[data-detail-lightbox-image]")).map((image, index) => ({
      src: isImageElement(image) ? image.currentSrc || image.src : image.getAttribute("src") || "",
      alt: isImageElement(image) ? image.alt || `Ảnh chi tiết sản phẩm ${index + 1}` : `Ảnh chi tiết sản phẩm ${index + 1}`,
      element: image,
    })).filter((item) => item.src);

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

  document.addEventListener("click", (event) => {
    const trigger = event.target instanceof HTMLElement ? event.target.closest(".product-detail-zoom-trigger") : null;

    if (!(trigger instanceof HTMLElement)) {
      return;
    }

    const image = trigger.querySelector("[data-detail-lightbox-image]");
    const items = collectDetailItems();
    const startIndex = items.findIndex((item) => item.element === image);
    openLightbox(items.map(({ src, alt }) => ({ src, alt })), startIndex >= 0 ? startIndex : 0);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const trigger = event.target instanceof HTMLElement ? event.target.closest(".product-detail-zoom-trigger") : null;

    if (!(trigger instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    trigger.click();
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

  updateProductSeo(product);
  let selectedVariant = getProductVariant(product);
  let selectedQuantity = 1;
  const updateDisplayedPrice = () => {
    const unitPrice = getProductPrice(product, selectedVariant);
    const unitPriceValue = parsePriceValue(unitPrice);
    const totalPrice = unitPriceValue > 0 ? formatPriceValue(unitPriceValue * selectedQuantity) : unitPrice;

    document.querySelectorAll("[data-product-price]").forEach(el => el.textContent = totalPrice);
  };

  document.querySelectorAll("[data-product-name]").forEach(el => el.textContent = product.name);
  document.querySelectorAll("[data-product-name-full]").forEach(el => el.textContent = getTopBarTitle(product));
  document.querySelectorAll("[data-product-name-compact]").forEach(el => el.textContent = getCompactProductName(product));
  document.querySelectorAll("[data-product-detail-title]").forEach(el => el.textContent = getProductDetailTitle(product));
  document.querySelectorAll("[data-product-detail-intro]").forEach((el) => {
    el.textContent = product.detail_intro || product.subtitle || "Nội dung mô tả chi tiết sản phẩm và các điểm cần biết trước khi chọn.";
  });
  document.querySelectorAll("[data-product-detail-copy]").forEach((el) => {
    el.innerHTML = buildProductDetailBlocks(product);
  });

  const detailCopy = document.querySelector("[data-product-detail-copy]");
  const detailCopyWrap = detailCopy?.closest(".product-detail-copy-wrap");
  const detailToggle = document.querySelector("[data-product-detail-toggle]");

  if (detailCopy instanceof HTMLElement && detailCopyWrap instanceof HTMLElement && detailToggle instanceof HTMLButtonElement) {
    const fullDetailHeight = detailCopy.scrollHeight;
    const collapsedDetailHeight = window.innerWidth <= 768 ? 300 : 420;
    const shouldCollapseDetail = fullDetailHeight > collapsedDetailHeight + 80;

    detailCopyWrap.style.setProperty("--product-detail-collapsed-height", `${collapsedDetailHeight}px`);
    detailCopyWrap.classList.toggle("is-collapsed", shouldCollapseDetail);
    detailToggle.hidden = !shouldCollapseDetail;
    detailToggle.setAttribute("aria-expanded", shouldCollapseDetail ? "false" : "true");
    detailToggle.textContent = shouldCollapseDetail ? "Xem thêm" : "Thu gọn";
    detailToggle.onclick = shouldCollapseDetail
      ? () => {
          const isCollapsed = detailCopyWrap.classList.toggle("is-collapsed");
          detailToggle.setAttribute("aria-expanded", String(!isCollapsed));
          detailToggle.textContent = isCollapsed ? "Xem thêm" : "Thu gọn";
        }
      : null;
  }
  document.querySelectorAll("[data-product-badge]").forEach(el => el.textContent = product.badge);
  document.querySelectorAll("[data-product-subtitle]").forEach(el => el.textContent = product.subtitle);
  document.querySelectorAll("[data-product-desc]").forEach(el => el.textContent = product.desc);
  document.querySelectorAll("[data-product-stock]").forEach(el => el.textContent = product.stock_status || "Con hang");
  document.querySelectorAll("[data-product-brand]").forEach(el => el.textContent = product.brand || "Carlinkit");
  document.querySelectorAll("[data-product-category]").forEach(el => el.textContent = product.category || "Android Box O To");
  document.querySelectorAll("[data-product-condition]").forEach(el => el.textContent = getProductCondition(product, selectedVariant));
  document.querySelectorAll("[data-product-warranty]").forEach(el => el.textContent = product.warranty_label || "Bao hanh 12 thang");
  updateDisplayedPrice();
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

  const variantBlock = document.querySelector("[data-product-variant-block]");
  const variantOptions = document.querySelector("[data-product-variant-options]");
  const variants = getArray(product.variants);

  if (variantBlock instanceof HTMLElement && variantOptions instanceof HTMLElement) {
    variantBlock.hidden = variants.length < 2;
    variantOptions.innerHTML = variants.map((variant, index) => `
      <button
        type="button"
        class="product-variant-option${index === 0 ? " active" : ""}"
        data-product-variant-index="${index}"
        aria-pressed="${index === 0 ? "true" : "false"}"
      >
        <span>${escapeHtml(variant.label || `Cấu hình ${index + 1}`)}</span>
        <strong>${escapeHtml(variant.price || product.price || "")}</strong>
        ${variant.badge ? `<em>${escapeHtml(variant.badge)}</em>` : ""}
      </button>
    `).join("");

    variantOptions.addEventListener("click", (event) => {
      const option = event.target instanceof HTMLElement ? event.target.closest("[data-product-variant-index]") : null;

      if (!(option instanceof HTMLElement)) {
        return;
      }

      const variantIndex = Number.parseInt(option.getAttribute("data-product-variant-index") || "0", 10);
      selectedVariant = getProductVariant(product, Number.isNaN(variantIndex) ? 0 : variantIndex);

      variantOptions.querySelectorAll("[data-product-variant-index]").forEach((item) => {
        const isActive = item === option;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      updateDisplayedPrice();
      document.querySelectorAll("[data-product-condition]").forEach(el => el.textContent = getProductCondition(product, selectedVariant));
    });
  }

  const quantityInput = document.querySelector("[data-quantity-input]");
  const decreaseButton = document.querySelector("[data-quantity-decrease]");
  const increaseButton = document.querySelector("[data-quantity-increase]");

  if (quantityInput instanceof HTMLInputElement && decreaseButton instanceof HTMLElement && increaseButton instanceof HTMLElement) {
    const syncQuantity = (nextValue) => {
      const parsed = Number.parseInt(String(nextValue), 10);
      selectedQuantity = Math.max(Number.isNaN(parsed) ? 1 : parsed, 1);
      quantityInput.value = String(selectedQuantity);
      updateDisplayedPrice();
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
      <section class="product-spec-section">
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
      const fullSpecHeight = specWrap.scrollHeight;
      const isCompactSpecViewport = window.innerWidth <= 768;
      const specHeightMin = isCompactSpecViewport ? 220 : 320;
      const specViewportMax = window.innerHeight - (isCompactSpecViewport ? 330 : 300);
      const specHeightMax = Math.max(
        specHeightMin,
        Math.min(isCompactSpecViewport ? 360 : 520, specViewportMax)
      );
      const collapsedSpecHeight = Math.min(
        Math.max(Math.round(fullSpecHeight / 3), specHeightMin),
        specHeightMax
      );
      const shouldCollapse = fullSpecHeight > collapsedSpecHeight + 80;

      specWrap.style.setProperty("--product-spec-collapsed-height", `${collapsedSpecHeight}px`);
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
          <article class="product-spec-card">
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
  renderRelatedProducts(key);
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

if (document.body.dataset.product) {
  loadProductPage();
}
