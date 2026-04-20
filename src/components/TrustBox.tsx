import Link from "next/link";
import type { SourceItem } from "@/lib/content-source";
import "./content-signals.css";

export type TrustBoxItem = {
  label: string;
  value: string;
  href?: string;
};

interface TrustBoxProps {
  items?: TrustBoxItem[];
  sources?: SourceItem[];
  title?: string;
  lastVerified?: string;
  verificationNotes?: string;
}

export default function TrustBox({
  items,
  sources,
  title = "Kaynaklar ve doğrulama",
  lastVerified,
  verificationNotes,
}: TrustBoxProps) {
  const visibleItems =
    items?.filter(
      (item) => item.value.trim().length > 0 && item.label.trim().toLocaleLowerCase("tr-TR") !== "kategori",
    ) ?? [];
  const hasSources = Boolean(lastVerified) || Boolean(sources && sources.length > 0);

  if (visibleItems.length === 0 && !hasSources) {
    return null;
  }

  return (
    <>
      {visibleItems.length > 0 ? (
        <div className="content-signal-grid">
          {visibleItems.map((item) => (
            <div key={`${item.label}-${item.value}`} className="content-signal-card">
              <span className="content-signal-label">{item.label}</span>
              <div className="content-signal-value">
                {item.href ? <Link href={item.href}>{item.value}</Link> : item.value}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {hasSources ? (
        <section className="source-section" aria-labelledby="source-heading">
          {lastVerified ? (
            <div
              className="source-verification-badge"
              title={verificationNotes || `Son doğrulama: ${lastVerified}`}
              aria-label={verificationNotes || `Son doğrulama: ${lastVerified}`}
            >
              <span className="source-verification-label">Doğrulama</span>
              <strong>{lastVerified}</strong>
            </div>
          ) : null}
          <h2 id="source-heading">{title}</h2>
          <p>
            Bu sayfadaki tarih, fiyat, özellik ve kullanım akışı iddiaları mümkün olduğunca birincil kaynaklarla çapraz
            kontrol edilmiştir.
          </p>
          {sources && sources.length > 0 ? (
            <ol className="source-list">
              {sources.map((source) => (
                <li key={source.url}>
                  {source.publisher ? (
                    <>
                      <span className="source-publisher">{source.publisher}</span>
                      {" - "}
                    </>
                  ) : null}
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.label}
                  </a>
                </li>
              ))}
            </ol>
          ) : null}
        </section>
      ) : null}
    </>
  );
}
