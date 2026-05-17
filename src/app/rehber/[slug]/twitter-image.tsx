import { notFound } from "next/navigation";
import { getGuideBySlug } from "@/lib/content-source";
import {
  buildContentSocialImage,
  socialImageContentType as contentType,
  socialImageSize as size,
} from "@/lib/social-image";

type GuideSocialImageProps = {
  params: Promise<{ slug: string }>;
};

export { contentType, size };
export const revalidate = 86400;

export default async function TwitterImage({ params }: GuideSocialImageProps) {
  const resolvedParams = await params;
  const guide = await getGuideBySlug(resolvedParams.slug);

  if (!guide) {
    notFound();
  }

  return buildContentSocialImage({
    title: guide.h1 || guide.title,
    description: guide.metaDescription || guide.heroIntro || guide.description,
    category: guide.category,
    variant: "guide",
  });
}
