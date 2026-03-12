import { ManagedPageArticle, getManagedPageMetadata } from "@/lib/managed-pages";
import "../hakkimizda/corporate.css";

export function generateMetadata() {
  return getManagedPageMetadata("kullanim-kosullari");
}

export default function TermsPage() {
  return (
    <ManagedPageArticle slug="kullanim-kosullari" contentClassName="corporate-content legal-content" />
  );
}
