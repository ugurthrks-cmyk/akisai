import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { Fragment, type ReactNode } from "react";
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
  editorNote?: boolean;
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

type PromptItem = {
  key: string;
  title: string;
  content: string;
};

type PromptLibraryChunk = {
  kind: "promptLibrary";
  key: string;
  heading: string;
  introBlocks: PortableTextBlock[];
  items: PromptItem[];
};

type RenderChunk = TableChunk | BlocksChunk | PromptLibraryChunk;

function getBlockText(block: PortableTextLikeBlock) {
  return (block.children ?? [])
    .map((child) => (typeof child.text === "string" ? child.text : ""))
    .join("")
    .trim();
}

function isPromptLibraryHeading(text: string) {
  return text.toLocaleLowerCase("tr-TR").startsWith("prompt k");
}

function isPromptTitle(text: string) {
  return text.toLocaleLowerCase("tr-TR").endsWith("promptu");
}

function getBlocksText(blocks: PortableTextBlock[]) {
  return blocks
    .map((block) => getBlockText(block as PortableTextLikeBlock))
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

const promptFieldLabels = [
  "Orijinal hedef kitle:",
  "Yeni hedef kitle:",
  "İstenen slayt sayısı:",
  "Çıktıyı şu formatta ver:",
  "Çıktıyı iki sütunlu gibi düşün:",
  "Lütfen aşağıdakileri güncelle:",
  "Her slayt için öner:",
  "İstenen çıktı:",
  "Sunum süresi:",
  "Toplam süre:",
  "Sunum dili:",
  "İstenen ton:",
  "Ürün/Hizmet:",
  "Hedef kitle:",
  "Katılımcılar:",
  "Sunum türü:",
  "Marka tonu:",
  "Renk paleti:",
  "Aspect ratio:",
  "Slayt başlığı:",
  "Ana mesaj:",
  "İstenen tarz:",
  "Slaytlar:",
  "Kurallar:",
  "Sunum:",
  "Metin:",
  "Konu:",
  "Amaç:",
  "Hedef:",
  "Seviye:",
  "Yapı:",
  "Veri:",
  "Kaçın:",
].sort((left, right) => right.length - left.length);

const normalizedPromptFieldLabels = [
  "Orijinal hedef kitle:",
  "Yeni hedef kitle:",
  "\u0130stenen slayt say\u0131s\u0131:",
  "\u00c7\u0131kt\u0131y\u0131 \u015fu formatta ver:",
  "\u00c7\u0131kt\u0131y\u0131 iki s\u00fctunlu gibi d\u00fc\u015f\u00fcn:",
  "L\u00fctfen a\u015fa\u011f\u0131dakileri g\u00fcncelle:",
  "Her slayt i\u00e7in:",
  "Her slayt i\u00e7in \u00f6ner:",
  "\u0130stenen \u00e7\u0131kt\u0131:",
  "Sunum s\u00fcresi:",
  "Toplam s\u00fcre:",
  "Sunum dili:",
  "\u0130stenen ton:",
  "\u00dcr\u00fcn/Hizmet:",
  "Hedef kitle:",
  "Kat\u0131l\u0131mc\u0131lar:",
  "Sunum t\u00fcr\u00fc:",
  "Marka tonu:",
  "Renk paleti:",
  "Aspect ratio:",
  "Slayt ba\u015fl\u0131\u011f\u0131:",
  "Ana mesaj:",
  "\u0130stenen tarz:",
  "Slaytlar:",
  "Kurallar:",
  "Sunum:",
  "Metin:",
  "Konu:",
  "Ama\u00e7:",
  "Hedef:",
  "Seviye:",
  "Yap\u0131:",
  "Veri:",
  "Ka\u00e7\u0131n:",
].sort((left, right) => right.length - left.length);

function getPromptFieldLabel(text: string) {
  return normalizedPromptFieldLabels.find((label) => text.startsWith(label));
}

function insertLineBreaksOutsideBrackets(text: string) {
  let result = "";
  let bracketDepth = 0;

  for (let index = 0; index < text.length; index += 1) {
    const currentChar = text[index];

    if (currentChar === "[") {
      bracketDepth += 1;
      result += currentChar;
      continue;
    }

    if (currentChar === "]") {
      bracketDepth = Math.max(0, bracketDepth - 1);
      result += currentChar;
      continue;
    }

    if (currentChar === " " && bracketDepth === 0) {
      const remaining = text.slice(index + 1);

      if (getPromptFieldLabel(remaining) || /^\d+\)\s/.test(remaining)) {
        result += "\n";
        continue;
      }
    }

    result += currentChar;
  }

  return result;
}

