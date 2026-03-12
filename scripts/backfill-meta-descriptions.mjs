import fs from "node:fs";
import { createClient } from "@sanity/client";

function readEnvFile(path) {
  const text = fs.readFileSync(path, "utf8");
  return Object.fromEntries(
    text
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf("=");
        return [line.slice(0, separatorIndex), line.slice(separatorIndex + 1)];
      }),
  );
}

const env = readEnvFile(".env.local");

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-02-19",
  token: env.SANITY_API_WRITE_TOKEN || env.SANITY_API_READ_TOKEN,
  useCdn: false,
});

const query = `*[_type in ["tool", "guide", "page", "author", "category"]]{
  _id,
  _type,
  description,
  metaDescription,
  bio
}`;

function buildMetaDescription(doc) {
  if (typeof doc.metaDescription === "string" && doc.metaDescription.trim()) {
    return null;
  }

  if (doc._type === "author" && typeof doc.bio === "string" && doc.bio.trim()) {
    return doc.bio.trim().slice(0, 160);
  }

  if (typeof doc.description === "string" && doc.description.trim()) {
    return doc.description.trim().slice(0, 160);
  }

  return null;
}

async function main() {
  const docs = await client.fetch(query);

  for (const doc of docs) {
    const metaDescription = buildMetaDescription(doc);

    if (!metaDescription) {
      continue;
    }

    await client.patch(doc._id).set({ metaDescription }).commit();
    console.log(`Meta açıklama eklendi: ${doc._id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
