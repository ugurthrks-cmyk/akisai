import fs from "node:fs";
import { createClient } from "@sanity/client";

function readEnvFile(path) {
  const text = fs.readFileSync(path, "utf8");
  return Object.fromEntries(
    text
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf("=");
        return [line.slice(0, separatorIndex), line.slice(separatorIndex + 1)];
      }),
  );
}

const env = readEnvFile(".env.local");

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-02-19",
  token: env.SANITY_API_WRITE_TOKEN || env.SANITY_API_READ_TOKEN,
  useCdn: false,
});

const patches = [
  {
    id: "author.tan",
    data: {
      name: "Tan",
      fullName: "Tan",
      role: "Kurucu ve Kıdemli Yapay Zekâ Analisti",
      university: "İstanbul Üniversitesi, İktisat",
      experience: "5+ yıl yapay zekâ araştırması ve ürün çözümlemesi",
      bio: "İstanbul Üniversitesi İktisat mezunu olan Tan, son beş yılını yapay zekâ araçlarının iş süreçlerine uyarlanması, fiyat-performans çözümlemeleri ve Türkiye pazarına uygun kullanım senaryoları üzerine çalışarak geçirmiştir. Akış'ta editoryal standartları, inceleme çerçevesini ve kaynak doğrulama disiplinini yönetir.",
      methodologyFocus:
        "Araç değerlendirmelerinde fiyatlandırma, Türkçe kullanım niteliği, veri politikaları ve gerçek kullanım senaryolarını birincil kaynaklarla karşılaştırmalı biçimde doğrular.",
      expertise: [
        "Yapay zekâ araç değerlendirmesi",
        "Büyük dil modeli pazar çözümlemesi",
        "Türkiye yerelleştirmesi",
        "Fiyatlandırma araştırması",
        "İçerik operasyonları",
      ],
      credentials: [
        "İstanbul Üniversitesi İktisat",
        "5+ yıl yapay zekâ araştırması",
        "Yapay zekâ ürün çözümlemesi",
      ],
    },
  },
  {
    id: "author.batuhan",
    data: {
      name: "Batuhan",
      fullName: "Batuhan Arı",
      role: "Yapay Zekâ ve Otomasyon Mühendisi",
      university: "TED Üniversitesi, Endüstri Mühendisliği",
      experience: "5+ yıl yapay zekâ otomasyon mimarisi",
      bio: "TED Üniversitesi Endüstri Mühendisliği mezunu olan Batuhan Arı, yapay zekâ araçlarıyla otomasyon kurguları, entegrasyon tasarımı ve operasyonel verimlilik odaklı iş akışları geliştirme konusunda uzmanlaşmıştır. Akış'ta özellikle rehber içeriklerini, kodsuz entegrasyon senaryolarını ve uygulamalı otomasyon kurgularını yönetir.",
      methodologyFocus:
        "Rehber içeriklerinde kurulabilir örnekleri, tetikleyici-eylem akışlarını, fiyat planlarını ve entegrasyon sınırlarını resmî dokümanlarla doğrular.",
      expertise: [
        "İş akışı otomasyonu",
        "Zapier",
        "Kodsuz sistem mimarisi",
        "Yapay zekâ operasyonları",
        "Süreç tasarımı",
      ],
      credentials: [
        "TED Üniversitesi Endüstri Mühendisliği",
        "5+ yıl otomasyon mimarisi",
        "Kodsuz ve yapay zekâ entegrasyonları",
      ],
    },
  },
];

async function main() {
  for (const patch of patches) {
    await client.patch(patch.id).set(patch.data).commit();
    console.log(`Güncellendi: ${patch.id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
