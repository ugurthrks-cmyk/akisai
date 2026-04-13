import { author } from "@/sanity/schemaTypes/documents/author";
import { category } from "@/sanity/schemaTypes/documents/category";
import { guide } from "@/sanity/schemaTypes/documents/guide";
import { page } from "@/sanity/schemaTypes/documents/page";
import { siteSettings } from "@/sanity/schemaTypes/documents/siteSettings";
import { tool } from "@/sanity/schemaTypes/documents/tool";
import { faqItem } from "@/sanity/schemaTypes/objects/faqItem";
import { seoMetadata } from "@/sanity/schemaTypes/objects/seoMetadata";
import { sourceItem } from "@/sanity/schemaTypes/objects/sourceItem";

export const schemaTypes = [
  author,
  category,
  guide,
  page,
  siteSettings,
  tool,
  faqItem,
  seoMetadata,
  sourceItem,
];
