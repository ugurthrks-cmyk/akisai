import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Yazar",
  type: "document",
  description: "E-E-A-T ve yazar profil sayfalari icin kullanilan icerik tipi.",
  groups: [
    { name: "editorial", title: "Editoryal" },
    { name: "profile", title: "Profil" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Kisa ad",
      type: "string",
      group: "editorial",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fullName",
      title: "Tam ad",
      type: "string",
      group: "editorial",
      validation: (rule) => rule.required(),
      description: "Public yazar sayfasinda ve schema icinde gorunen ad.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      options: {
        source: "fullName",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Rol",
      type: "string",
      group: "editorial",
      validation: (rule) => rule.required(),
      description: "Ornek: Kurucu ve Kidemli Yapay Zeka Analisti",
    }),
    defineField({
      name: "bio",
      title: "Biyografi",
      type: "text",
      rows: 5,
      group: "profile",
      validation: (rule) => rule.required(),
      description: "Yazarin uzmanlik ve gecmisini anlatan gorunen biyografi.",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta aciklama",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (rule) => rule.max(160).warning("Meta aciklama 160 karakteri gecmemeli."),
      description: "Sadece SEO meta aciklamasi icin kullanilir. Bos birakilirsa biyografinin kisa ozeti kullanilir.",
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      group: "profile",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt metni",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "university",
      title: "Universite",
      type: "string",
      group: "profile",
    }),
    defineField({
      name: "experience",
      title: "Deneyim",
      type: "string",
      group: "profile",
    }),
    defineField({
      name: "methodologyFocus",
      title: "Metodoloji odagi",
      type: "text",
      rows: 4,
      group: "profile",
    }),
    defineField({
      name: "expertise",
      title: "Uzmanlik alanlari",
      type: "array",
      of: [{ type: "string" }],
      group: "profile",
    }),
    defineField({
      name: "credentials",
      title: "Yetkinlikler",
      type: "array",
      of: [{ type: "string" }],
      group: "profile",
    }),
    defineField({
      name: "sameAs",
      title: "Harici profil URL'leri",
      type: "array",
      of: [{ type: "url" }],
      group: "profile",
      description: "LinkedIn, X, Github, resmi profil sayfalari gibi guven sinyalleri.",
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
      title: "fullName",
      subtitle: "role",
      media: "avatar",
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: selection.subtitle || "Rol girilmedi",
        media: selection.media,
      };
    },
  },
});
