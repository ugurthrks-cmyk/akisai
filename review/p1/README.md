# AkışAI P1 değişikliklerinin inceleme notları

Kontrol tarihi: **6 Kasım 2026**. Kasım ayının sonraki günlerine ait güncellemeler bu kapsamda değildir. Çalışma yereldir; deployment, Git push, üretim ayarı değişikliği veya Sanity mutation isteği yapılmadı. Bu dosyadaki `verification.json` ilk P1 aşamasının tarihsel kaydıdır; sonraki HTTP ve mobil doğrulamalar [mobil düzeltme raporunda](../mobile-fixes/README.md) tamamlanmıştır.

## Uygulanan kod değişiklikleri

- **F01 — Bağımlılık güvenliği:** `package.json` ve `package-lock.json`. Next.js ve eslint-config-next 16.4.5, React/React DOM 19.3.1, Sanity/vision 5.31.2. Zorlayıcı `npm audit fix --force` çalıştırılmadı. Sanity ana sürümü değiştirilmedi. Son lockfile taramasında 0 bilinen açık bulundu; bu sonuç uygulamanın bütün güvenlik risklerinin giderildiği anlamına gelmez.
- Üst bağımlılıklar henüz güvenli sürümleri seçmediği için `adm-zip` 0.6.1, `js-yaml` 3.15.2, `uuid` 11.1.1 ve iki `minimatch` tüketicisi için 11.0.1 hedefli `overrides` eklendi. Bunlar geçici bakım borcudur: üst paketler düzeldiğinde sabitlemeleri kaldırıp tekrar tarayın. Sanity CLI sürüm komutu, ZIP okuma/yazma, YAML safeLoad, TypeID ve glob davranışları doğrulandı.
- **F04 — JSON-LD güvenliği:** `src/lib/json-ld.ts`; `SchemaMarkup`, `FaqSection`, `Breadcrumbs` ve ana sayfa/inceleme/karşılaştırma/kategori/rehber/yazar liste ve detay şablonları. Toplam 14 TSX dosyasındaki 19 üretim noktası ortak serializer kullanır. `<` karakteri Unicode kaçışına çevrilir; ayrıştırılmış JSON değerleri korunur.
- **F03 — Etkin gövdenin görünürlüğü:** `src/lib/content-body-policy.ts`, `src/lib/content-source.ts`, `src/sanity/schemaTypes/fields/richContent.ts` ve `documents/{tool,guide,comparison,category}.ts`. Dolu MDX alanı editörde görünür; bu durumda yayımlanmayan Portable Text alanı salt okunur olur. Boş/yalnızca boşluk içeren MDX ve mevcut gövde seçimi davranışı korunur. İçerik aktarımı yapılmadı.
- **GEO metin doğruluğu:** `src/lib/llms.ts` bütün içeriklerin Türkiye'de test edildiği ve tüm fiyatların doğrulandığı yönündeki genel güvenceler yerine kaynak ve test kapsamını ilgili sayfaya bağlar. `llms.txt` URL'leri ve robots kuralları korunur. Google, AI arama özellikleri için özel dosya veya ayrı bir schema şartı koymuyor: [resmî belge](https://developers.google.com/search/docs/appearance/ai-features).

## F02 — Hazır, canlı CMS'ye uygulanmadı

`src/content/karsilastirma/chatgpt-mi-claude-mu.mdx` ve bu klasördeki okunabilir `chatgpt-mi-claude-mu-body.md` aynı revizyonu içerir. Ancak sitenin gerçek yayın kaynağı Sanity'dir. Yerel MDX değişikliği tek başına canlı içeriği güncellemez.

`comparison-patch.json`, yayımlanmış `comparison.chatgpt-mi-claude-mu` belgesinin okunan `_rev` değeriyle koşullu bir değişiklik önerisidir. Dosya hiçbir yere gönderilmedi. Yalnızca `bodyMarkdown`, `faqs`, `sources`, `lastVerified`, `dateModified` ve `verificationNotes` alanlarını değiştirir. URL/slug, title, H1, meta description, hero, ilk yayın tarihi ve ilişkiler değişmez. `_rev` güncellendiyse koşul başarısız olmalıdır; bu korumayı kaldırarak üzerine yazmayın.

`comparison-before.json` aynı alanların önceki değerlerini ve okunan revizyonu saklar. Olası geri almada o andaki belge revizyonu yeniden okunmalı; mevcut dosyadaki eski `_rev` doğrudan geri alma için kullanılmamalıdır.

Revizyon; Claude sesli mod, plan çarpanları ve tüketici veri politikası bilgisini düzeltir. Eski ChatGPT fiyat/model garantilerini güncel resmî abonelik belgesine bağlar. Yeni hız, Türkçe kalite veya kodlama testi yapılmış gibi sunmaz. USD belge fiyatı ile Türkiye ödeme ekranı/TL maliyeti ayrıdır. İlgili kaynaklar hem içerikte hem CMS alanında bulunur.

## Doğrulama

- `npm test`: **11/11 geçti**. JSON-LD enjeksiyon sınırı ve veri bütünlüğü; gövde seçimi; değişiklik kapsamı ve revizyon koşulu; yeni içeriğin MDX derlenmesi; bağımlılık uyumluluğu.
- `npm run typecheck`: geçti.
- `npm run lint`: 0 hata; `PortableTextContent.tsx:88` içinde önceden mevcut kullanılmayan `promptFieldLabels` uyarısı sürüyor.
- `npm audit`: kurulu son lockfile için 0 bilinen açık.
- `npx --no-install next build`: Next.js 16.4.5/Turbopack ile geçti; 58 statik üretim girdisi tamamlandı. Test Node sürümü 24.12.0, npm 11.6.2.
- Kimliği doğrulanmış Sanity Vision oturumundan **39 yayımlanmış içerik belgesi** ve anonim API'den 3 herkese açık görsel kaydı salt okunur alındı. Anonim içerik sorgusunun 9 kayıt döndürmesi tam envanteri temsil etmiyor. Üretim token'ı dışa aktarılmadı.
- Derlemenin veri okumaları yalnızca test sürecinde dışarıdaki fixture adaptörüne yönlendirildi. Adaptör Sanity yazma isteklerini engeller; uygulama kaynaklarına bir fixture modu/fallback eklenmedi. Gerçek üretim token'ıyla canlı entegrasyon testi yapılmış sayılmaz. `npm run build` içindeki ayrı `prebuild` manifest betiği bu fixture denemesinde çalıştırılmadı; Next derlemesi doğrudan çağrıldı ve mevcut manifest korundu.
- Kod düzeltmeleriyle üretilen HTML, önceden kaydedilen 44 canlı URL'nin HTML çıktısıyla karşılaştırıldı: **44/44** title, açıklama, canonical, robots, normalize H1, normalize ana gövde ve ayrıştırılmış JSON-LD eşleşti. **127 JSON-LD** kaydı ayrıştırıldı ve eşleşti. Sitemap URL kümesinde fark yok.
- CMS önerisi yalnızca yerel veri kopyasına uygulanarak tekrar derlendi: 44/44 sayfanın title, açıklama, canonical, robots ve H1 alanları aynı kaldı. Diğer 43 sayfanın gövdesi ve JSON-LD'si aynı; yalnızca karşılaştırma sayfasının gövdesi, kaynak/SSS/güncelleme verileri beklenen biçimde değişti. Sitemap URL kümesi yine aynı.

Test ayrıntıları `verification.json` içindedir. Kaynak yedeği, tam içerik snapshot'ı, başlangıç HTML ölçümleri ve fixture adaptörü `C:\Users\comez\AppData\Local\Temp\akisai-p1-dx2ne2sm` dizinindedir. Üretim anahtarları bu dosyalarda bulunmaz.

## Açık doğrulama sınırları ve sonraki işlem

İlk P1 aşamasında yerel `next start` komutu otomatik onay denetiminde “blocked by policy” gerekçesiyle engellendi. Kullanıcı sunucuyu başlattıktan sonra 44 URL'nin HTTP/Googlebot kullanıcı aracısı yanıtları, tarayıcı etkileşimleri ve mobil görünümler kontrol edildi; saptanan mobil sorunlar düzeltildi ve yeni derlemeyle 40/40 görünüm kontrolü geçti. Ayrıntılar [mobil düzeltme raporunda](../mobile-fixes/README.md) yer alır. Googlebot kontrolü kullanıcı aracısı benzetimidir; gerçek Google IP'si veya URL Inspection testi değildir.

Gerçek kullanıcı CrUX verisi bulunmadığı için saha Core Web Vitals/INP başarısı doğrulanmış değildir. Canlı siteden alınmış PageSpeed laboratuvar sonuçları da bu yerel yayın adayının saha performansını kanıtlamaz. Build, yerel ortamda Google doğrulama değişkeninin bulunmadığını bildirdi; doğrulama etiketi ya da DNS ayarı değiştirilmedi.

Üretime geçiş için mevcut korumalı Sanity okuma erişimiyle gerçek `npm run build`/prebuild akışı ve HTTP kontrolleri doğrulanmalı; ardından kod yayını ile bu CMS önerisi ayrı ayrı değerlendirilmelidir. Bu çalışmada ikisi de yayımlanmadı. İçeriği aktarmak için toplu seed betikleri kullanmayın; bunlar bu tek belgeye ait dar kapsamlı öneriden farklı işlemlerdir.

Güvenlik kaynakları: [Next.js 3 Kasım güvenlik düzeltmesi](https://github.com/vercel/next.js/security/advisories/GHSA-7qx7-33qx-rqx2), [Next.js JSON-LD rehberi](https://nextjs.org/docs/app/guides/json-ld). Sürüm ve tarama sonuçları 6 Kasım 2026 tarihindeki npm registry/audit verisine dayanır.
