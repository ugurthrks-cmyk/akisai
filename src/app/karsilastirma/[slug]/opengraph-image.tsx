import { notFound } from "next/navigation";
import { getComparisonBySlug } from "@/lib/content-source";
import {
  buildContentSocialImage,
  socialImageContentType as contentType,
  socialImageSize as size,
} from "@/lib/social-image";

type ComparisonSocialImageProps = {
  params: Promise<{ slug: string }>;
};

export { contentType, size };
export const revalidate = 86400;

export default async function OpenGraphImage({ params }: ComparisonSocialImageProps) {
  const resolvedParams = await params;
  const comparison = await getComparisonBySlug(resolvedParams.slug);

  if (!comparison) {
    notFound();
  }

  return buildContentSocialImage({
    title: comparison.h1 || comparison.title,
    description: comparison.metaDescription || comparison.heroIntro || comparison.description,
    category: comparison.category,
    variant: "comparison",
  });
}
