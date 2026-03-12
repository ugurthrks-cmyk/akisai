export interface AuthorProfile {
  name: string;
  fullName: string;
  slug: string;
  role: string;
  university: string;
  experience: string;
  bio: string;
  metaDescription?: string;
  avatarUrl: string;
  profileUrl: string;
  profileCreatedAt: string;
  profileUpdatedAt: string;
  methodologyFocus: string;
  expertise: string[];
  credentials: string[];
  sameAs: string[];
}

export const authors = {
  tan: {
    name: "Tan",
    fullName: "Tan",
    slug: "tan",
    role: "Kurucu ve Kıdemli Yapay Zekâ Analisti",
    university: "İstanbul Üniversitesi, İktisat",
    experience: "5+ yıl yapay zekâ araştırması ve ürün çözümlemesi",
    bio: "İstanbul Üniversitesi İktisat mezunu olan Tan, son beş yılını yapay zekâ araçlarının iş süreçlerine uyarlanması, fiyat-performans çözümlemeleri ve Türkiye pazarına uygun kullanım senaryoları üzerine çalışarak geçirmiştir. Akış'ta editoryal standartları, inceleme çerçevesini ve kaynak doğrulama disiplinini yönetir.",
    metaDescription:
      "Tan’ın yapay zekâ araç değerlendirmeleri, Türkiye pazarı çözümlemeleri ve editoryal yaklaşımı.",
    avatarUrl: "/authors/tan.svg",
    profileUrl: "https://akisai.com.tr/yazar/tan",
    profileCreatedAt: "2026-03-10",
    profileUpdatedAt: "2026-03-11",
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
    sameAs: [],
  },
  batuhan: {
    name: "Batuhan",
    fullName: "Batuhan Arı",
    slug: "batuhan",
    role: "Yapay Zekâ ve Otomasyon Mühendisi",
    university: "TED Üniversitesi, Endüstri Mühendisliği",
    experience: "5+ yıl yapay zekâ otomasyon mimarisi",
    bio: "TED Üniversitesi Endüstri Mühendisliği mezunu olan Batuhan Arı, yapay zekâ araçlarıyla otomasyon kurguları, entegrasyon tasarımı ve operasyonel verimlilik odaklı iş akışları geliştirme konusunda uzmanlaşmıştır. Akış'ta özellikle rehber içeriklerini, kodsuz entegrasyon senaryolarını ve uygulamalı otomasyon kurgularını yönetir.",
    metaDescription:
      "Batuhan Arı’nın otomasyon rehberleri, entegrasyon senaryoları ve uygulamalı yapay zekâ kurguları.",
    avatarUrl: "/authors/batuhan.svg",
    profileUrl: "https://akisai.com.tr/yazar/batuhan",
    profileCreatedAt: "2026-03-10",
    profileUpdatedAt: "2026-03-11",
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
    sameAs: [],
  },
} satisfies Record<string, AuthorProfile>;

export type AuthorKey = keyof typeof authors;
