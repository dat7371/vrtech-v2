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

  document.dispatchEvent(new Event("componentsLoaded"));
}

loadAllComponents();