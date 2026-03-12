import { ManagedPageArticle, getManagedPageMetadata } from "@/lib/managed-pages";
import "../hakkimizda/corporate.css";

export function generateMetadata() {
  return getManagedPageMetadata("yayin-ilkeleri");
}

export default function EditorialGuidelinesPage() {
  return <ManagedPageArticle slug="yayin-ilkeleri" contentClassName="corporate-content" />;
}
