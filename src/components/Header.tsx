import Link from "next/link";
import "./header.css";

type HeaderProps = {
  siteName?: string;
};

export default function Header({ siteName = "Akış" }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-logo">
          <Link href="/">
            <span className="brand-text">{siteName}</span>
            <span className="brand-dot">.</span>
          </Link>
        </div>

        <nav className="header-nav" aria-label="Ana gezinme">
          <ul className="nav-list">
            <li>
              <Link href="/kategori" className="nav-link">
                Kategoriler
              </Link>
            </li>
            <li>
              <Link href="/rehber" className="nav-link">
                Rehberler
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <form action="/arama" method="GET" className="header-search-form">
            <input
              type="text"
              name="q"
              placeholder="Araç veya rehber ara..."
              autoComplete="off"
              required
              className="header-search-input"
            />
            <button type="submit" className="search-icon-btn" aria-label="Arama yap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
