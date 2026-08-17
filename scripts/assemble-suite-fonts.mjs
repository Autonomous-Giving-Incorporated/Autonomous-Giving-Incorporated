import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fonts = join(root, "app/fonts");
const parts = join(fonts, "parts");

const expected = {
  "inter-400.css":
    "47fa4eeec372cb598c2207eec0f19fd5e14e26527c0140f12904039dcdb12416",
  "inter-500-700.css":
    "fb7348c8d4a17d03d8a23f6a5ae8baf4c08d89a3d2aed0cf6783052bf2413c80",
};

function assemble(name) {
  const a = readFileSync(join(parts, `${name}.a`));
  const b = readFileSync(join(parts, `${name}.b`));
  const out = Buffer.concat([a, b]);
  const file = `${name}.css`;
  const digest = createHash("sha256").update(out).digest("hex");
  if (digest !== expected[file]) {
    throw new Error(`${file} sha256 ${digest} != ${expected[file]}`);
  }
  writeFileSync(join(fonts, file), out);
}

assemble("inter-400");
assemble("inter-500-700");
