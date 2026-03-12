import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "SSS maddesi",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Soru",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Cevap",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "answer",
    },
  },
});
