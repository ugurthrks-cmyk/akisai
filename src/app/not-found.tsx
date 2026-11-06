import type { Metadata } from "next";
import Link from "next/link";

// Next.js adds noindex for 404s; avoid also inheriting indexable robots metadata.
export const metadata: Metadata = {
  robots: null,
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.25rem 3rem",
      }}
    >
      <div
        style={{
          width: "min(100%, 760px)",
          textAlign: "center",
          padding: "2.25rem 1.5rem",
          borderRadius: "28px",
          background: "rgba(255, 252, 247, 0.78)",
          border: "1px solid rgba(19, 35, 47, 0.08)",
          boxShadow: "0 24px 70px rgba(19, 35, 47, 0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(5rem, 20vw, 8rem)",
            fontWeight: "900",
            color: "var(--text-base)",
            margin: 0,
            lineHeight: 1,
            textShadow: "0 18px 36px rgba(198, 106, 23, 0.14)",
          }}
        >
          404
        </h1>

        <h2
          style={{
            fontSize: "clamp(1.9rem, 5vw, 2.5rem)",
            color: "var(--text-base)",
            marginTop: "0.9rem",
            marginBottom: "1rem",
            lineHeight: 1.1,
          }}
        >
          Aradığınız sayfa bulunamadı
        </h2>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "1.15rem",
            maxWidth: "34rem",
            lineHeight: "1.75",
            margin: "0 auto 2rem",
          }}
        >
          Aradığınız içerik silinmiş, adı değişmiş ya da henüz yayımlanmamış olabilir. Ana sayfaya dönerek
          kategorilerden, rehberlerden ve araç incelemelerinden ilerleyebilirsiniz.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.9rem",
            justifyContent: "center",
          }}
        >
          <Link
            href="/"
            style={{
              minWidth: "220px",
              padding: "0.95rem 1.5rem",
              background: "linear-gradient(135deg, var(--accent-primary) 0%, #6b21a8 100%)",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 700,
              borderRadius: "16px",
              boxShadow: "0 10px 24px rgba(107, 33, 168, 0.18)",
            }}
          >
            Ana sayfaya dön
          </Link>

          <Link
            href="/kategori"
            style={{
              minWidth: "220px",
              padding: "0.95rem 1.5rem",
              background: "rgba(255, 255, 255, 0.92)",
              color: "var(--text-base)",
              textDecoration: "none",
              fontWeight: 700,
              borderRadius: "16px",
              border: "1px solid rgba(19, 35, 47, 0.12)",
              boxShadow: "0 10px 24px rgba(19, 35, 47, 0.06)",
            }}
          >
            Kategorileri keşfet
          </Link>
        </div>
      </div>
    </div>
  );
}
