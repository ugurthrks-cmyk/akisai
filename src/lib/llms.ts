import { absoluteUrl } from "@/lib/content";
import { getAllComparisons, getAllGuides, getAllTools } from "@/lib/content-source";
import { getSiteSettings } from "@/lib/site-settings";

type ListedItem = {
  name: string;
  url: string;
  description?: string;
};

type LlmsContentIndex = {
  tools: ListedItem[];
  guides: ListedItem[];
  comparisons: ListedItem[];
};

async function getContentIndex(baseUrl: string): Promise<LlmsContentIndex> {
  try {
    const [tools, guides, comparisons] = await Promise.all([
      getAllTools(),
      getAllGuides(),
      getAllComparisons(),
    ]);

    return {
      tools: tools.map((tool) => ({
        name: tool.h1 || tool.title || tool.name,
        url: tool.canonicalUrl || absoluteUrl(`/incelemeler/${tool.slug}`, baseUrl),
        description: tool.description,
      })),
      guides: guides.map((guide) => ({
        name: guide.h1 || guide.title,
        url: guide.canonicalUrl || absoluteUrl(`/rehber/${guide.slug}`, baseUrl),
        description: guide.description,
      })),
      comparisons: comparisons.map((comparison) => ({
        name: comparison.h1 || comparison.title,
        url: comparison.canonicalUrl || absoluteUrl(`/karsilastirma/${comparison.slug}`, baseUrl),
        description: comparison.description,
      })),
    };
  } catch {
    return {
      tools: [],
      guides: [],
      comparisons: [],
    };
  }
}

function getCoverageLine(tools: ListedItem[]) {
  if (tools.length === 0) {
    return "AkışAI, Türkiye'deki kullanıcılar için yapay zeka araçları incelemeleri, karşılaştırmaları ve rehberleri yayınlar.";
  }

  const toolNames = tools.map((tool) => tool.name).sort((left, right) => left.localeCompare(right, "tr"));
  return `AkışAI şu yapay zeka araçlarını kapsar: ${toolNames.join(", ")}.`;
}

function toBulletList(items: ListedItem[]) {
  return items.map((item) => `- [${item.name}](${item.url})${item.description ? `: ${item.description}` : ""}`);
}

export async function buildLlmsTxt() {
  const settings = await getSiteSettings();
  const contentIndex = await getContentIndex(settings.url);

  const sections = [
    `# ${settings.name}`,
    `> ${settings.description}`,
    "",
    `${settings.name}, Türkiyeli kullanıcılar için yapay zeka araçlarını objektif olarak inceleyen, fiyat ve özellikleri doğrulanmış, editör tarafından test edilmiş bir yayındır.`,
    "",
    "## Ana içerik türleri",
    "",
    `- [İncelemeler](${absoluteUrl("/incelemeler", settings.url)}): Yapay zeka araçlarının derinlemesine değerlendirmeleri`,
    `- [Nasıl Kullanılır Rehberleri](${absoluteUrl("/rehber", settings.url)}): Adım adım kullanım kılavuzları`,
    `- [Karşılaştırmalar](${absoluteUrl("/karsilastirma", settings.url)}): İki veya daha fazla aracı senaryo bazlı karşılaştırma`,
    "",
    "## Kapsam",
    "",
    getCoverageLine(contentIndex.tools),
    "",
    "## Editoryal politika",
    "",
    "- Tüm fiyatlar Türkiye pazarı için doğrulanır ve son doğrulama tarihi ilgili içeriklerde belirtilir",
    "- Ödeme bilgileri Türkiye kullanıcıları için kontrol edilir",
    "- KVKK uyumu, erişim koşulları ve yerelleştirme notları ilgili içeriklerde belirtilir",
    "",
    "## llms-full.txt",
    "",
    `Daha detaylı yapılı veri: ${absoluteUrl("/llms-full.txt", settings.url)}`,
    "",
  ];

  return sections.join("\n");
}

export async function buildLlmsFullTxt() {
  const settings = await getSiteSettings();
  const contentIndex = await getContentIndex(settings.url);

  const sections = [
    `# ${settings.name} llms-full`,
    "",
    `Site: ${settings.url}`,
    `Açıklama: ${settings.organizationDescription}`,
    `Odak konuları: ${settings.organizationKnowsAbout.join(", ")}`,
    `Diller: ${settings.organizationLanguages.join(", ")}`,
    `Hizmet bölgeleri: ${settings.organizationAreasServed.join(", ")}`,
    "",
    "## İncelemeler",
    "",
    ...(contentIndex.tools.length > 0
      ? toBulletList(contentIndex.tools)
      : ["- İnceleme listesi şu anda kullanılamıyor."]),
    "",
    "## Rehberler",
    "",
    ...(contentIndex.guides.length > 0
      ? toBulletList(contentIndex.guides)
      : ["- Rehber listesi şu anda kullanılamıyor."]),
    "",
    "## Karşılaştırmalar",
    "",
    ...(contentIndex.comparisons.length > 0
      ? toBulletList(contentIndex.comparisons)
      : ["- Karşılaştırma listesi şu anda kullanılamıyor."]),
    "",
  ];

  return sections.join("\n");
}
