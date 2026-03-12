import type { StructureResolver } from "sanity/structure";
import { singletonTypes } from "@/sanity/singletons";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("AkışAI İçerik Merkezi")
    .items([
      S.listItem()
        .title("Site ayarlari")
        .id("site-settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("tool").title("Arac kutuphanesi"),
      S.documentTypeListItem("guide").title("Rehberler"),
      S.documentTypeListItem("category").title("Kategori merkezleri"),
      S.documentTypeListItem("author").title("Yazar profilleri"),
      S.documentTypeListItem("page").title("Kurumsal ve landing sayfalar"),
    ]);
