import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/site-settings";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export const socialImageContentType = "image/png";

type SocialImageVariant = "tool" | "guide";

type BuildContentSocialImageOptions = {
  title: string;
  description?: string;
  category?: string;
  variant: SocialImageVariant;
};

function clampText(value: string | undefined, limit: number) {
  if (!value) {
    return "";
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(limit - 1, 0)).trim()}...`;
}

function getVariantLabel(variant: SocialImageVariant) {
  return variant === "tool" ? "Arac Incelemesi" : "Nasil Kullanilir Rehberi";
}

function getVariantAccent(variant: SocialImageVariant) {
  return variant === "tool"
    ? { primary: "#0f766e", soft: "#99f6e4" }
    : { primary: "#2563eb", soft: "#bfdbfe" };
}

export async function buildContentSocialImage({
  title,
  description,
  category,
  variant,
}: BuildContentSocialImageOptions) {
  const settings = await getSiteSettings();
  const accent = getVariantAccent(variant);
  const safeTitle = clampText(title, 90);
  const safeDescription = clampText(description, 160);
  const safeCategory = clampText(category, 36);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #f7f1e4 0%, #f3ebda 52%, #efe5d0 100%)",
          color: "#112032",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(15, 118, 110, 0.12), transparent 28%), radial-gradient(circle at bottom left, rgba(37, 99, 235, 0.1), transparent 34%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "56px 64px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: accent.primary,
                  boxShadow: `0 0 0 8px ${accent.soft}`,
                }}
              />
              {settings.name}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: `2px solid ${accent.soft}`,
                color: accent.primary,
                background: "rgba(255, 255, 255, 0.78)",
                borderRadius: 999,
                padding: "12px 20px",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {getVariantLabel(variant)}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              maxWidth: "86%",
            }}
          >
            {safeCategory ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: accent.primary,
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: accent.primary,
                  }}
                />
                {safeCategory}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                fontSize: 68,
                fontWeight: 800,
                lineHeight: 1.04,
                letterSpacing: "-0.04em",
              }}
            >
              {safeTitle}
            </div>

            {safeDescription ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 28,
                  lineHeight: 1.34,
                  color: "#324255",
                  maxWidth: "92%",
                }}
              >
                {safeDescription}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#324255",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {settings.url.replace(/^https?:\/\//, "")}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: accent.primary,
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              Guncel sosyal onizleme
            </div>
          </div>
        </div>
      </div>
    ),
    socialImageSize,
  );
}
