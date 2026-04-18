"use client";

import Link from "next/link";
import { useState } from "react";
import { coreCategoryTaxonomy } from "@/lib/category-taxonomy";
import "./header.css";

type HeaderProps = {
  siteName?: string;
};

const navItems = [
  {
    href: "/kategori",
    label: "Kategoriler",
    description: "Kullanım alanı merkezleri",
  },
  {
    href: "/incelemeler",
    label: "İncelemeler",
    description: "Yapay zeka araç incelemeleri",
  },
  {
    href: "/karsilastirma",
    label: "Karşılaştırmalar",
    description: "Senaryo bazlı araç karşılaştırmaları",
  },
  {
    href: "/rehber",
    label: "Nasıl Kullanılır",
    description: "Adım adım kurulum rehberleri",
  },
] as const;

const mobileCategories = coreCategoryTaxonomy.map((category) => ({
  href: `/kategori/${category.slug}`,
  label: category.name,
}));

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="7" x2="20" y2="7"></line>
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="17" x2="20" y2="17"></line>
    </svg>
  );
}

export default function Header({ siteName = "AkışAI" }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen((current) => {
      const next = !current;
      if (next) {
        setIsMenuOpen(false);
      }
      return next;
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen((current) => {
      const next = !current;
      if (next) {
        setIsSearchOpen(false);
      }
      return next;
    });
  };

  const closePanels = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  return (
    <header className={`site-header ${isSearchOpen || isMenuOpen ? "site-header-expanded" : ""}`}>
      <div className="header-container">
        <div className="header-mobile-trigger header-mobile-trigger-left">
          <button
            type="button"
            className={`mobile-icon-btn ${isMenuOpen ? "is-active" : ""}`}
            aria-label="Menüyü aç"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-panel"
            onClick={toggleMenu}
          >
            <MenuIcon />
          </button>
        </div>

        <div className="header-brand-group">
          <div className="header-logo">
            <Link href="/" aria-label={`${siteName} ana sayfa`}>
              <span className="brand-lockup">
                <span className="brand-text">{siteName}</span>
                <span className="brand-dot">.</span>
              </span>
            </Link>
          </div>

          <nav className="header-nav" aria-label="Ana gezinme">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="header-actions">
          <form action="/arama" method="GET" className="header-search-form" role="search" aria-label="Site içi arama">
            <label htmlFor="header-site-search" className="sr-only">
              Sitede arama yap
            </label>
            <input
              id="header-site-search"
              type="search"
              name="q"
              placeholder="Yapay zeka aracı, kategori, rehber veya karşılaştırma ara"
              autoComplete="off"
              inputMode="search"
              required
              className="header-search-input"
            />
            <button type="submit" className="search-icon-btn" aria-label="Arama yap">
              <SearchIcon />
            </button>
          </form>
        </div>

        <div className="header-mobile-trigger header-mobile-trigger-right">
          <button
            type="button"
            className={`mobile-icon-btn ${isSearchOpen ? "is-active" : ""}`}
            aria-label="Aramayı aç"
            aria-expanded={isSearchOpen}
            aria-controls="mobile-search-panel"
            onClick={toggleSearch}
          >
            <SearchIcon />
          </button>
        </div>
      </div>

      <div id="mobile-search-panel" className={`header-mobile-panel ${isSearchOpen ? "is-open" : ""}`}>
        <form
          action="/arama"
          method="GET"
          className="header-mobile-search-form"
          role="search"
          aria-label="Mobil site içi arama"
        >
          <label htmlFor="mobile-site-search" className="sr-only">
            Mobil arama yap
          </label>
          <input
            id="mobile-site-search"
            type="search"
            name="q"
            placeholder="Yapay zeka aracı, kategori, rehber veya karşılaştırma ara"
            autoComplete="off"
            inputMode="search"
            required
            className="header-mobile-search-input"
          />
          <button type="submit" className="mobile-search-submit" aria-label="Aramayı başlat">
            <SearchIcon />
          </button>
        </form>
      </div>

      <div id="mobile-nav-panel" className={`header-mobile-panel ${isMenuOpen ? "is-open" : ""}`}>
        <nav className="mobile-nav-links" aria-label="Mobil ana gezinme">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="mobile-nav-link" onClick={closePanels}>
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </Link>
          ))}
        </nav>
        <nav className="mobile-category-grid" aria-label="Mobil kategoriler">
          {mobileCategories.map((item) => (
            <Link key={item.href} href={item.href} className="mobile-category-card" onClick={closePanels}>
              <strong>{item.label}</strong>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
