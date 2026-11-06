import assert from "node:assert/strict";
import test from "node:test";
import { serializeJsonLd } from "../src/lib/json-ld.ts";

test("JSON-LD preserves Turkish, quotes, nested objects, and source URLs", () => {
  const value = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: 'AkışAI: "Türkçe" karşılaştırma\nİçerik & kaynak',
    citation: [{ url: "https://example.com/?a=1&b=2", name: "<Örnek>" }],
    review: { reviewRating: { ratingValue: 8.5 } },
  };
  assert.deepEqual(JSON.parse(serializeJsonLd(value)), value);
});

test("CMS strings cannot close the enclosing JSON-LD script", () => {
  const payload = '</script><script>alert("test")</script><img src=x onerror=alert(1)>';
  const serialized = serializeJsonLd({ description: payload });
  const html = `<script type="application/ld+json">${serialized}</script>`;
  assert.equal(serialized.includes("<"), false);
  assert.equal((html.match(/<script\b/g) ?? []).length, 1);
  assert.equal((html.match(/<\/script>/g) ?? []).length, 1);
  assert.equal(JSON.parse(serialized).description, payload);
});

test("a graph keeps entity identifiers, canonical URLs, and breadcrumb positions", () => {
  const value = { "@graph": [
    { "@type": "SoftwareApplication", "@id": "https://akisai.com.tr/incelemeler/chatgpt#software", offers: { price: "0", priceCurrency: "TRY" } },
    { "@type": "BreadcrumbList", itemListElement: [{ position: 1, item: "https://akisai.com.tr" }] },
  ] };
  assert.deepEqual(JSON.parse(serializeJsonLd(value)), value);
});
