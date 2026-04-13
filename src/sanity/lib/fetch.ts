import "server-only";
import { createClient } from "next-sanity";
import { SANITY_BASE_TAG, uniqueSanityTags } from "@/sanity/lib/cache-tags";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  sanityReadToken,
  sanityApiToken,
} from "@/sanity/env";

type SanityFetchParams = Record<string, string | number | boolean | null | undefined>;

type PublishedFetchOptions = {
  tags?: string[];
  revalidate?: number | false;
};

const DEFAULT_SANITY_REVALIDATE_SECONDS = 300;

const serverSanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: sanityReadToken || sanityApiToken ? false : true,
  perspective: "published",
  token: sanityReadToken || sanityApiToken || undefined,
});

export async function fetchPublishedSanity<T>(
  query: string,
  params?: SanityFetchParams,
  options: PublishedFetchOptions = {},
) {
  const tags = uniqueSanityTags([SANITY_BASE_TAG], options.tags);

  return serverSanityClient.fetch<T>(query, params ?? {}, {
    next: {
      tags,
      revalidate: options.revalidate ?? DEFAULT_SANITY_REVALIDATE_SECONDS,
    },
    useCdn: sanityReadToken || sanityApiToken ? false : true,
    cacheMode: "noStale",
    perspective: "published",
    tag: "akisai.fetch",
  });
}
