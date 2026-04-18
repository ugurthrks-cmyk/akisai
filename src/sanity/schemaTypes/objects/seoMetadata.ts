import { defineField, defineType } from "sanity";

export const seoMetadata = defineType({
  name: "seoMetadata",
  title: "SEO ayarlari",
  type: "object",
  fields: [
    defineField({
      name: "seoTitle",
      title: "SEO title override",
      type: "string",
      validation: (rule) => rule.max(70),
      description: "Google ve tarayici basligi icin varsayilan title alanini ezmek isterseniz kullanin.",
    }),
    defineField({
      name: "openGraphTitle",
      title: "Open Graph title",
      type: "string",
      validation: (rule) => rule.max(95),
      description: "Sosyal paylasim basligini ozellestirmek icin kullanin.",
    }),
    defineField({
      name: "openGraphDescription",
      title: "Open Graph description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(200),
      description: "Sosyal paylasim aciklamasi icin ayrik metin gerekiyorsa kullanin.",
    }),
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
