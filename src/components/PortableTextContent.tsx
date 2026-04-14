import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { getExternalLinkProps, isExternalHref } from "@/lib/link-utils";
import { urlForImage } from "@/sanity/lib/image";

type PortableTextContentProps = {
  value: PortableTextBlock[];
};

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const isInternal = href.startsWith("/");

      if (isInternal) {
        return <Link href={href}>{children}</Link>;
      }

      if (isExternalHref(href)) {
        return (
          <a href={href} {...getExternalLinkProps(href)}>
            {children}
          </a>
        );
      }

      return (
        <a href={href}>{children}</a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const imageUrl = urlForImage(value).width(1440).fit("max").auto("format").url();
      const alt =
        typeof value?.alt === "string" && value.alt.trim().length > 0
          ? value.alt
          : "İçerik görseli";
      const caption = typeof value?.caption === "string" ? value.caption : undefined;

      return (
        <figure className="portable-image">
          <Image
            src={imageUrl}
            alt={alt}
            width={1440}
            height={810}
            sizes="(max-width: 768px) 100vw, 900px"
            style={{ width: "100%", height: "auto" }}
          />
          {caption ? <figcaption>{caption}</figcaption> : null}
        </figure>
      );
    },
  },
};

export default function PortableTextContent({ value }: PortableTextContentProps) {
  if (!value.length) {
    return null;
  }

  return <PortableText value={value} components={portableTextComponents} />;
}
