import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { deskStructure } from "./src/sanity/deskStructure";
import {
  sanityDataset,
  sanityProjectId,
  sanityStudioBasePath,
} from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { singletonActions, singletonTypes } from "./src/sanity/singletons";

export default defineConfig({
  name: "default",
  title: "AkışAI Admin",
  projectId: sanityProjectId,
  dataset: sanityDataset,
  basePath: sanityStudioBasePath,
  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool({
      defaultApiVersion: "2026-03-11",
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type !== "global") {
        return prev;
      }

      return prev.filter((item) => item.templateId !== "siteSettings");
    },
    actions: (prev, context) =>
      singletonTypes.has(context.schemaType)
        ? prev.filter((action) => action.action && singletonActions.has(action.action))
        : prev,
  },
});
