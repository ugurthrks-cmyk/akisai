import { ManagedPageArticle, getManagedPageMetadata } from "@/lib/managed-pages";
import "./corporate.css";

export function generateMetadata() {
  return getManagedPageMetadata("hakkimizda");
}

export default function AboutPage() {
  return <ManagedPageArticle slug="hakkimizda" contentClassName="corporate-content" />;
}
