import { defineField, defineType } from "sanity";
import { richContentField } from "@/sanity/schemaTypes/fields/richContent";

export const page = defineType({
  name: "page",
  title: "Sayfa",
  type: "document",
  description: "Kurumsal veya landing sayfalar icin genel icerik tipi.",
  groups: [
    { name: "editorial", title: "Editoryal" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "editorial",
      validation: (rule) => rule.required(),
      description: "Tarayici sekmesi, Google basligi ve varsayilan sosyal baslik icin kullanilir.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      options: {
        source: "title",
        maxLength: 120,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Kisa aciklama",
      type: "text",
      rows: 3,
      group: "editorial",
      validation: (rule) => rule.required(),
      description: "Sayfa ustundeki gorunen ozet ve listeleme metinlerinde kullanilir.",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta aciklama",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (rule) => rule.max(160).warning("Meta aciklama 160 karakteri gecmemeli."),
      description: "Sadece SEO meta aciklamasi icin kullanilir. Bos birakilirsa kisa aciklama kullanilir.",
    }),
    defineField({
      name: "pageType",
      title: "Sayfa tipi",
      type: "string",
      group: "editorial",
      options: {
        list: [
          { title: "Kurumsal", value: "corporate" },
          { title: "Landing", value: "landing" },
          { title: "Editoryal", value: "editorial" },
        ],
      },
      initialValue: "corporate",
    }),
    richContentField("body", "Sayfa govdesi"),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
      group: "seo",
      description: "Sadece canonical veya noindex gibi istisnai durumlarda kullanin.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: selection.subtitle ? `/${selection.subtitle}` : "Slug yok",
      };
    },
  },
});
