import { hasLegacyMarkdown } from "../../../lib/content-body-policy";
import { defineField, defineType } from "sanity";
import { richContentField } from "@/sanity/schemaTypes/fields/richContent";

export const category = defineType({
  name: "category",
  title: "Kategori",
  type: "document",
  description: "Hub ve kategori landing sayfalari icin temel icerik tipi.",
  groups: [
    { name: "editorial", title: "Editoryal" },
    { name: "media", title: "Medya" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Kategori adi",
      type: "string",
      group: "editorial",
      validation: (rule) => rule.required(),
      description: "Public tarafta gorunen kategori adi. Ornek: Video AI",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Kategori aciklamasi",
      type: "text",
      rows: 3,
      group: "editorial",
      validation: (rule) => rule.required(),
      description: "Kartlarda, kategori merkezlerinde ve gorunen ozet alanlarinda kullanilir.",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "seo",
      validation: (rule) => rule.max(70),
      description:
        "Tarayici sekmesi ve arama sonuclari icin kullanilir. Bos kalirsa kategori adi kullanilir.",
    }),
    defineField({
      name: "h1",
      title: "Sayfa basligi (H1)",
      type: "string",
      group: "editorial",
      validation: (rule) => rule.max(90),
      description:
        "Kategori sayfasinda gorunen ana baslik. Bos kalirsa kategori adi kullanilir.",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta aciklama",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (rule) => rule.required().max(160).warning("Meta aciklama 160 karakteri gecmemeli."),
      description: "Sadece SEO meta description alaninda kullanilir.",
    }),
    defineField({
      name: "heroIntro",
      title: "Hero girisi",
      type: "text",
      rows: 4,
      group: "editorial",
    }),
    defineField({
      name: "bodyMarkdown",
      title: "MDX gövdesi (doluysa yayında)",
      type: "text",
      rows: 18,
      group: "editorial",
      hidden: ({ document }) => !hasLegacyMarkdown(document?.bodyMarkdown),
      description:
        "Bu alan doluysa yayımlanan gövde budur; Portable Text alanı yayımlanmaz. Alanı boşaltmak yayın kaynağını değiştirir. Aktarım ve önizleme kontrolü olmadan boşaltmayın.",
    }),
    richContentField("body", "Kategori icerigi", { legacyMarkdown: true }),
    defineField({
      name: "icon",
      title: "Kategori iconu",
      type: "image",
      group: "media",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt metni",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "featuredTools",
      title: "One cikarilan toollar",
      type: "array",
      group: "editorial",
      of: [
        defineField({
          name: "toolRef",
          title: "Tool",
          type: "reference",
          to: [{ type: "tool" }],
        }),
      ],
      description: "Kategori hub'inda one cikarmak istediginiz araclari secin.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "icon",
    },
  },
});
