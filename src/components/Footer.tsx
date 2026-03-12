import Link from "next/link";
import "./footer.css";

type FooterProps = {
  siteName?: string;
  description?: string;
  socialProfiles?: string[];
};

export default function Footer({
  siteName = "Akış",
  description = "Türkiye’nin bağımsız ve tarafsız yapay zekâ araştırma kütüphanesi.",
  socialProfiles = [],
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <span className="brand-text">{siteName}</span>
            <span className="brand-dot">.</span>
          </Link>
          <p className="footer-vision">{description}</p>
          {socialProfiles.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1rem" }}>
              {socialProfiles.map((profile) => (
                <a
                  key={profile}
                  href={profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "0.35rem 0.7rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    fontSize: "0.82rem",
                  }}
                >
                  {profile}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="footer-links-grid">
          <div className="footer-column">
            <h3>Popüler kategoriler</h3>
            <ul>
              <li>
                <Link href="/kategori/video-ai">Video yapay zekâ araçları</Link>
              </li>
              <li>
                <Link href="/kategori/otomasyon">Otomasyon sistemleri</Link>
              </li>
              <li>
                <Link href="/kategori">Tüm kategoriler</Link>
              </li>
              <li>
                <Link href="/ai">Tüm yapay zekâ araçları</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Akademi ve rehberler</h3>
            <ul>
              <li>
                <Link href="/rehber/capcut-nasil-kullanilir">CapCut PC rehberi</Link>
              </li>
              <li>
                <Link href="/rehber/zapier-nasil-kullanilir">Zapier sosyal otomasyonu</Link>
              </li>
              <li>
                <Link href="/rehber">Tüm eğitim rehberleri</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Kurumsal</h3>
            <ul>
              <li>
                <Link href="/hakkimizda">Hakkımızda ve ekibimiz</Link>
              </li>
              <li>
                <Link href="/yazar">Yazar profilleri</Link>
              </li>
              <li>
                <Link href="/yayin-ilkeleri">Yayın ve test ilkeleri</Link>
              </li>
              <li>
                <Link href="/iletisim">Bize ulaşın</Link>
              </li>
              <li>
                <Link href="/gizlilik">Gizlilik politikası</Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari">Kullanım koşulları</Link>
              </li>
              <li>
                <Link href="/cerez-politikasi">Çerez politikası</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; {currentYear} {siteName}. Tüm hakları ve içerik telifleri saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
