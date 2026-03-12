import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^([^#=\s]+)=(.*)$/);
    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.resolve(".env.local"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error("Sanity seed icin project id, dataset ve write token gerekli.");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-03-12",
  useCdn: false,
  perspective: "published",
});

function span(text) {
  return {
    _type: "span",
    text,
    marks: [],
  };
}

function block(text, options = {}) {
  return {
    _type: "block",
    style: options.style || "normal",
    markDefs: options.markDefs || [],
    children: [span(text)],
    ...(options.listItem ? { listItem: options.listItem, level: options.level || 1 } : {}),
  };
}

function heading(text) {
  return block(text, { style: "h2" });
}

function bullet(text) {
  return block(text, { listItem: "bullet" });
}

const managedPages = [
  {
    _id: "page-hakkimizda",
    _type: "page",
    title: "Hakkımızda",
    slug: { _type: "slug", current: "hakkimizda" },
    description:
      "Türkiye'nin bağımsız ve tarafsız yapay zeka araçları kütüphanesi AkışAI'nın vizyonu, misyonu ve kurucu ekibi hakkında detaylı bilgi edinin.",
    pageType: "corporate",
    body: [
      heading("Biz Kimiz?"),
      block(
        "AkışAI; yapay zeka araştırmacılarından, veri analistlerinden ve otomasyon mühendislerinden oluşan bağımsız bir dijital yayın organıdır. Amacımız, internette her gün çoğalan binlerce AI aracı arasından gerçekten işinize yarayacak teknolojileri filtrelemek ve bunları objektif bir mercekle sunmaktır.",
      ),
      heading("Misyonumuz"),
      block(
        "Misyonumuz şeffaflık ve pratikte değerdir. Bir aracın popüler olması ya da yüksek pazarlama bütçesine sahip olması bizim için yeterli değildir. Türkiye şartlarında, Türkçe dil desteğinde ve yerel iş akışlarında ne kadar verimli çalıştığına bakarız.",
      ),
      heading("Neden Bize Güvenebilirsiniz?"),
      block(
        "AkışAI, yayınlanan hiçbir inceleme için doğrudan sponsorluk kabul etmez. Test edilen araçların lisanslarını mümkün olduğunca kendi bütçemizle kullanır, notlarımızı uygulamalı deneyime dayandırır ve sonuçları şeffaf biçimde yayımlarız.",
      ),
      heading("Ekibimiz"),
      block(
        "AkışAI'ın arkasında veri, otomasyon ve yapay zeka tarafında çalışan çekirdek bir editoryal ekip bulunur. Teknik uzmanlık detaylarını Yayın İlkeleri ve Yazar Profilleri sayfalarından inceleyebilirsiniz.",
      ),
    ],
  },
  {
    _id: "page-iletisim",
    _type: "page",
    title: "Bize Ulaşın",
    slug: { _type: "slug", current: "iletisim" },
    description:
      "AkışAI ekibiyle iletişime geçin. Soru, öneri, hata bildirimi veya işbirliği talepleriniz için resmi iletişim kanallarımız.",
    pageType: "corporate",
    body: [
      heading("Resmi İletişim Kanalları"),
      block("Uzmanlarımıza veya destek ekibimize aşağıdaki kanallardan ulaşabilirsiniz:"),
      bullet("Genel sorular ve destek: iletisim@akisai.com.tr"),
      bullet("Araç inceleme talepleri: editor@akisai.com.tr"),
      bullet("İşbirliği ve sponsorluk: partner@akisai.com.tr"),
      heading("Çalışma Saatleri"),
      block("Pazartesi - Pazar: 08:00 - 22:00"),
      block("Tüm e-postalara en geç 2 iş günü içinde dönüş sağlanır."),
    ],
  },
  {
    _id: "page-gizlilik",
    _type: "page",
    title: "Gizlilik Politikası (KVKK ve GDPR)",
    slug: { _type: "slug", current: "gizlilik" },
    description:
      "AkışAI KVKK ve GDPR uyumlu veri gizliliği politikası. Kullanıcı verilerinizin nasıl korunduğunu ve işlendiğini öğrenin.",
    pageType: "corporate",
    body: [
      heading("1. Veri Toplama ve Kullanımı"),
      block(
        "AkışAI olarak ziyaretçilerimizin gizliliğini KVKK ve GDPR ilkelerine uygun şekilde korumayı taahhüt ediyoruz. Toplanan veriler platformu iyileştirmek ve anonim analizler yapmakla sınırlıdır.",
      ),
      heading("2. Log Dosyaları ve Analitik"),
      block(
        "IP adresi, tarayıcı türü, internet servis sağlayıcısı ve giriş-çıkış sayfaları gibi temel sunucu logları analiz amacıyla kaydedilebilir. Bu veriler doğrudan kimliğinizi tespit etmeye yönelik değildir.",
      ),
      heading("3. Veri Güvenliği ve Saklama Süresi"),
      block(
        "Anonim analitik veriler güvenli sunucularda yalnızca gerekli optimizasyonlar için saklanır. Herhangi bir güvenlik ihlali riskine karşı düzenli kontroller yapılır.",
      ),
      heading("4. Dış Bağlantılar Sorumluluğu"),
      block(
        "Platformumuz üçüncü taraf araçların resmi sitelerine bağlantılar içerir. AkışAI, bu harici platformların içeriklerinden veya kendi gizlilik politikalarından sorumlu tutulamaz.",
      ),
      heading("5. Onay ve Değişiklik Hakları"),
      block(
        "Sitemizi kullanarak bu politikadaki şartları kabul etmiş sayılırsınız. Yasal gereklilikler sebebiyle bu metin önceden haber verilmeksizin güncellenebilir.",
      ),
    ],
  },
  {
    _id: "page-cerez-politikasi",
    _type: "page",
    title: "Çerez Politikası",
    slug: { _type: "slug", current: "cerez-politikasi" },
    description:
      "AkışAI çerez yönetimi politikası. Hangi çerezlerin, ne amaçla ve ne kadar süreyle cihazınızda tutulduğuna dair şeffaf bilgilendirme.",
    pageType: "corporate",
    body: [
      heading("1. Çerez Nedir?"),
      block(
        "Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza indirilen küçük metin dosyalarıdır. Sitenin doğru çalışması ve tercihlerinizi hatırlaması için kullanılır.",
      ),
      heading("2. Hangi Çerezleri Kullanıyoruz?"),
      bullet("Zorunlu çerezler: temel site işlevleri ve güvenlik için gereklidir."),
      bullet("Analitik ve performans çerezleri: hangi sayfaların nasıl kullanıldığını anonim olarak ölçer."),
      bullet("Tercih çerezleri: tema veya benzeri kullanıcı tercihlerini hatırlar."),
      heading("3. Kişisel Veriler ile İlişkisi"),
      block(
        "Kullandığımız çerezler doğrudan ad, e-posta veya ödeme bilgisi gibi kişisel verileri toplamaz. Sayfa etkileşimleri anonim tanımlayıcılar üzerinden değerlendirilir.",
      ),
      heading("4. Çerezleri Nasıl Yönetebilirsiniz?"),
      block(
        "Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Ancak zorunlu çerezlerin kapatılması sitenin bazı özelliklerinin hatalı çalışmasına neden olabilir.",
      ),
    ],
  },
  {
    _id: "page-kullanim-kosullari",
    _type: "page",
    title: "Kullanım Koşulları",
    slug: { _type: "slug", current: "kullanim-kosullari" },
    description:
      "AkışAI platformunun kullanım şartları, içerik telif hakları ve yasal sorumluluk reddi beyanları.",
    pageType: "corporate",
    body: [
      heading("1. Taraflar ve Kabul"),
      block(
        "Bu web sitesini kullanarak burada belirtilen kullanım koşullarını okuduğunuzu, anladığınızı ve hukuken kabul ettiğinizi beyan etmiş sayılırsınız. Şartları kabul etmiyorsanız platformu kullanmamalısınız.",
      ),
      heading("2. Fikri Mülkiyet ve İçerik Telif Hakları"),
      block(
        "AkışAI üzerindeki incelemeler, rehberler, görseller, site mimarisi ve kod blokları telif koruması altındadır. İçeriklerin izinsiz kopyalanması, kazınması veya başka platformlarda yayımlanması yasaktır.",
      ),
      heading("3. Sorumluluk Reddi"),
      block(
        "Platformumuz harici yapay zeka araçlarını bağımsız editoryal standartlarla inceler. Ancak üçüncü taraf yazılımların kullanımından doğabilecek veri ihlalleri, mali kayıplar veya sistem kesintilerinden AkışAI sorumlu tutulamaz.",
      ),
      heading("4. Harici Bağlantılar"),
      block(
        "Üçüncü taraf sitelere verilen bağlantılar yalnızca okuyucunun bilgiye hızlı ulaşması içindir. Bu harici platformların içerik doğruluğu, güvenliği veya yasal uygunluğu konusunda taahhüt verilmez.",
      ),
      heading("5. Değişiklik Hakkı"),
      block(
        "AkışAI yönetimi, teknolojik ve yasal gelişmelere bağlı olarak kullanım koşullarını önceden haber vermeksizin güncelleme hakkını saklı tutar.",
      ),
    ],
  },
  {
    _id: "page-yayin-ilkeleri",
    _type: "page",
    title: "Yayın ve Test İlkelerimiz",
    slug: { _type: "slug", current: "yayin-ilkeleri" },
    description:
      "AkışAI üzerinde yayınlanan yapay zeka aracı incelemelerinin şeffaflığı, test prosedürümüz ve editoryal bağımsızlık güvencemiz.",
    pageType: "corporate",
    body: [
      heading("1. Editoryal Bağımsızlık ve Sponsorluk Reddi"),
      block(
        "AkışAI, incelenen veya listelenen hiçbir yapay zeka aracı firmasından puan manipülasyonu karşılığı sponsorluk kabul etmez. Bir aracın puanı editörlerin tarafsız test sonuçlarına dayanır.",
      ),
      heading("2. Orijinal Test Zorunluluğu"),
      block(
        "Ekibimiz incelediği yazılımları mümkün olduğunca bizzat kurar, test eder ve notlarını gerçek kullanım senaryolarına göre hazırlar. Basın bülteni veya ikinci el içerik kopyalama kabul edilmez.",
      ),
      heading("3. Değerlendirme Metodolojisi"),
      block("Her AI aracı aşağıdaki ana başlıklar üzerinden değerlendirilir:"),
      bullet("Kullanıcı arayüzü ve ilk kullanım deneyimi"),
      bullet("Özellik derinliği ve rakiplerden ayrışma"),
      bullet("Türkçe ve yerelleştirme başarısı"),
      bullet("Fiyat / performans dengesi"),
      bullet("Hız, stabilite ve destek kalitesi"),
      bullet("Veri gizliliği yaklaşımı"),
      bullet("Entegrasyon ekosistemi"),
      heading("4. Affiliate Şeffaflığı"),
      block(
        "Bazı bağlantılar satış ortaklığı modeli içerebilir. Bu durum kullanıcı için ek maliyet oluşturmaz ve editoryal puanlamayı veya sıralamayı değiştirmez.",
      ),
      heading("5. Hata Düzeltme Politikası"),
      block(
        "Eksik, güncelliğini yitirmiş veya hatalı bir bilgi tespit edilirse editörler gerekli doğrulamayı yapar ve sayfa güncellemesini mümkün olan en kısa sürede gerçekleştirir.",
      ),
    ],
  },
];

const transaction = client.transaction();

for (const page of managedPages) {
  transaction.createOrReplace(page);
}

await transaction.commit();

console.log(`Seed tamamlandi: ${managedPages.length} yonetilen sayfa guncellendi.`);
