import { author } from "@/sanity/schemaTypes/documents/author";
import { category } from "@/sanity/schemaTypes/documents/category";
import { comparison } from "@/sanity/schemaTypes/documents/comparison";
import { guide } from "@/sanity/schemaTypes/documents/guide";
import { page } from "@/sanity/schemaTypes/documents/page";
import { siteSettings } from "@/sanity/schemaTypes/documents/siteSettings";
import { tool } from "@/sanity/schemaTypes/documents/tool";
import { faqItem } from "@/sanity/schemaTypes/objects/faqItem";
import { guideStep } from "@/sanity/schemaTypes/objects/guideStep";
import { seoMetadata } from "@/sanity/schemaTypes/objects/seoMetadata";
import { sourceItem } from "@/sanity/schemaTypes/objects/sourceItem";

export const schemaTypes = [
  author,
  category,
  comparison,
  guide,
  page,
  siteSettings,
  tool,
  faqItem,
  guideStep,
  seoMetadata,
  sourceItem,
];
