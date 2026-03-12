export const sanityStudioBasePath = "/admin";
export const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "missing-project-id";
export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const sanityApiVersion = "2026-03-11";
export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_DATASET
);
