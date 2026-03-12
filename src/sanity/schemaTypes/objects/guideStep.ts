import { defineField, defineType } from "sanity";

export const guideStep = defineType({
  name: "guideStep",
  title: "Rehber adimi",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Baslik",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Aciklama",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});
