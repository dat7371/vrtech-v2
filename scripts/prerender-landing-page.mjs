import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

const componentFiles = [
  "components/shared/header.html",
  "components/landing/hero.html",
  "components/landing/products.html",
  "components/landing/nexus.html",
  "components/landing/compare.html",
  "components/landing/experience.html",
  "components/landing/vietmap.html",
  "components/landing/warranty.html",
  "components/landing/cta.html",
  "components/shared/footer.html",
];

async function readComponent(file) {
  return (await readFile(path.join(projectRoot, file), "utf8")).trim();
}

const [
  header,
  hero,
  products,
  nexus,
  compare,
  experience,
  vietmap,
  warranty,
  cta,
  footer,
] = await Promise.all(componentFiles.map(readComponent));

const indexPath = path.join(projectRoot, "index.html");
const currentHtml = await readFile(indexPath, "utf8");
const headMatch = currentHtml.match(/<head>[\s\S]*?<\/head>/i);

if (!headMatch) {
  throw new Error("Cannot find <head> in index.html");
}

const html = `<!DOCTYPE html>
<html lang="vi">
${headMatch[0]}
<body data-page="landing">
  <a href="#main-content" class="skip-link">Bỏ qua điều hướng</a>
  ${header}

  <main id="main-content">
    ${hero}
    ${products}
    ${nexus}
    ${compare}
    ${experience}
    ${vietmap}
    ${warranty}
    ${cta}
  </main>

  ${footer}
  <script src="js/app.min.js" defer></script>
</body>
</html>
`;

await writeFile(indexPath, html, "utf8");

console.log("Landing page prerendered into index.html");
