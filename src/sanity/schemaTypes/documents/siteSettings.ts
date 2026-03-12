import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site ayarlari",
  type: "document",
  description: "Tekil belge. Marka, varsayilan SEO ve kurumsal profil ayarlari burada tutulur.",
  groups: [
    { name: "brand", title: "Marka" },
    { name: "seo", title: "SEO" },
    { name: "organization", title: "Kurumsal" },
  ],
  fields: [
    defineField({
      name: "siteName",
      title: "Site adi",
      type: "string",
      group: "brand",
      validation: (rule) => rule.required(),
      description: "Arayuzde, schema icinde ve varsayilan metadata alanlarinda kullanilir.",
    }),
    defineField({
      name: "shortName",
      title: "Kisa ad",
      type: "string",
      group: "brand",
    }),
    defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      group: "brand",
      validation: (rule) => rule.required(),
      description: "Canli alan adiniz. Ornek: https://akisai.com.tr",
    }),
    defineField({
      name: "defaultTitle",
      title: "Varsayilan title",
      type: "string",
      group: "seo",
      validation: (rule) => rule.max(65).warning("Varsayilan title 65 karakteri gecmemeli."),
    }),
    defineField({
      name: "defaultDescription",
      title: "Varsayilan aciklama",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (rule) => rule.max(160).warning("Varsayilan aciklama 160 karakteri gecmemeli."),
    }),
    defineField({
      name: "defaultSocialImage",
      title: "Varsayilan sosyal gorsel",
      type: "image",
      group: "seo",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt metni",
          type: "string",
          validation: (rule) => rule.required().warning("Varsayilan sosyal gorsel alt metni ekleyin."),
        }),
      ],
    }),
    defineField({
      name: "organizationDescription",
      title: "Kurumsal tanim",
      type: "text",
      rows: 4,
      group: "organization",
    }),
    defineField({
      name: "socialProfiles",
      title: "Sosyal profiller",
      type: "array",
      group: "organization",
      of: [{ type: "url" }],
    }),
  ],
  preview: {
    select: {
      title: "siteName",
      subtitle: "siteUrl",
    },
  },
});
