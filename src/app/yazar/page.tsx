import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllAuthors } from "@/lib/content-source";
import { absoluteUrl } from "@/lib/content";
import { buildSiteMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "./authors.css";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata({
    title: "Yazar profilleri ve editoryal kadro",
    description:
      "Yapay zeka araç incelemeleri ve nasıl kullanılır rehberlerini hazırlayan editörleri, araştırmacıları ve otomasyon uzmanlarını yakından tanıyın.",
    path: "/yazar",
  });
}

export default async function AuthorsPage() {
  const [authorList, settings] = await Promise.all([
    getAllAuthors(),
    getSiteSettings(),
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${settings.name} yazar profilleri`,
    url: absoluteUrl("/yazar", settings.url),
    inLanguage: "tr-TR",
    description: `${settings.name} içeriklerini hazırlayan editörlerin, araştırmacıların ve otomasyon uzmanlarının profil merkezi.`,
  };

  return (
    <div className="authors-hub">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <header className="authors-hub-header">
        <h1>Yazar profilleri</h1>
        <p>
          {settings.name}&apos;deki inceleme ve rehber içerikleri, belirli uzmanlık
          alanlarına göre çalışan editörler tarafından hazırlanır. Her profil
          sayfasında yazarın çalışma odağını, uzmanlık sahalarını ve yayımladığı
          içerikleri ayrıntılı biçimde inceleyebilirsiniz.
        </p>
        <p className="authors-hub-note">
          Bu merkez, içerikleri kimin test ettiğini, hangi metodolojiyle
          güncellediğini ve hangi alanlarda derinleştiğini görünür kılar.
        </p>
      </header>

      <section className="authors-grid" aria-label={`${settings.name} yazar listesi`}>
        {authorList.map((author) => (
          <Link
            href={`/yazar/${author.slug}`}
            key={author.slug}
            className="author-directory-card"
          >
            <div className="author-directory-head">
              <Image
                src={author.avatarUrl}
                alt={`${author.fullName} profil görseli`}
                width={72}
                height={72}
                className="author-directory-image"
                sizes="72px"
              />
              <div>
                <span className="author-directory-role">{author.role}</span>
                <h2>{author.fullName}</h2>
              </div>
            </div>
            <p className="author-directory-bio">{author.bio}</p>
            <div className="author-directory-meta">
              <span>{author.university}</span>
              <span>{author.experience}</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
