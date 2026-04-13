import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/content-source";
import {
  buildContentSocialImage,
  socialImageContentType as contentType,
  socialImageSize as size,
} from "@/lib/social-image";

type ToolSocialImageProps = {
  params: Promise<{ slug: string }>;
};

export { contentType, size };

export default async function OpenGraphImage({ params }: ToolSocialImageProps) {
  const resolvedParams = await params;
  const tool = await getToolBySlug(resolvedParams.slug);

  if (!tool) {
    notFound();
  }

  return buildContentSocialImage({
    title: tool.h1 || tool.title || `${tool.name} incelemesi`,
    description: tool.metaDescription || tool.heroIntro || tool.description,
    category: tool.category,
    variant: "tool",
  });
}
