import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { renderToStaticMarkup } from "react-dom/server";

const revision = JSON.parse(fs.readFileSync(new URL("../review/p1/comparison-patch.json", import.meta.url), "utf8"));
const before = JSON.parse(fs.readFileSync(new URL("../review/p1/comparison-before.json", import.meta.url), "utf8"));
const mdx = matter(fs.readFileSync(new URL("../src/content/karsilastirma/chatgpt-mi-claude-mu.mdx", import.meta.url), "utf8"));
const { patch } = revision.mutations[0];

test("the proposed CMS revision guards concurrency and only changes editorial fields", () => {
  assert.equal(revision.mutations.length, 1);
  assert.equal(patch.id, "comparison.chatgpt-mi-claude-mu");
  assert.equal(patch.ifRevisionID, before._rev);
  assert.deepEqual(Object.keys(patch.set).sort(), ["bodyMarkdown", "faqs", "sources", "lastVerified", "dateModified", "verificationNotes"].sort());
  assert.equal(mdx.data.title, "ChatGPT mi Claude mu? 2026'da Hangisini Kullanmalısın");
  assert.equal(mdx.data.h1, "ChatGPT mi, Claude mu? Kullanım Amacına Göre 2026 Rehberi");
  assert.equal(mdx.data.datePublished, "2026-04-18");
  assert.equal(patch.set.bodyMarkdown, mdx.content.trim());
  assert.deepEqual(patch.set.faqs.map(({question, answer}) => ({question, answer})), mdx.data.faqs);
  assert.deepEqual(Object.keys(before.fields).sort(), Object.keys(patch.set).sort());
});

test("the proposed article compiles as MDX with its citations and internal links", async () => {
  const { content } = await compileMDX({source: patch.set.bodyMarkdown});
  const html = renderToStaticMarkup(content);
  assert.match(html, /6 Kasım 2026/);
  assert.match(html, /href="https:\/\/learn.chatgpt.com\/docs\/pricing"/);
  assert.match(html, /href="\/rehber\/claude-code-nasil-kullanilir"/);
  assert.match(html, /sesli mod mobil, masaüstü ve web/);
  assert.doesNotMatch(html, /<script\b/i);
  assert.doesNotMatch(patch.set.bodyMarkdown, /sesli mod ve görsel üretim şu an yok|Pro.nun 20 katı|Pro - \$120/);
});
