"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();

    if (query.trim()) {
      router.push(`/arama?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form className="search-container" onSubmit={handleSearch} role="search" aria-label="Site ici arama">
      <label htmlFor="site-search" className="sr-only">
        Sitede arama yap
      </label>
      <span className="search-icon" aria-hidden="true">
        ⌕
      </span>
      <input
        id="site-search"
        type="text"
        className="search-input"
        placeholder="Orn: e-ticaret icin fotograf duzenleme"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="submit" style={{ display: "none" }}>
        Ara
      </button>
    </form>
  );
}
