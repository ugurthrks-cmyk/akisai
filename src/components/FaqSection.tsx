import { serializeJsonLd } from "@/lib/json-ld";
import React from "react";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqSection({
  faqs,
  title = "Sıkça Sorulan Sorular",
  sectionId,
}: {
  faqs: FaqItem[];
  title?: string;
  sectionId?: string;
}) {
  if (!Array.isArray(faqs) || faqs.length === 0) {
    return null;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "tr-TR",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="faq-section" id={sectionId}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
      />
      <h2>{title}</h2>
      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <details key={`faq-${idx}`} className="faq-item">
            <summary>{faq.question}</summary>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
