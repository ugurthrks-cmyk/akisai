import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getExternalLinkProps, isExternalHref } from "@/lib/link-utils";

type MdxContentProps = {
  source: string;
};

const mdxComponents = {
  a: (props: React.ComponentPropsWithoutRef<"a">) => {
    const href = typeof props.href === "string" ? props.href : "";
    const { children, ...rest } = props;

    if (href.startsWith("/")) {
      return (
        <Link href={href} {...rest}>
          {children}
        </Link>
      );
    }

    if (isExternalHref(href)) {
      return (
        <a href={href} {...getExternalLinkProps(href)} {...rest}>
          {children}
        </a>
      );
    }

    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
  img: ({
    src,
    alt,
  }: {
    src?: string;
    alt?: string;
  }) => {
    if (!src) {
      return null;
    }

    return (
      <Image
        src={src}
        alt={alt?.trim() || "İçerik görseli"}
        width={1400}
        height={788}
        sizes="(max-width: 768px) 100vw, 900px"
        style={{ width: "100%", height: "auto" }}
      />
    );
  },
};

export default function MdxContent({ source }: MdxContentProps) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      }}
    />
  );
}
