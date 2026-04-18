import type { StructureResolver } from "sanity/structure";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("AkışAI İçerik Merkezi")
    .items([
      S.listItem()
        .title("Site ayarları")
        .id("site-settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("tool").title("Araç kütüphanesi"),
      S.documentTypeListItem("comparison").title("Karşılaştırmalar"),
      S.documentTypeListItem("guide").title("Rehberler"),
      S.documentTypeListItem("category").title("Kategori merkezleri"),
      S.documentTypeListItem("author").title("Yazar profilleri"),
      S.documentTypeListItem("page").title("Kurumsal ve landing sayfaları"),
    ]);
