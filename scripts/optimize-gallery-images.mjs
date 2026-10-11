import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const sourceRoot = fileURLToPath(new URL("../src/assets/galeria/", import.meta.url));
const outputRoot = fileURLToPath(
  new URL("../src/assets/galeria-optimizada/", import.meta.url)
);
const supportedExtensions = new Set([".jpg", ".jpeg", ".png"]);
const outputWidths = [640, 1600];

async function getImageFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getImageFiles(entryPath)));
    } else if (supportedExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(entryPath);
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

const sourceFiles = await getImageFiles(sourceRoot);
if (sourceFiles.length === 0) {
  throw new Error(`No supported gallery images found in ${sourceRoot}`);
}

for (const sourcePath of sourceFiles) {
  const relativePath = path.relative(sourceRoot, sourcePath);
  const outputDirectory = path.join(outputRoot, path.dirname(relativePath));
  const fileName = path.parse(relativePath).name;
  await mkdir(outputDirectory, { recursive: true });

  for (const width of outputWidths) {
    await sharp(sourcePath)
      .rotate()
      .resize({
        width,
        height: width,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 5 })
      .toFile(path.join(outputDirectory, `${fileName}-${width}.webp`));
  }
}

console.info(
  `Generated ${sourceFiles.length * outputWidths.length} WebP images from ${sourceFiles.length} originals.`
);
