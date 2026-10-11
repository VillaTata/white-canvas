import sharp from "sharp";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../src/assets/background.jpeg", import.meta.url));
const output = fileURLToPath(new URL("../public/og-image.jpg", import.meta.url));

await sharp(source)
  .rotate()
  .resize(1200, 630, { fit: "cover", position: "attention" })
  .jpeg({ quality: 82 })
  .toFile(output);

console.info(`Generated ${output}`);
