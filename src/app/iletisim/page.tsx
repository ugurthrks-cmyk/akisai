import { ManagedPageArticle, getManagedPageMetadata } from "@/lib/managed-pages";
import "../hakkimizda/corporate.css";

export function generateMetadata() {
  return getManagedPageMetadata("iletisim");
}

export default function ContactPage() {
  return <ManagedPageArticle slug="iletisim" contentClassName="corporate-content" />;
}
