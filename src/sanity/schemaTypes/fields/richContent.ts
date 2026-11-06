import { defineArrayMember, defineField, type ConditionalPropertyCallbackContext } from "sanity";
import { hasLegacyMarkdown } from "../../../lib/content-body-policy";

type RichContentOptions = {
  legacyMarkdown?: boolean;
};

export function richContentField(
  name = "body",
  title = "İçerik",
  { legacyMarkdown = false }: RichContentOptions = {},
) {
  return defineField({
    name,
    title,
    type: "array",
    description: legacyMarkdown
      ? "MDX gövdesi doluysa bu alan yayımlanmaz ve salt okunurdur. MDX boşsa yayımlanan içerik bu alandır. Gövde biçimini değiştirmek için önce içerik aktarımı ve önizleme kontrolü gerekir."
      : "Yazının görünen gövdesi. H2/H3, kalın, link, liste ve görsel bloklarını burada yönetin.",
    ...(legacyMarkdown
      ? {
          readOnly: ({ document }: ConditionalPropertyCallbackContext) =>
            hasLegacyMarkdown(document?.bodyMarkdown),
        }
      : {}),
    of: [
      defineArrayMember({
        type: "block",
        styles: [
          { title: "Normal", value: "normal" },
          { title: "H2", value: "h2" },
          { title: "H3", value: "h3" },
          { title: "Quote", value: "blockquote" },
        ],
        lists: [
          { title: "Madde imi", value: "bullet" },
          { title: "Numaralı liste", value: "number" },
        ],
        marks: {
          decorators: [
            { title: "Bold", value: "strong" },
            { title: "Italic", value: "em" },
            { title: "Code", value: "code" },
          ],
          annotations: [
            {
              name: "link",
              title: "Link",
              type: "object",
              fields: [
                defineField({
                  name: "href",
                  title: "URL",
                  type: "url",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "openInNewTab",
                  title: "Yeni sekmede aç",
                  type: "boolean",
                  initialValue: true,
                }),
              ],
            },
          ],
        },
      }),
      defineArrayMember({
        type: "image",
        options: {
          hotspot: true,
        },
        fields: [
          defineField({
            name: "alt",
            title: "Alt metni",
            type: "string",
            validation: (rule) => rule.required().error("Görsel alt metni zorunludur."),
          }),
          defineField({
            name: "caption",
            title: "Açıklama",
            type: "string",
          }),
        ],
      }),
    ],
  });
}
