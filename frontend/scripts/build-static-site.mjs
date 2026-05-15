import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const distDir = path.join(projectRoot, "dist");

const runtimeEntries = [
  ".htaccess",
  "index.html",
  "robots.txt",
  "sitemap.xml",
  "css",
  "js",
  "images",
  "pages",
];

function assertInsideProject(targetPath) {
  const relativePath = path.relative(projectRoot, targetPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Refusing to write outside project root: ${targetPath}`);
  }
}

assertInsideProject(distDir);

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

await Promise.all(
  runtimeEntries.map((entry) =>
    cp(path.join(projectRoot, entry), path.join(distDir, entry), {
      recursive: true,
    })
  )
);

await writeFile(path.join(distDir, ".nojekyll"), "", "utf8");

console.log(`Static site artifact created at ${path.relative(projectRoot, distDir)}/`);
