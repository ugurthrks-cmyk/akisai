import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "8rem",
          fontWeight: "900",
          color: "var(--text-base)",
          margin: "0",
          lineHeight: "1",
          textShadow: "0 0 40px rgba(138, 43, 226, 0.3)",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "2rem",
          color: "#e4e4e7",
          marginTop: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        Aradığınız sayfa bulunamadı
      </h2>
      <p
        style={{
          color: "#a1a1aa",
          fontSize: "1.2rem",
          maxWidth: "500px",
          lineHeight: "1.6",
          marginBottom: "3rem",
        }}
      >
        Aradığınız içerik silinmiş, adı değişmiş ya da henüz yayımlanmamış olabilir. Ana sayfaya
        dönerek kategorilerden, rehberlerden ve araç incelemelerinden ilerleyebilirsiniz.
      </p>

      <div style={{ display: "flex", gap: "1rem" }}>
        <Link
          href="/"
          style={{
            padding: "0.8rem 2rem",
            background: "linear-gradient(135deg, var(--accent) 0%, #6b21a8 100%)",
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
            borderRadius: "12px",
            transition: "transform 0.2s ease",
            boxShadow: "0 4px 15px rgba(138, 43, 226, 0.2)",
          }}
        >
          Ana sayfaya dön
        </Link>
        <Link
          href="/kategori"
          style={{
            padding: "0.8rem 2rem",
            background: "rgba(255, 255, 255, 0.05)",
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            transition: "background 0.2s ease",
          }}
        >
          Kategorileri keşfet
        </Link>
      </div>
    </div>
  );
}
