import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/site-settings";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const revalidate = 86400;

export default async function OpenGraphImage() {
  const settings = await getSiteSettings();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #081120 0%, #12243d 55%, #1a365d 100%)",
          color: "#f8fafc",
          padding: "64px",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              background: "#38bdf8",
            }}
          />
          {settings.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>
            Türkiye’nin yapay zekâ rehberi ve araç kütüphanesi
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              maxWidth: 920,
              color: "#cbd5e1",
            }}
          >
            Bağımsız araç incelemeleri, uygulamalı kullanım rehberleri ve kategori bazlı yapay
            zekâ araştırmaları.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
