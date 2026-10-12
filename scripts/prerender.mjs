import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputDirectory = path.join(projectRoot, "dist");
const htmlPath = path.join(outputDirectory, "index.html");
const manifestPath = path.join(outputDirectory, ".vite", "manifest.json");

const server = await createServer({
  configFile: path.join(projectRoot, "vite.config.ts"),
  root: projectRoot,
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
});

try {
  const { render } = await server.ssrLoadModule("/src/entry-server.tsx");
  const markup = render();
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  let html = await readFile(htmlPath, "utf8");

  const rootMarkup = '<div id="root"></div>';
  if (!html.includes(rootMarkup)) {
    throw new Error("Could not find the empty application root in dist/index.html");
  }
  html = html.replace(rootMarkup, `<div id="root">${markup}</div>`);

  for (const [source, asset] of Object.entries(manifest)) {
    if (!source.startsWith("src/assets/") || !asset.file) continue;

    const sourceUrl = `/${source}`;
    const builtUrl = `/${encodeURI(asset.file)}`;
    html = html
      .replaceAll(encodeURI(sourceUrl), builtUrl)
      .replaceAll(sourceUrl, builtUrl);
  }

  const unresolvedAssets = html.match(/\/src\/assets\/[^\s"'<>)]*/g) ?? [];
  if (unresolvedAssets.length > 0) {
    throw new Error(
      `Pre-rendered HTML contains unresolved source assets: ${unresolvedAssets.slice(0, 3).join(", ")}`
    );
  }

  await writeFile(htmlPath, html);
  console.info("Pre-rendered the home page into dist/index.html.");
} finally {
  await server.close();
  await rm(manifestPath, { force: true });
}
