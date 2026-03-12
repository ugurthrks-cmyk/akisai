import Link from "next/link";
import { getAllCategories, getAllGuides, getAllPages, getAllTools } from "@/lib/content-source";
import type { Metadata } from "next";
import { buildSiteMetadata } from "@/lib/metadata";
import { getManagedPagePath } from "@/lib/managed-pages";
import "./arama.css";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata({
    title: "Arama sonuçları",
    description: "Platformdaki yapay zekâ araçları, rehberler ve sayfalar içinde arama yapın.",
    path: "/arama",
    noIndex: true,
  });
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q.toLowerCase() : "";

  if (!query) {
    return (
      <div className="container" style={{ padding: "4rem 2rem", minHeight: "60vh" }}>
        <header style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>Arama yapın</h1>
          <p style={{ color: "#94a3b8", maxWidth: 720, lineHeight: 1.7 }}>
            Araç adı, kategori, rehber başlığı, sayfa başlığı veya açıklama ile arama yapabilirsiniz.
            Bu sayfa dizine alınmaz; yalnızca kullanıcı arama deneyimi için kullanılır.
          </p>
        </header>
      </div>
    );
  }

  const [aiTools, guides, pages, categories] = await Promise.all([
    getAllTools(),
    getAllGuides(),
    getAllPages(),
    getAllCategories(),
  ]);

  const formattedTools = aiTools.map((tool) => ({ ...tool, type: "ai" as const }));
  const formattedGuides = guides.map((guide) => ({ ...guide, type: "rehber" as const }));
  const formattedPages = pages.map((page) => ({ ...page, type: "sayfa" as const }));
  const formattedCategories = categories.map((category) => ({ ...category, type: "kategori" as const }));
  const allContent = [...formattedTools, ...formattedGuides, ...formattedPages, ...formattedCategories];

  const searchResults = allContent.filter((item) => {
    const safeTitle = "title" in item && item.title ? String(item.title).toLowerCase() : "";
    const safeName = "name" in item && item.name ? String(item.name).toLowerCase() : "";
    const safeDesc = item.description ? String(item.description).toLowerCase() : "";
    const safeCategory = "category" in item && item.category ? String(item.category).toLowerCase() : "";
    const safeHero = "heroIntro" in item && item.heroIntro ? String(item.heroIntro).toLowerCase() : "";
    const safeTags = "tags" in item && Array.isArray(item.tags) ? item.tags.join(" ").toLowerCase() : "";

    return [safeTitle, safeName, safeDesc, safeCategory, safeHero, safeTags].some((field) =>
      field.includes(query),
    );
  });

  return (
    <div className="container" style={{ padding: "4rem 2rem", minHeight: "60vh" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          "<span style={{ color: "var(--accent-primary)" }}>{query}</span>" için arama sonuçları
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "1.2rem" }}>
          Toplam <strong>{searchResults.length}</strong> eşleşen içerik bulundu.
        </p>
      </header>

      {searchResults.length > 0 ? (
        <div className="search-results-grid" style={{ display: "grid", gap: "1.5rem" }}>
          {searchResults.map((result, i) => (
            <Link
              href={
                result.type === "sayfa"
                  ? getManagedPagePath(result.slug)
                  : result.type === "kategori"
                    ? `/kategori/${result.slug}`
                    : `/${result.type}/${result.slug}`
              }
              key={`${result.slug}-${i}`}
              className="search-result-card"
              style={{
                textDecoration: "none",
                display: "block",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "1.5rem 2rem",
                borderRadius: "12px",
                transition: "border-color 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.8rem" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    background:
                      result.type === "ai"
                        ? "rgba(56, 189, 248, 0.18)"
                        : result.type === "rehber"
                          ? "rgba(16, 185, 129, 0.2)"
                          : result.type === "kategori"
                            ? "rgba(168, 85, 247, 0.2)"
                            : "rgba(245, 158, 11, 0.18)",
                    color:
                      result.type === "ai"
                        ? "#7dd3fc"
                        : result.type === "rehber"
                          ? "#6ee7b7"
                          : result.type === "kategori"
                            ? "#d8b4fe"
                            : "#fcd34d",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {result.type === "ai"
                    ? "ARAÇ İNCELEMESİ"
                    : result.type === "rehber"
                      ? "REHBER"
                      : result.type === "kategori"
                        ? "KATEGORİ"
                        : "SAYFA"}
                </span>
                <h2 style={{ fontSize: "1.4rem", color: "#fff", margin: 0 }}>
                  {"name" in result && result.name
                    ? result.name
                    : "title" in result && result.title
                      ? result.title
                      : result.slug}
                </h2>
              </div>
              <p style={{ color: "#a1a1aa", lineHeight: "1.6", margin: 0 }}>{result.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "2rem",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Sonuç bulunamadı</h2>
          <p style={{ marginBottom: 0, color: "#a1a1aa", lineHeight: 1.7 }}>
            Bu sorgu için henüz eşleşen araç, rehber veya sayfa yok. Daha genel bir kelimeyle arayın
            ya da kategori merkezlerine göz atın.
          </p>
        </div>
      )}
    </div>
  );
}
