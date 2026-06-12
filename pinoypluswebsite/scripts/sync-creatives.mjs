import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatePath = path.join(root, "creatives/_template.html");
const dataPath = path.join(root, "js/data.js");

const template = fs.readFileSync(templatePath, "utf8");
const dataSource = fs.readFileSync(dataPath, "utf8");
const slugs = [...dataSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);

if (!slugs.length) {
  throw new Error("No creative slugs found in js/data.js");
}

for (const slug of slugs) {
  const html = template.replace('data-slug="SLUG"', `data-slug="${slug}"`);
  const outPath = path.join(root, "creatives", `${slug}.html`);
  fs.writeFileSync(outPath, html);
  console.log(`wrote ${path.relative(root, outPath)}`);
}
