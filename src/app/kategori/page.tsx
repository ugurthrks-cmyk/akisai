import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/content-source";
import { buildSiteMetadata } from "@/lib/metadata";
import "./[slug]/category.css";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata({
    title: "Yapay zekâ kategorileri | Sektörel araç merkezleri",
    description: "Akış platformundaki yapay zekâ yazılımlarını sektörel merkezler altında keşfedin.",
    path: "/kategori",
  });
}

export default async function GlobalCategoriesHub() {
  const categories = await getAllCategories();

  return (
    <div className="container category-container">
      <header className="category-header">
        <h1 className="category-title">Sektörel yapay zekâ kategorileri</h1>
        <p className="category-description">
          İş modelinize en uygun aracı bulmak için kategori merkezlerini kullanın. Her merkezde
          ilgili araçlar, açıklamalar ve yönlendirici içerikler bir araya gelir.
        </p>
      </header>

      <section className="category-tools-grid">
        {categories.map((cat) => (
          <Link href={`/kategori/${cat.slug}`} key={cat.slug} style={{ textDecoration: "none" }}>
            <div className="category-tool-card tool-card-content">
              {cat.iconUrl ? (
                <div className="category-list-icon">
                  <Image src={cat.iconUrl} alt={cat.iconAlt || `${cat.name} ikonu`} width={48} height={48} />
                </div>
              ) : null}
              <h2 className="tool-card-title" style={{ marginBottom: "1rem" }}>
                {cat.name}
              </h2>
              <p className="tool-card-desc" style={{ marginBottom: "0" }}>
                {cat.description}
              </p>
              <div
                style={{
                  marginTop: "1.2rem",
                  color: "var(--accent-primary)",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                }}
              >
                İncele <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
