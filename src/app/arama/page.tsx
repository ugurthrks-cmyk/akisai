import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllCategories,
  getAllComparisons,
  getAllGuides,
  getAllPages,
  getAllTools,
} from "@/lib/content-source";
import { buildSiteMetadata } from "@/lib/metadata";
import { getManagedPagePath } from "@/lib/managed-pages";
import "./arama.css";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata({
    title: "Arama Sonuçları",
    description: "Platformdaki yapay zeka araçları, incelemeler, karşılaştırmalar, rehberler ve sayfalar içinde arama yapın.",
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
          <p style={{ color: "var(--text-muted)", maxWidth: 720, lineHeight: 1.7 }}>
            Araç adı, kategori, rehber, karşılaştırma, sayfa başlığı veya açıklama ile arama yapabilirsiniz. Bu sayfa
            dizine alınmaz; yalnızca kullanıcı arama deneyimi için kullanılır.
          </p>
        </header>
      </div>
    );
  }

  const [tools, comparisons, guides, pages, categories] = await Promise.all([
    getAllTools(),
    getAllComparisons(),
    getAllGuides(),
    getAllPages(),
    getAllCategories(),
  ]);

  const formattedTools = tools.map((tool) => ({ ...tool, type: "inceleme" as const }));
  const formattedComparisons = comparisons.map((comparison) => ({ ...comparison, type: "karsilastirma" as const }));
  const formattedGuides = guides.map((guide) => ({ ...guide, type: "rehber" as const }));
  const formattedPages = pages.map((page) => ({ ...page, type: "sayfa" as const }));
  const formattedCategories = categories.map((category) => ({ ...category, type: "kategori" as const }));
  const allContent = [...formattedTools, ...formattedComparisons, ...formattedGuides, ...formattedPages, ...formattedCategories];

  const searchResults = allContent.filter((item) => {
    const safeTitle = "title" in item && item.title ? String(item.title).toLowerCase() : "";
    const safeName = "name" in item && item.name ? String(item.name).toLowerCase() : "";
    const safeDesc = item.description ? String(item.description).toLowerCase() : "";
    const safeCategory = "category" in item && item.category ? String(item.category).toLowerCase() : "";
    const safeHero = "heroIntro" in item && item.heroIntro ? String(item.heroIntro).toLowerCase() : "";
    const safeTags = "tags" in item && Array.isArray(item.tags) ? item.tags.join(" ").toLowerCase() : "";
    const safeVerdict = "verdict" in item && item.verdict ? String(item.verdict).toLowerCase() : "";

    return [safeTitle, safeName, safeDesc, safeCategory, safeHero, safeTags, safeVerdict].some((field) =>
      field.includes(query),
    );
  });

  return (
    <div className="container" style={{ padding: "4rem 2rem", minHeight: "60vh" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          &quot;<span style={{ color: "var(--accent-primary)" }}>{query}</span>&quot; için arama sonuçları
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
          Toplam <strong>{searchResults.length}</strong> eşleşen içerik bulundu.
        </p>
      </header>

      {searchResults.length > 0 ? (
        <div className="search-results-grid" style={{ display: "grid", gap: "1.5rem" }}>
          {searchResults.map((result, index) => (
            <Link
              href={
                result.type === "sayfa"
                  ? getManagedPagePath(result.slug)
                  : result.type === "kategori"
                    ? `/kategori/${result.slug}`
                    : result.type === "karsilastirma"
                      ? `/karsilastirma/${result.slug}`
                      : result.type === "inceleme"
                        ? `/incelemeler/${result.slug}`
                        : `/${result.type}/${result.slug}`
              }
              key={`${result.slug}-${index}`}
              className="search-result-card"
              style={{
                textDecoration: "none",
                display: "block",
                background: "rgba(255, 255, 255, 0.78)",
                border: "1px solid rgba(19, 35, 47, 0.08)",
                padding: "1.5rem 2rem",
                borderRadius: "20px",
                boxShadow: "var(--shadow-soft)",
                transition: "border-color 0.2s ease, transform 0.2s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "0.8rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    background:
                      result.type === "inceleme"
                        ? "rgba(15, 118, 110, 0.12)"
                        : result.type === "karsilastirma"
                          ? "rgba(180, 83, 9, 0.12)"
                          : result.type === "rehber"
                            ? "rgba(21, 128, 61, 0.12)"
                            : result.type === "kategori"
                              ? "rgba(198, 106, 23, 0.12)"
                              : "rgba(19, 35, 47, 0.08)",
                    color:
                      result.type === "inceleme"
                        ? "var(--accent-glow)"
                        : result.type === "karsilastirma"
                          ? "#9a5a1c"
                          : result.type === "rehber"
                            ? "#166534"
                            : result.type === "kategori"
                              ? "#9a5a1c"
                              : "var(--text-light)",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {result.type === "inceleme"
                    ? "ARAÇ İNCELEMESİ"
                    : result.type === "karsilastirma"
                      ? "KARŞILAŞTIRMA"
                      : result.type === "rehber"
                        ? "REHBER"
                        : result.type === "kategori"
                          ? "KATEGORİ"
                          : "SAYFA"}
                </span>
                <h2 style={{ fontSize: "1.35rem", color: "var(--text-base)", margin: 0 }}>
                  {"name" in result && result.name
                    ? result.name
                    : "title" in result && result.title
                      ? result.title
                      : result.slug}
                </h2>
              </div>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.7", margin: 0 }}>{result.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "2rem",
            borderRadius: "20px",
            border: "1px solid rgba(19, 35, 47, 0.08)",
            background: "rgba(255, 255, 255, 0.78)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Sonuç bulunamadı</h2>
          <p style={{ marginBottom: 0, color: "var(--text-muted)", lineHeight: 1.7 }}>
            Bu sorgu için henüz eşleşen araç, karşılaştırma, rehber veya sayfa yok. Daha genel bir kelimeyle arayın ya da kategori
            merkezlerine göz atın.
          </p>
        </div>
      )}
    </div>
  );
}
