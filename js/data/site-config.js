window.VRTECH_CONFIG = window.VRTECH_CONFIG || {
  // Example: "https://cdn.example.com/vrtech-v2"
  assetBaseUrl: "",
};

function getSiteBaseUrl() {
  const { origin, pathname } = window.location;
  const pagesIndex = pathname.indexOf("/pages/");

  if (pagesIndex !== -1) {
    return `${origin}${pathname.slice(0, pagesIndex + 1)}`;
  }

  const lastSlashIndex = pathname.lastIndexOf("/");
  const basePath = lastSlashIndex >= 0 ? pathname.slice(0, lastSlashIndex + 1) : "/";
  return `${origin}${basePath}`;
}

function normalizeAssetPath(path) {
  return String(path || "").replace(/^\.?\//, "").replace(/^\/+/, "");
}

function asset(path) {
  if (!path) {
    return path;
  }

  if (/^(?:https?:)?\/\//.test(path) || path.startsWith("data:")) {
    return path;
  }

  const normalizedPath = normalizeAssetPath(path);
  const cdnBaseUrl = String(window.VRTECH_CONFIG?.assetBaseUrl || "").trim().replace(/\/+$/, "");

  if (cdnBaseUrl) {
    return `${cdnBaseUrl}/${normalizedPath}`;
  }

  return new URL(normalizedPath, `${getSiteBaseUrl()}/`).toString();
}

function applyAssetPaths(root = document) {
  if (!root?.querySelectorAll) {
    return;
  }

  root.querySelectorAll('[src^="images/"], [href^="images/"]').forEach((element) => {
    const attribute = element.hasAttribute("src") ? "src" : "href";
    const currentValue = element.getAttribute(attribute);

    if (!currentValue) {
      return;
    }

    element.setAttribute(attribute, asset(currentValue));
  });
}

window.VRTECH_ASSETS = {
  asset,
  applyAssetPaths,
};
