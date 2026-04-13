import React from "react";
import type { Metadata } from "next";
import AtomicAnswer from "@/components/AtomicAnswer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Yayın Öncesi İnceleme Sayfası",
  description: "Yayına açılmayan, yalnızca iç denetim için kullanılan örnek sayfa.",
  path: "/ai/example-tool",
  noIndex: true,
});

export default function ExampleToolPage() {
  const answerContent =
    "Bu sayfa, yayına alınmadan önce içerik düzeni, şema işaretlemesi ve görsel hiyerarşiyi denetlemek için kullanılır. Kullanıcılara açık bir içerik değildir; yalnızca tasarım ve yapı kontrolü için tutulur.";

  const softwareSchema = {
    name: "E-Ticaret Ürün Görseli Araçları",
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Yapay Zeka Destekli Fotoğraf Aracı Rehberi",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
  };

  return (
    <>
      <SchemaMarkup type="SoftwareApplication" data={softwareSchema} />

      <article className="tool-article">
        <header>
          <h1>İç Denetim Araç Sayfası</h1>
          <div className="metadata-row">
            <span className="tag highlight">Denetim</span>
            <span className="tag">E-ticaret</span>
            <span className="tag">Görsel üretim</span>
            <span className="tag" style={{ color: "var(--accent-success)" }}>
              Puan: 9.2/10
            </span>
          </div>
          <p className="hero-subtitle">
            Bu taslak, araç sayfalarında kullanılan üst alan, özet kutusu ve örnek içerik bloklarının iç denetimini
            yapmak için tutulur.
          </p>
        </header>

        <section className="atomic-answer-wrapper">
          <AtomicAnswer title="İnceleme Notu" content={answerContent} />
        </section>

        <section className="tool-content card">
          <h3>Bu sayfa ne için kullanılır?</h3>
          <p>
            Bu örnek rota, yayına açılmayan içeriklerde başlık kurgusunu, bilgi hiyerarşisini ve şema işaretlemelerini
            kontrol etmek için ayrılmıştır. Kullanıcıya dönük kalıcı bir kütüphane sayfası değildir.
          </p>

          <h3>Denetlenen unsurlar</h3>
          <ul>
            <li>
              <strong>Başlık yapısı:</strong> Sayfa başlığı, özet paragrafı ve etiket alanlarının birlikte nasıl
              göründüğü kontrol edilir.
            </li>
            <li>
              <strong>Şema doğruluğu:</strong> Yazılım işaretlemesinin gereksiz alan üretmeden çalışıp çalışmadığı
              incelenir.
            </li>
          </ul>
        </section>
      </article>
    </>
  );
}
