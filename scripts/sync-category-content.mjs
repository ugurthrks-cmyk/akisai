import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const isDryRun = process.argv.includes("--dry-run");

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

function toSanitySlug(slug) {
  return { _type: "slug", current: slug };
}

function readCategoryEntries() {
  const directory = path.join(rootDir, "src/content/kategori");
  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
    .sort((left, right) => left.localeCompare(right, "tr"));

  return files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const source = fs.readFileSync(path.join(directory, file), "utf8");
    const { data, content } = matter(source);

    return {
      slug,
      frontmatter: data,
      bodyMarkdown: content.trim(),
    };
  });
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "Eksik Sanity ayari var. NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET ve mutasyon yetkili token gerekli.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-03-14",
  token,
  useCdn: false,
});

const categoryEntries = readCategoryEntries();

if (isDryRun) {
  console.log(
    JSON.stringify(
      {
        mode: "dry-run",
        count: categoryEntries.length,
        slugs: categoryEntries.map((entry) => entry.slug),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

let transaction = client.transaction();

for (const entry of categoryEntries) {
  const frontmatter = entry.frontmatter;
  const documentId = `category.${entry.slug}`;

  transaction = transaction
    .createIfNotExists({
      _id: documentId,
      _type: "category",
      slug: toSanitySlug(entry.slug),
    })
    .patch(documentId, {
      set: {
        name: String(frontmatter.name),
        slug: toSanitySlug(entry.slug),
        seoTitle: frontmatter.seoTitle ? String(frontmatter.seoTitle) : undefined,
        h1: frontmatter.h1 ? String(frontmatter.h1) : undefined,
        description: String(frontmatter.description),
        metaDescription: String(frontmatter.metaDescription || frontmatter.description),
        heroIntro: frontmatter.heroIntro ? String(frontmatter.heroIntro) : undefined,
        bodyMarkdown: entry.bodyMarkdown,
      },
    });
}

await transaction.commit();

console.log(
  JSON.stringify(
    {
      mode: "write",
      count: categoryEntries.length,
      slugs: categoryEntries.map((entry) => entry.slug),
    },
    null,
    2,
  ),
);
