import { cp, mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const imageRoot = path.join(projectRoot, "images");
const backupRoot = path.join(os.tmpdir(), `vrtech-image-backup-${new Date().toISOString().replace(/[:.]/g, "-")}`);
const supportedExtensions = new Set([".webp", ".jpg", ".jpeg", ".png"]);

function assertInsideImages(targetPath) {
  const relativePath = path.relative(imageRoot, targetPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Refusing to process outside images/: ${targetPath}`);
  }
}

async function collectImages(dir) {
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectImages(fullPath));
      continue;
    }

    if (entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

function getMaxDimension(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/").toLowerCase();

  if (normalized.startsWith("logo/")) {
    return 512;
  }

  if (normalized.startsWith("appvrtech/")) {
    return 720;
  }

  return 1200;
}

function getOutputPipeline(filePath, input) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".webp") {
    return input.webp({ quality: 82, effort: 6 });
  }

  if (extension === ".jpg" || extension === ".jpeg") {
    return input.jpeg({ quality: 82, mozjpeg: true });
  }

  return input.png({ compressionLevel: 9, effort: 10 });
}

async function optimizeImage(filePath) {
  assertInsideImages(filePath);

  const relativePath = path.relative(imageRoot, filePath);
  const original = await stat(filePath);
  const source = await readFile(filePath);
  const metadata = await sharp(source).metadata();
  const maxDimension = getMaxDimension(relativePath);
  const shouldResize = Math.max(metadata.width || 0, metadata.height || 0) > maxDimension;
  const input = sharp(source, { failOn: "none" }).rotate();
  const resized = shouldResize
    ? input.resize({
      width: maxDimension,
      height: maxDimension,
      fit: "inside",
      withoutEnlargement: true,
    })
    : input;
  const output = await getOutputPipeline(filePath, resized).toBuffer();

  if (output.length >= original.size) {
    return {
      relativePath,
      originalSize: original.size,
      newSize: original.size,
      width: metadata.width,
      height: metadata.height,
      skipped: true,
    };
  }

  const backupPath = path.join(backupRoot, relativePath);
  const tempPath = `${filePath}.resize-tmp`;

  await mkdir(path.dirname(backupPath), { recursive: true });
  await cp(filePath, backupPath);
  await writeFile(tempPath, output);
  await rm(filePath, { force: true });
  await rename(tempPath, filePath);

  const optimizedMetadata = await sharp(output).metadata();

  return {
    relativePath,
    originalSize: original.size,
    newSize: output.length,
    width: metadata.width,
    height: metadata.height,
    optimizedWidth: optimizedMetadata.width,
    optimizedHeight: optimizedMetadata.height,
    skipped: false,
  };
}

const images = await collectImages(imageRoot);
const results = [];

for (const image of images) {
  results.push(await optimizeImage(image));
}

const optimized = results.filter((item) => !item.skipped);
const savedBytes = optimized.reduce((total, item) => total + (item.originalSize - item.newSize), 0);

console.log(JSON.stringify({
  backupRoot,
  totalImages: results.length,
  optimizedImages: optimized.length,
  skippedImages: results.length - optimized.length,
  savedKB: Math.round(savedBytes / 1024),
  optimized: optimized
    .sort((a, b) => (b.originalSize - b.newSize) - (a.originalSize - a.newSize))
    .slice(0, 30),
}, null, 2));
