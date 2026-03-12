import { ManagedPageArticle, getManagedPageMetadata } from "@/lib/managed-pages";
import "../hakkimizda/corporate.css";

export function generateMetadata() {
  return getManagedPageMetadata("cerez-politikasi");
}

export default function CookiePage() {
  return (
    <ManagedPageArticle slug="cerez-politikasi" contentClassName="corporate-content legal-content" />
  );
}
