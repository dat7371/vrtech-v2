import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

const cssFiles = [
  "css/core/base.css",
  "css/layout/header.css",
  "css/sections/hero.css",
  "css/sections/sections.css",
  "css/sections/products.css",
  "css/layout/footer.css",
  "css/layout/responsive.css",
  "css/pages/product-page.css",
  "css/pages/app.css",
  "css/pages/warranty-policy.css",
  "css/pages/legal-policy.css",
  "css/pages/blog.css",
];

function minifyCss(source) {
  const imports = [];
  const withoutImports = source.replace(/@import\s+url\([^)]+\);\s*/g, (match) => {
    if (match.includes("fonts.googleapis.com")) {
      imports.push(match.trim());
    }

    return "";
  });

  const body = withoutImports
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();

  return `${Array.from(new Set(imports)).join("")}${body}`;
}

const sources = await Promise.all(
  cssFiles.map(async (file) => readFile(path.join(projectRoot, file), "utf8"))
);

const outputPath = path.join(projectRoot, "css/app.min.css");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, minifyCss(sources.join("\n")), "utf8");

console.log(`CSS bundle created at ${path.relative(projectRoot, outputPath)}`);
