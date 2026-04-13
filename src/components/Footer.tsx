import Link from "next/link";
import "./footer.css";

type FooterProps = {
  siteName?: string;
  description?: string;
  socialProfiles?: string[];
};

export default function Footer({
  siteName = "AkışAI",
  description = "Türkiye için yapay zeka araçları, incelemeleri ve nasıl kullanılır rehberleri.",
  socialProfiles = [],
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const formattedProfiles = socialProfiles.map((profile) => {
    try {
      const url = new URL(profile);
      return {
        href: profile,
        label: url.hostname.replace(/^www\./, ""),
      };
    } catch {
      return {
        href: profile,
        label: profile,
      };
    }
  });

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <span className="footer-brand-lockup">
              <span className="brand-text">{siteName}</span>
              <span className="brand-dot">.</span>
            </span>
          </Link>
          <p className="footer-vision">{description}</p>

          {formattedProfiles.length > 0 ? (
            <div className="footer-socials">
              {formattedProfiles.map((profile) => (
                <a
                  key={profile.href}
                  href={profile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-chip"
                >
                  {profile.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <nav className="footer-links-grid" aria-label="Alt gezinme">
          <div className="footer-column">
            <h3>Kategoriler</h3>
            <ul>
              <li>
                <Link href="/kategori/video-duzenleme">Video Düzenleme</Link>
              </li>
              <li>
                <Link href="/kategori/video-olusturma">Video Oluşturma</Link>
              </li>
              <li>
                <Link href="/kategori/is-akisi-otomasyonu">İş Akışı Otomasyonu</Link>
              </li>
              <li>
                <Link href="/kategori/gorsel-olusturma">Görsel Oluşturma</Link>
              </li>
              <li>
                <Link href="/kategori/ses-olusturma">Ses Oluşturma</Link>
              </li>
              <li>
                <Link href="/kategori/logo-tasarimi">Logo Tasarımı</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Nasıl Kullanılır</h3>
            <ul>
              <li>
                <Link href="/rehber/capcut-nasil-kullanilir">CapCut Nasıl Kullanılır</Link>
              </li>
              <li>
                <Link href="/rehber/zapier-nasil-kullanilir">Zapier Nasıl Kullanılır</Link>
              </li>
              <li>
                <Link href="/rehber/canva-nasil-kullanilir">Canva Nasıl Kullanılır</Link>
              </li>
              <li>
                <Link href="/rehber">Tüm Rehberler</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Güven ve Kurumsal</h3>
            <ul>
              <li>
                <Link href="/hakkimizda">Hakkımızda ve Ekibimiz</Link>
              </li>
              <li>
                <Link href="/yazar">Yazar Profilleri</Link>
              </li>
              <li>
                <Link href="/yayin-ilkeleri">Yayın ve Test İlkeleri</Link>
              </li>
              <li>
                <Link href="/iletisim">Bize Ulaşın</Link>
              </li>
              <li>
                <Link href="/gizlilik">Gizlilik Politikası</Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari">Kullanım Koşulları</Link>
              </li>
              <li>
                <Link href="/cerez-politikasi">Çerez Politikası</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>
            &copy; {currentYear} {siteName}. Tüm hakları ve içerik telifleri saklıdır.
          </p>
          <p className="footer-bottom-note">
            Editoryal içerikler, araç değişimleri ve kullanım sinyalleri için düzenli olarak güncellenir.
          </p>
        </div>
      </div>
    </footer>
  );
}