function formatPromptLineValue(text: string) {
  return text
    .replace(/\s+(?=\d+\)\s)/g, "\n")
    .replace(/-\s+/g, "\n- ")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatPromptSegment(text: string) {
  const sourceLines = insertLineBreaksOutsideBrackets(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const normalizedLines: string[] = [];

  for (let index = 0; index < sourceLines.length; index += 1) {
    const line = sourceLines[index];
    const nextLine = sourceLines[index + 1];

    if (
      line &&
      getPromptFieldLabel(line) &&
      nextLine &&
      !getPromptFieldLabel(nextLine) &&
      !/^- /.test(nextLine) &&
      !/^\d+\)\s/.test(nextLine)
    ) {
      normalizedLines.push(
        ...insertLineBreaksOutsideBrackets(`${line} ${nextLine}`)
          .split("\n")
          .map((mergedLine) => mergedLine.trim())
          .filter(Boolean),
      );
      index += 1;
      continue;
    }

    if (line) {
      normalizedLines.push(line);
    }
  }

  return normalizedLines
    .flatMap((line) => {
      if (getPromptFieldLabel(line)) {
        return [line];
      }

      return formatPromptLineValue(line);
    })
    .join("\n");
}

function formatPromptText(text: string) {
  return text
    .split(/\s{2,}/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => formatPromptSegment(segment))
    .filter(Boolean)
    .join("\n\n");
}

function renderPromptText(text: string) {
  const lines = text.split("\n");

  return lines.map((line, lineIndex) => {
    const parts: ReactNode[] = [];
    const segments = line.split(/(\[[^\]]+\])/g);

    segments.forEach((segment, segmentIndex) => {
      if (!segment) {
        return;
      }

      if (segment.startsWith("[") && segment.endsWith("]")) {
        parts.push(
          <span key={`${lineIndex}-${segmentIndex}`} className="portable-prompt-token">
            {segment}
          </span>,
        );
        return;
      }

      parts.push(segment);
    });

    const compactLine = line.trim();
    const shouldKeepLineTogether =
      compactLine.length > 0 &&
      compactLine.length <= 72 &&
      getPromptFieldLabel(compactLine) !== undefined &&
      compactLine.includes("[") &&
      compactLine.includes("]");

    return (
      <Fragment key={`line-${lineIndex}`}>
        <span
          className={shouldKeepLineTogether ? "portable-prompt-line portable-prompt-line-tight" : "portable-prompt-line"}
        >
          {parts}
        </span>
        {lineIndex < lines.length - 1 ? <br key={`break-${lineIndex}`} /> : null}
      </Fragment>
    );
  });
}

function isEditorNoteText(text: string) {
  return text.startsWith("[EDİTÖR NOTU:");
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
    const candidateText = getBlockText(candidate);

    if (candidate.style === "h2" && isPromptLibraryHeading(candidateText)) {
      const introBlocks: PortableTextBlock[] = [];
      const items: PromptItem[] = [];
      let cursor = index + 1;

      while (cursor < value.length) {
        const block = value[cursor] as PortableTextLikeBlock;
        const text = getBlockText(block);

        if (block.style === "h2") {
          break;
        }

        if (block.style === "h3" && isPromptTitle(text)) {
          const contentBlocks: PortableTextBlock[] = [];
          const promptKey = block._key || `prompt-${cursor}`;
          cursor += 1;

          while (cursor < value.length) {
            const nextBlock = value[cursor] as PortableTextLikeBlock;
            const nextText = getBlockText(nextBlock);

            if (nextBlock.style === "h2" || (nextBlock.style === "h3" && isPromptTitle(nextText))) {
              break;
            }

            contentBlocks.push(value[cursor]);
            cursor += 1;
          }

          items.push({
            key: promptKey,
            title: text,
            content: getBlocksText(contentBlocks),
          });
          continue;
        }

        introBlocks.push(value[cursor]);
        cursor += 1;
      }

      if (items.length) {
        flushBlocks();
        chunks.push({
          kind: "promptLibrary",
          key: candidate._key || `prompt-library-${chunks.length}`,
          heading: candidateText,
          introBlocks,
          items,
        });
        index = cursor - 1;
        continue;
      }
    }

    const headers = splitPipeRow(candidateText);

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
    normal: ({ children, value }) => {
      const block = value as PortableTextLikeBlock;
      const text = getBlockText(block);

      if (block.editorNote || isEditorNoteText(text)) {
        return (
          <aside className="editor-note">
            <p>{children}</p>
          </aside>
        );
      }

      return <p>{children}</p>;
    },
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children, value }) => {
      const block = value as PortableTextLikeBlock;
      const text = getBlockText(block);

      if (text.startsWith("TL;DR:")) {
        return <blockquote>{children}</blockquote>;
      }

      return (
        <aside className="editor-note">
          <p>{children}</p>
        </aside>
      );
    },
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

        if (chunk.kind === "promptLibrary") {
          return (
            <section key={chunk.key} className="portable-prompt-library" aria-label={chunk.heading}>
              <div className="portable-prompt-library-header">
                <h2>{chunk.heading}</h2>
                {chunk.introBlocks.length ? (
                  <PortableText value={chunk.introBlocks} components={portableTextComponents} />
                ) : null}
              </div>

              <div className="portable-prompt-list">
                {chunk.items.map((item) => (
                  <section key={item.key} className="portable-prompt-item">
                    <h3>{item.title}</h3>
                    <pre className="portable-prompt-card">
                      <code>{renderPromptText(formatPromptText(item.content))}</code>
                    </pre>
                  </section>
                ))}
              </div>
            </section>
          );
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
