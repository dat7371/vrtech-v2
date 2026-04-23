const LANDING_COMPONENTS = [
  ["header", "header"],
  ["hero", "hero"],
  ["products", "products"],
  ["problem", "problem"],
  ["solution", "solution"],
  ["nexus", "nexus"],
  ["compare", "compare"],
  ["experience", "experience"],
  ["official", "official"],
  ["vietmap", "vietmap"],
  ["warranty", "warranty"],
  ["cta", "cta"],
  ["footer", "footer"],
];

function injectComponent(targetId, componentKey) {
  const container = document.getElementById(targetId);
  const template = window.COMPONENT_REGISTRY?.[componentKey];

  if (!container || !template) {
    return;
  }

  container.innerHTML = template;
  window.VRTECH_ASSETS?.applyAssetPaths?.(container);
}

function loadAllComponents() {
  LANDING_COMPONENTS.forEach(([targetId, componentKey]) => {
    injectComponent(targetId, componentKey);
  });

  setTimeout(() => {
    document.dispatchEvent(new Event("componentsLoaded"));
  }, 0);
}

if (document.getElementById("hero")) {
  loadAllComponents();
}
