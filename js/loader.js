function loadComponent(id, file) {
  return fetch(file)
    .then((res) => {
      if (!res.ok) throw new Error(`Không tải được ${file}`);
      return res.text();
    })
    .then((html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    })
    .catch((err) => console.error(err));
}

function fixComponentPaths() {
  // Detect if we're in a nested page (pages/products/)
  const isNestedPage = window.location.pathname.includes('/pages/products/');
  const basePath = isNestedPage ? '../../' : './';

  // Fix header image paths
  const headerImg = document.querySelector('.logo-image img');
  if (headerImg && headerImg.src.includes('images/')) {
    headerImg.src = basePath + 'images/vrtech-icon-lg.png';
  }

  // Fix menu links
  const menuLinks = document.querySelectorAll('.navbar a, .header-contact a[href^="index"], .logo-image[href="index.html"]');
  menuLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('index.html')) {
      link.setAttribute('href', basePath + href);
    } else if (href && href === 'pages/app-vrtech.html') {
      link.setAttribute('href', basePath + href);
    }
  });
}

async function loadAllComponents() {
  await Promise.all([
    loadComponent("header", "components/header.html"),
    loadComponent("hero", "components/hero.html"),
    loadComponent("problem", "components/problem.html"),
    loadComponent("solution", "components/solution.html"),
    loadComponent("nexus", "components/nexus.html"),
    loadComponent("products", "components/products.html"),
    loadComponent("compare", "components/compare.html"),
    loadComponent("experience", "components/experience.html"),
    loadComponent("official", "components/official.html"),
    loadComponent("vietmap", "components/vietmap.html"),
    loadComponent("warranty", "components/warranty.html"),
    loadComponent("cta", "components/cta.html"),
    loadComponent("footer", "components/footer.html"),
  ]);

  fixComponentPaths();
  document.dispatchEvent(new Event("componentsLoaded"));
}

loadAllComponents();