import type { Metadata } from "next";
import Link from "next/link";
import { getAllPages } from "@/lib/content-source";
import { buildSiteMetadata } from "@/lib/metadata";
import { getManagedPagePath, getPageTypeLabel } from "@/lib/managed-pages";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata({
    title: "Tüm yönetilen sayfalar",
    description: "Yönetim panelinden oluşturulan kurumsal, açılış ve editoryal sayfaların listesi.",
    path: "/sayfa",
  });
}

export default async function CmsPagesIndex() {
  const pages = await getAllPages();

  return (
    <div className="container" style={{ maxWidth: 880, margin: "0 auto", paddingTop: "2rem", paddingBottom: "4rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1>Yönetilen sayfalar</h1>
        <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
          Yönetim panelinden oluşturulan kurumsal, açılış ve editoryal sayfalar burada listelenir.
        </p>
      </header>
      <div style={{ display: "grid", gap: "1rem" }}>
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={getManagedPagePath(page.slug)}
            style={{
              display: "block",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              padding: "1.25rem 1.5rem",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            {page.pageType ? (
              <span style={{ display: "inline-block", marginBottom: "0.65rem", color: "#93c5fd", fontSize: "0.8rem", textTransform: "uppercase" }}>
                {getPageTypeLabel(page.pageType)}
              </span>
            ) : null}
            <strong style={{ display: "block", marginBottom: "0.5rem", color: "#fff" }}>{page.title}</strong>
            <span style={{ color: "var(--text-muted)" }}>{page.description}</span>
            <span style={{ display: "block", marginTop: "0.8rem", color: "#93c5fd", fontSize: "0.85rem" }}>
              {getManagedPagePath(page.slug)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
