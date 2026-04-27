const LANDING_COMPONENTS = [
  ["header", "header"],
  ["hero", "hero"],
  ["products", "products"],
  ["nexus", "nexus"],
  ["compare", "compare"],
  ["experience", "experience"],
  ["vietmap", "vietmap"],
  ["warranty", "warranty"],
  ["cta", "cta"],
  ["footer", "footer"],
];

function loadAllComponents() {
  window.VRTECH_COMPONENTS?.injectComponents?.(LANDING_COMPONENTS);

  setTimeout(() => {
    document.dispatchEvent(new Event("componentsLoaded"));
  }, 0);
}

if (document.body.dataset.page === "landing") {
  loadAllComponents();
}
