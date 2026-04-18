export default function SearchBar() {
  return (
    <form
      className="search-container"
      action="/arama"
      method="GET"
      role="search"
      aria-label="Site içi arama"
    >
      <label htmlFor="home-site-search" className="sr-only">
        Sitede arama yap
      </label>
      <input
        id="home-site-search"
        type="search"
        name="q"
        className="search-input"
        placeholder="Örn: ChatGPT mi Claude mu veya en iyi yapay zeka aracı"
        inputMode="search"
      />
      <button type="submit" className="search-submit" aria-label="Arama yap">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20L16.65 16.65" />
        </svg>
        <span className="search-submit-label">Ara</span>
      </button>
    </form>
  );
}
