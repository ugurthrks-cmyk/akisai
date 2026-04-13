import React from "react";

interface SchemaProps {
  type: "SoftwareApplication" | "Organization" | "WebSite";
  data: Record<string, unknown>;
}

export default function SchemaMarkup({ type, data }: SchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
