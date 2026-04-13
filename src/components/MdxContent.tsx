import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

type MdxContentProps = {
  source: string;
};

const mdxComponents = {
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
