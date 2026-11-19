import { copyFile, mkdir, readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const source = resolve(dirname(fileURLToPath(import.meta.url)), "entry.png");
const destination = join(outputDir, "entry.png");

await mkdir(outputDir, { recursive: true });
await copyFile(source, destination);

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const sourceSize = (await stat(source)).size;
const written = await readFile(destination);

if (written.length !== sourceSize) {
  throw new Error(`Size mismatch: wrote ${written.length} bytes, source is ${sourceSize} bytes`);
}
if (!written.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error("PNG signature check failed: written file does not start with a PNG signature");
}

console.log(`Wrote ${written.length} bytes of PNG to ${destination}`);
