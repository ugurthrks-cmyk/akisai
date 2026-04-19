import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { getExternalLinkProps, isExternalHref } from "@/lib/link-utils";
import { urlForImage } from "@/sanity/lib/image";

type PortableTextContentProps = {
  value: PortableTextBlock[];
};

type PortableTextChild = {
  _key?: string;
  _type?: string;
  text?: string;
};

type PortableTextLikeBlock = PortableTextBlock & {
  _key?: string;
  style?: string;
  listItem?: string;
  children?: PortableTextChild[];
};

type TableChunk = {
  kind: "table";
  key: string;
  variant: "pricing" | "alternatives" | "generic";
  headers: string[];
  rows: Array<{
    key: string;
    cells: string[];
  }>;
};

type BlocksChunk = {
  kind: "blocks";
  key: string;
  blocks: PortableTextBlock[];
};

type RenderChunk = TableChunk | BlocksChunk;

function getBlockText(block: PortableTextLikeBlock) {
  return (block.children ?? [])
    .map((child) => (typeof child.text === "string" ? child.text : ""))
    .join("")
    .trim();
}

function splitPipeRow(text: string) {
  const parts = text
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length >= 3 ? parts : null;
}

function buildRenderChunks(value: PortableTextBlock[]): RenderChunk[] {
  const chunks: RenderChunk[] = [];
  let bufferedBlocks: PortableTextBlock[] = [];

  const flushBlocks = () => {
    if (!bufferedBlocks.length) {
      return;
    }

    chunks.push({
      kind: "blocks",
      key: `blocks-${chunks.length}`,
      blocks: bufferedBlocks,
    });
    bufferedBlocks = [];
  };

  for (let index = 0; index < value.length; index += 1) {
    const candidate = value[index] as PortableTextLikeBlock;
    const headers = splitPipeRow(getBlockText(candidate));

    if (candidate.style === "normal" && !candidate.listItem && headers) {
      const rows: TableChunk["rows"] = [];
      let cursor = index + 1;

      while (cursor < value.length) {
        const rowBlock = value[cursor] as PortableTextLikeBlock;
        const cells = splitPipeRow(getBlockText(rowBlock));

        if (rowBlock.listItem !== "bullet" || !cells || cells.length !== headers.length) {
          break;
        }

        rows.push({
          key: rowBlock._key || `row-${cursor}`,
          cells,
        });
        cursor += 1;
      }

      if (rows.length >= 2) {
        const firstHeader = headers[0]?.toLocaleLowerCase("tr-TR");
        const variant =
          firstHeader === "plan"
            ? "pricing"
            : firstHeader === "rakip"
              ? "alternatives"
              : "generic";

        flushBlocks();
        chunks.push({
          kind: "table",
          key: candidate._key || `table-${chunks.length}`,
          variant,
          headers,
          rows,
        });
        index = cursor - 1;
        continue;
      }
    }

    bufferedBlocks.push(value[index]);
  }

  flushBlocks();
  return chunks;
}

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

  const chunks = buildRenderChunks(value);

  return (
    <>
      {chunks.map((chunk) => {
        if (chunk.kind === "blocks") {
          return <PortableText key={chunk.key} value={chunk.blocks} components={portableTextComponents} />;
        }

        const [titleHeader, ...detailHeaders] = chunk.headers;

        if (chunk.variant === "pricing") {
          return (
            <section key={chunk.key} className="portable-pricing-table" aria-label={titleHeader}>
              <div className="portable-pricing-desktop">
                <table>
                  <thead>
                    <tr>
                      {chunk.headers.map((header) => (
                        <th key={`${chunk.key}-${header}`}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chunk.rows.map((row) => {
                      const isRecommended = row.cells[0]?.toLocaleLowerCase("tr-TR").includes("google ai pro");

                      return (
                      <tr
                        key={row.key}
                        className={isRecommended ? "portable-pricing-row-recommended" : undefined}
                      >
                        {row.cells.map((cell, cellIndex) => (
                          <td key={`${row.key}-${cellIndex}`}>
                            {cellIndex === 0 ? <strong>{cell}</strong> : cell}
                          </td>
                        ))}
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>

              <div className="portable-pricing-mobile">
                {chunk.rows.map((row) => {
                  const [title, ...details] = row.cells;
                  const isRecommended = title.toLocaleLowerCase("tr-TR").includes("google ai pro");

                  return (
                    <article
                      key={row.key}
                      className={`portable-compare-card portable-compare-card-pricing${
                        isRecommended ? " portable-compare-card-recommended" : ""
                      }`}
                    >
                      <h3>{title}</h3>
                      <dl>
                        {detailHeaders.map((label, detailIndex) => (
                          <div key={`${row.key}-${label}`} className="portable-compare-row">
                            <dt>{label}</dt>
                            <dd>{details[detailIndex] || ""}</dd>
                          </div>
                        ))}
                      </dl>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        }

        if (chunk.variant === "alternatives") {
          return (
            <section key={chunk.key} className="portable-alternatives-list" aria-label={titleHeader}>
              {chunk.rows.map((row) => {
                const [title, ...details] = row.cells;

                return (
                  <article key={row.key} className="portable-alternative-item">
                    <h3>{title}</h3>
                    <dl>
                      {detailHeaders.map((label, detailIndex) => (
                        <div key={`${row.key}-${label}`} className="portable-alternative-row">
                          <dt>{label}</dt>
                          <dd>{details[detailIndex] || ""}</dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                );
              })}
            </section>
          );
        }

        return (
          <section key={chunk.key} className="portable-compare-grid" aria-label={titleHeader}>
            {chunk.rows.map((row) => {
              const [title, ...details] = row.cells;

              return (
                <article key={row.key} className="portable-compare-card">
                  <h3>{title}</h3>
                  <dl>
                    {detailHeaders.map((label, detailIndex) => (
                      <div key={`${row.key}-${label}`} className="portable-compare-row">
                        <dt>{label}</dt>
                        <dd>{details[detailIndex] || ""}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              );
            })}
          </section>
        );
      })}
    </>
  );
}
