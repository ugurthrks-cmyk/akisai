export const coreCategoryTaxonomy = [
  {
    slug: "yapay-zeka-asistanlari",
    name: "Yapay Zeka Asistanları",
    heroLabel: "Yapay Zeka Asistanları",
  },
  {
    slug: "video-duzenleme",
    name: "Video Düzenleme",
    heroLabel: "Yapay Zeka ile Video Düzenleme",
  },
  {
    slug: "video-olusturma",
    name: "Video Oluşturma",
    heroLabel: "Yapay Zeka ile Video Oluşturma",
  },
  {
    slug: "is-akisi-otomasyonu",
    name: "İş Akışı Otomasyonu",
    heroLabel: "Yapay Zeka ile İş Akışı Otomasyonu",
  },
  {
    slug: "gorsel-olusturma",
    name: "Görsel Oluşturma",
    heroLabel: "Yapay Zeka ile Görsel Oluşturma",
  },
  {
    slug: "ses-olusturma",
    name: "Ses Oluşturma",
    heroLabel: "Yapay Zeka ile Ses Oluşturma",
  },
  {
    slug: "logo-tasarimi",
    name: "Logo Tasarımı",
    heroLabel: "Yapay Zeka ile Logo Tasarımı",
  },
] as const;

export const retiredCategorySlugs = new Set(["video-ai", "otomasyon", "video-duzenleme-ve-kurgu"]);

const categoryOrder: Map<string, number> = new Map(coreCategoryTaxonomy.map((category, index) => [category.slug, index]));

export function sortCategoriesByTaxonomy<T extends { slug: string }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftIndex = categoryOrder.get(left.slug);
    const rightIndex = categoryOrder.get(right.slug);

    if (leftIndex === undefined && rightIndex === undefined) {
      return left.slug.localeCompare(right.slug, "tr");
    }

    if (leftIndex === undefined) {
      return 1;
    }

    if (rightIndex === undefined) {
      return -1;
    }

    return leftIndex - rightIndex;
  });
}
