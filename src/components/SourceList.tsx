import React from "react";
import "./content-signals.css";

interface SourceItem {
  label: string;
  url: string;
  publisher?: string;
}

export default function SourceList({
  sources,
  title = "Kaynaklar ve doğrulama",
  lastVerified,
  verificationNotes,
}: {
  sources?: SourceItem[];
  title?: string;
  lastVerified?: string;
  verificationNotes?: string;
}) {
  if ((!sources || sources.length === 0) && !lastVerified) {
    return null;
  }

  return (
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
        Bu sayfadaki tarih, fiyat, özellik ve kullanım akışı iddiaları mümkün
        olduğunca birincil kaynaklarla çapraz kontrol edilmiştir.
      </p>
      {sources && sources.length > 0 ? (
        <ol className="source-list">
          {sources.map((source) => (
            <li key={source.url}>
              {source.publisher && (
                <>
                  <span className="source-publisher">{source.publisher}</span>
                  {" - "}
                </>
              )}
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
