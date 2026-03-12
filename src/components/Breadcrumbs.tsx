import React from "react";
import "./content-signals.css";
import { absoluteUrl } from "@/lib/content";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

export default function Breadcrumbs({
  items,
  baseUrl,
}: {
  items: BreadcrumbItem[];
  baseUrl?: string;
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: absoluteUrl(item.href, baseUrl) } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={`${item.name}-${index}`}>
                {item.href && !isLast ? (
                  <a href={item.href}>{item.name}</a>
                ) : (
                  <span className="breadcrumbs-current">{item.name}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
