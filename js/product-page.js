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

function attachMenuListeners() {
  const nav = document.getElementById("mobileNav");
  
  // Handle anchor links on same page
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      const target = document.querySelector(id);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        nav?.classList.remove("open");
      }
    });
  });

  // Handle navigation links
  document.querySelectorAll('a[href*="index.html"], a[href*="pages/"]').forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
    });
  });
}

function fixProductPagePaths() {
  // Delay để ensure DOM sẵn sàng
  setTimeout(() => {
    // Fix header image paths
    const headerImg = document.querySelector('.logo-image img');
    if (headerImg) {
      headerImg.src = '../../images/vrtech-icon-lg.png';
    }

    // Fix logo link
    const logoLink = document.querySelector('.logo-image');
    if (logoLink) {
      logoLink.setAttribute('href', '../../index.html');
    }

    // Fix menu links - tính absolute path
    const menuLinks = document.querySelectorAll('.navbar a[href]');
    menuLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#hero' || href === '#nexus' || href === '#products' || href === '#official' || href === '#warranty' || href === '#contact') {
        // Anchor links thành full paths
        link.setAttribute('href', '../../index.html' + href);
      } else if (href === 'index.html#hero' || href === 'index.html#products' || href === 'index.html#official' || href === 'index.html#warranty' || href === 'index.html#contact') {
        // Đã có index.html, thêm ../../
        link.setAttribute('href', '../../' + href);
      } else if (href === 'pages/app-vrtech.html') {
        link.setAttribute('href', '../../pages/app-vrtech.html');
      }
    });

    // Re-attach menu listeners after paths are fixed
    attachMenuListeners();

    // Dispatch event after everything is fixed
    document.dispatchEvent(new Event("componentsLoaded"));

    console.log('✓ Product page paths fixed');
  }, 100);
}

async function loadProductPage() {
  await Promise.all([
    loadProductComponent("header", "../../components/header.html"),
    loadProductComponent("product-hero", "../../components/product-hero.html"),
    loadProductComponent("product-reasons", "../../components/product-reasons.html"),
    loadProductComponent("product-nexus", "../../components/product-nexus.html"),
    loadProductComponent("product-performance", "../../components/product-performance.html"),
    loadProductComponent("product-features", "../../components/product-features.html"),
    loadProductComponent("product-images", "../../components/product-images.html"),
    loadProductComponent("product-compare", "../../components/product-compare.html"),
    loadProductComponent("product-warranty", "../../components/product-warranty.html"),
    loadProductComponent("product-cta", "../../components/product-cta.html"),
    loadProductComponent("footer", "../../components/footer.html")
  ]);

  renderProductData();
  fixProductPagePaths(); // This will emit componentsLoaded after 100ms
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