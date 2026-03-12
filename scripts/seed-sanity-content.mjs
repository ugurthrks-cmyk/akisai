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

loadEnvFile(".env.local");
loadEnvFile(".env");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

const client =
  !isDryRun && projectId && dataset && writeToken
    ? createClient({
        projectId,
        dataset,
        apiVersion: "2026-03-12",
        token: writeToken,
        useCdn: false,
      })
    : null;

if (!isDryRun && (!projectId || !dataset || !writeToken)) {
  throw new Error(
    "Eksik Sanity ayari var. NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET ve SANITY_API_WRITE_TOKEN gerekli.",
  );
}

const authorSeed = [
  {
    id: "author.tan",
    slug: "tan",
    name: "Tan",
    fullName: "Tan",
    role: "Kurucu ve kıdemli yapay zekâ analisti",
    university: "İstanbul Üniversitesi, İktisat",
    experience: "5+ yıl yapay zekâ araştırması ve ürün çözümlemesi",
    bio: "Tan, yapay zekâ araçlarının iş süreçlerine uyarlanması, fiyat-performans çözümlemeleri ve Türkiye pazarına uygun kullanım senaryoları üzerine çalışır. Akış'ta inceleme çerçevesini ve kaynak doğrulama disiplinini yönetir.",
    methodologyFocus:
      "Araç değerlendirmelerinde fiyatlandırmayı, Türkçe kullanım niteliğini, veri politikalarını ve gerçek kullanım senaryolarını birincil kaynaklarla karşılaştırmalı biçimde doğrular.",
    expertise: [
      "Yapay zekâ araç değerlendirmesi",
      "Büyük dil modeli pazar çözümlemesi",
      "Türkiye yerelleştirmesi",
      "Fiyatlandırma araştırması",
      "İçerik operasyonları",
    ],
    credentials: [
      "İstanbul Üniversitesi İktisat",
      "5+ yıl yapay zekâ araştırması",
      "Yapay zekâ ürün çözümlemesi",
    ],
    sameAs: [],
    avatarPath: "public/authors/tan.svg",
    avatarAlt: "Tan profil görseli",
  },
  {
    id: "author.batuhan",
    slug: "batuhan",
    name: "Batuhan",
    fullName: "Batuhan Arı",
    role: "Yapay zekâ ve otomasyon mühendisi",
    university: "TED Üniversitesi, Endüstri Mühendisliği",
    experience: "5+ yıl yapay zekâ otomasyon mimarisi",
    bio: "Batuhan Arı, yapay zekâ araçlarıyla otomasyon kurguları, entegrasyon tasarımı ve operasyonel verimlilik odaklı iş akışları geliştirir. Akış'ta özellikle rehber içeriklerini ve uygulamalı otomasyon senaryolarını yönetir.",
    methodologyFocus:
      "Rehber içeriklerinde kurulabilir örnekleri, tetikleyici-eylem akışlarını, fiyat planlarını ve entegrasyon sınırlarını resmî dokümanlarla doğrular.",
    expertise: [
      "İş akışı otomasyonu",
      "Zapier",
      "Kodsuz sistem mimarisi",
      "Yapay zekâ operasyonları",
      "Süreç tasarımı",
    ],
    credentials: [
      "TED Üniversitesi Endüstri Mühendisliği",
      "5+ yıl otomasyon mimarisi",
      "Kodsuz ve yapay zekâ entegrasyonları",
    ],
    sameAs: [],
    avatarPath: "public/authors/batuhan.svg",
    avatarAlt: "Batuhan Arı profil görseli",
  },
];

function toSanitySlug(slug) {
  return { _type: "slug", current: slug };
}

function toReference(_ref) {
  return { _type: "reference", _ref };
}

