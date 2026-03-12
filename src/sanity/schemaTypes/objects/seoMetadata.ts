import { defineField, defineType } from "sanity";

export const seoMetadata = defineType({
  name: "seoMetadata",
  title: "SEO ayarlari",
  type: "object",
  fields: [
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL override",
      type: "url",
      description: "Genelde bos kalir. Farkli bir canonical gerekiyorsa doldurun.",
    }),
    defineField({
      name: "noIndex",
      title: "Noindex",
      type: "boolean",
      initialValue: false,
      description: "Bu sayfanin arama motorlarinda indexlenmesini istemiyorsaniz acin.",
    }),
  ],
});
