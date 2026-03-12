import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { isSanityConfigured } from "@/sanity/env";
import StudioClient from "./StudioClient";

export const metadata: Metadata = {
  title: "AkışAI Admin",
  description: "AkışAI içerik yönetim paneli.",
  robots: {
    index: false,
    follow: false,
  },
};

const shellStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 3000,
  background:
    "radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 34%), #f4f7fb",
};

export default function AdminStudioPage() {
  if (!isSanityConfigured) {
    return (
      <div style={shellStyle}>
        <div
          style={{
            maxWidth: 760,
            margin: "8vh auto",
            background: "#ffffff",
            borderRadius: 24,
            border: "1px solid rgba(8, 17, 32, 0.08)",
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
            padding: "2.5rem",
            color: "#081120",
            fontFamily: "var(--font-sans)",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.35rem 0.8rem",
              borderRadius: 999,
              background: "rgba(59, 130, 246, 0.1)",
              color: "#1d4ed8",
              fontWeight: 700,
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            Admin kurulumu gerekli
          </span>
          <h1 style={{ fontSize: "2.4rem", lineHeight: 1.1, marginBottom: "1rem" }}>
            Sanity projesi bağlanmadan admin paneli açılamaz.
          </h1>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#334155" }}>
            Bu panel canlı içerik yönetimi için tasarlandı. Devam etmek için önce bir Sanity
            projesi açın, ardından <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> ve{" "}
            <code>NEXT_PUBLIC_SANITY_DATASET</code> değerlerini `.env.local` içine ekleyin.
          </p>
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem 1.1rem",
              borderRadius: 16,
              background: "#0f172a",
              color: "#e2e8f0",
              fontFamily: "monospace",
              fontSize: "0.92rem",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id{"\n"}
            NEXT_PUBLIC_SANITY_DATASET=production{"\n"}
            SANITY_API_READ_TOKEN=optional-read-token
          </div>
          <p style={{ marginTop: "1.5rem", color: "#475569", lineHeight: 1.7 }}>
            Bu kurulum tamamlandığında `/admin` altında yazar, kategori, tool, rehber, sayfa ve
            site ayarları için profesyonel edit akışı aktif olur.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={shellStyle}>
      <StudioClient />
    </div>
  );
}