function toSanityDate(value) {
  if (!value) {
    return undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00:00.000Z`;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function parseMinutes(value) {
  if (!value) {
    return undefined;
  }

  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

function parsePriceAmount(frontmatter) {
  if (typeof frontmatter.priceAmount === "number") {
    return frontmatter.priceAmount;
  }

  if (typeof frontmatter.priceAmount === "string") {
    const parsed = Number(frontmatter.priceAmount);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function readMdxCollection(relativeDir) {
  const directory = path.join(rootDir, relativeDir);
  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"));

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

async function uploadImage(relativePath, alt) {
  const fullPath = path.join(rootDir, relativePath);

  if (!client || !fs.existsSync(fullPath)) {
    return undefined;
  }

  const stream = fs.createReadStream(fullPath);
  const asset = await client.assets.upload("image", stream, {
    filename: path.basename(fullPath),
  });

  return {
    _type: "image",
    asset: toReference(asset._id),
    alt,
  };
}

const categoryEntries = readMdxCollection("src/content/kategori");
const toolEntries = readMdxCollection("src/content/ai");
const guideEntries = readMdxCollection("src/content/rehber");

const categoryIdByName = new Map(
  categoryEntries.map((entry) => [String(entry.frontmatter.name), `category.${entry.slug}`]),
);

const categoryDocs = categoryEntries.map((entry) => ({
  _id: `category.${entry.slug}`,
  _type: "category",
  name: String(entry.frontmatter.name),
  slug: toSanitySlug(entry.slug),
  description: String(entry.frontmatter.description),
  metaDescription: String(entry.frontmatter.metaDescription || entry.frontmatter.description),
  heroIntro: entry.frontmatter.heroIntro ? String(entry.frontmatter.heroIntro) : undefined,
  bodyMarkdown: entry.bodyMarkdown,
}));

const toolDocs = toolEntries.map((entry) => {
  const frontmatter = entry.frontmatter;
  const categoryId = categoryIdByName.get(String(frontmatter.category));

  return {
    _id: `tool.${entry.slug}`,
    _type: "tool",
    name: String(frontmatter.name),
    title: String(frontmatter.title),
    h1: frontmatter.h1 ? String(frontmatter.h1) : undefined,
    slug: toSanitySlug(entry.slug),
    description: String(frontmatter.description),
    metaDescription: frontmatter.metaDescription ? String(frontmatter.metaDescription) : undefined,
    heroIntro: frontmatter.heroIntro ? String(frontmatter.heroIntro) : undefined,
    bodyMarkdown: entry.bodyMarkdown,
    author: toReference(`author.${String(frontmatter.author)}`),
    category: categoryId ? toReference(categoryId) : undefined,
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : [],
    pricing: frontmatter.pricing ? String(frontmatter.pricing) : undefined,
    hasFreeTier: Boolean(frontmatter.hasFreeTier),
    priceAmount: parsePriceAmount(frontmatter),
    priceCurrency: frontmatter.priceCurrency ? String(frontmatter.priceCurrency) : undefined,
    isTRSupported: Boolean(frontmatter.isTRSupported),
    websiteUrl: frontmatter.websiteUrl ? String(frontmatter.websiteUrl) : undefined,
    pros: Array.isArray(frontmatter.pros) ? frontmatter.pros.map(String) : [],
    cons: Array.isArray(frontmatter.cons) ? frontmatter.cons.map(String) : [],
    faqs: Array.isArray(frontmatter.faqs)
      ? frontmatter.faqs.map((faq) => ({
          _type: "faqItem",
          question: String(faq.question),
          answer: String(faq.answer),
        }))
      : [],
    datePublished: toSanityDate(frontmatter.datePublished || frontmatter.date),
    dateModified: toSanityDate(frontmatter.dateModified),
  };
});

const toolNameIndex = new Map(toolDocs.map((doc) => [doc.name.toLowerCase(), doc._id]));

for (const categoryDoc of categoryDocs) {
  categoryDoc.featuredTools = toolDocs
    .filter((toolDoc) => {
      const entry = toolEntries.find((item) => `tool.${item.slug}` === toolDoc._id);
      return entry && String(entry.frontmatter.category) === categoryDoc.name;
    })
    .map((toolDoc) => toReference(toolDoc._id));
}

const guideDocs = guideEntries.map((entry) => {
  const frontmatter = entry.frontmatter;
  const relatedTools = Array.isArray(frontmatter.tools)
    ? frontmatter.tools
        .map((toolLabel) => String(toolLabel).toLowerCase())
        .flatMap((toolLabel) => {
          for (const [name, id] of toolNameIndex.entries()) {
            if (toolLabel.includes(name)) {
              return [toReference(id)];
            }
          }

          return [];
        })
    : [];

  return {
    _id: `guide.${entry.slug}`,
    _type: "guide",
    title: String(frontmatter.title),
    h1: frontmatter.h1 ? String(frontmatter.h1) : undefined,
    slug: toSanitySlug(entry.slug),
    description: String(frontmatter.description),
    metaDescription: frontmatter.metaDescription ? String(frontmatter.metaDescription) : undefined,
    heroIntro: frontmatter.heroIntro ? String(frontmatter.heroIntro) : undefined,
    bodyMarkdown: entry.bodyMarkdown,
    author: toReference(`author.${String(frontmatter.author)}`),
    category: categoryIdByName.get(String(frontmatter.category))
      ? toReference(categoryIdByName.get(String(frontmatter.category)))
      : undefined,
    relatedTools,
    difficulty: frontmatter.difficulty ? String(frontmatter.difficulty) : undefined,
    estimatedTimeMinutes: parseMinutes(frontmatter.time),
    faqs: Array.isArray(frontmatter.faqs)
      ? frontmatter.faqs.map((faq) => ({
          _type: "faqItem",
          question: String(faq.question),
          answer: String(faq.answer),
        }))
      : [],
    datePublished: toSanityDate(frontmatter.datePublished || frontmatter.date),
    dateModified: toSanityDate(frontmatter.dateModified),
  };
});

const authorDocs = [];

for (const author of authorSeed) {
  authorDocs.push({
    _id: author.id,
    _type: "author",
    name: author.name,
    fullName: author.fullName,
    slug: toSanitySlug(author.slug),
    role: author.role,
    bio: author.bio,
    avatar: await uploadImage(author.avatarPath, author.avatarAlt),
    university: author.university,
    experience: author.experience,
    methodologyFocus: author.methodologyFocus,
    expertise: author.expertise,
    credentials: author.credentials,
    sameAs: author.sameAs,
  });
}

const documents = [...authorDocs, ...categoryDocs, ...toolDocs, ...guideDocs];

if (isDryRun) {
  console.log(
    JSON.stringify(
      {
        mode: "dry-run",
        counts: {
          authors: authorDocs.length,
          categories: categoryDocs.length,
          tools: toolDocs.length,
          guides: guideDocs.length,
          total: documents.length,
        },
        ids: documents.map((doc) => doc._id),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

let transaction = client.transaction();

for (const document of documents) {
  transaction = transaction.createOrReplace(document);
}

await transaction.commit();

console.log(
  JSON.stringify(
    {
      mode: "write",
      projectId,
      dataset,
      counts: {
        authors: authorDocs.length,
        categories: categoryDocs.length,
        tools: toolDocs.length,
        guides: guideDocs.length,
        total: documents.length,
      },
      importedTools: toolDocs.map((doc) => doc.title),
      importedGuides: guideDocs.map((doc) => doc.title),
    },
    null,
    2,
  ),
);
