import { defineField, defineType } from "sanity";

export const sourceItem = defineType({
  name: "sourceItem",
  title: "Kaynak",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Kaynak etiketi",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publisher",
      title: "Yayınlayan",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      title: "Not",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "publisher",
    },
  },
});
