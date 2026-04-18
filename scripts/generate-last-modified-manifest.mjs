import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(rootDir, "src", "generated", "last-modified-manifest.json");

function loadEnvFile(filename) {
  const fullPath = path.join(rootDir, filename);

  if (!fs.existsSync(fullPath)) {
    return;
  }

  const content = fs.readFileSync(fullPath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function toHttpDate(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toUTCString();
}

function writeManifest(data) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset) {
  writeManifest({});
  process.exit(0);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-03-12",
  useCdn: false,
  ...(token ? { token } : {}),
});

const query = `{
  "tools": *[_type == "tool" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": coalesce(dateModified, _updatedAt, datePublished)
  },
  "comparisons": *[_type == "comparison" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": coalesce(dateModified, _updatedAt, datePublished)
  },
  "guides": *[_type == "guide" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": coalesce(dateModified, _updatedAt, datePublished)
  }
}`;

const result = await client.fetch(query);
const manifest = {};

for (const item of result.tools ?? []) {
  const httpDate = toHttpDate(item.updatedAt);
  if (item.slug && httpDate) {
    manifest[`/incelemeler/${item.slug}`] = httpDate;
  }
}

for (const item of result.comparisons ?? []) {
  const httpDate = toHttpDate(item.updatedAt);
  if (item.slug && httpDate) {
    manifest[`/karsilastirma/${item.slug}`] = httpDate;
  }
}

for (const item of result.guides ?? []) {
  const httpDate = toHttpDate(item.updatedAt);
  if (item.slug && httpDate) {
    manifest[`/rehber/${item.slug}`] = httpDate;
  }
}

writeManifest(manifest);
