import { defineCliConfig } from "sanity/cli";
import {
  sanityDataset,
  sanityProjectId,
  sanityStudioBasePath,
} from "./src/sanity/env";

export default defineCliConfig({
  api: {
    projectId: sanityProjectId,
    dataset: sanityDataset,
  },
  studioHost: sanityStudioBasePath.replace(/^\//, ""),
});
