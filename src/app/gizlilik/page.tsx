import { ManagedPageArticle, getManagedPageMetadata } from "@/lib/managed-pages";
import "../hakkimizda/corporate.css";

export function generateMetadata() {
  return getManagedPageMetadata("gizlilik");
}

export default function PrivacyPage() {
  return <ManagedPageArticle slug="gizlilik" contentClassName="corporate-content legal-content" />;
}
