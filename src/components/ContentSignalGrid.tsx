import Link from "next/link";
import "./content-signals.css";

export type ContentSignalItem = {
  label: string;
  value: string;
  href?: string;
};

interface ContentSignalGridProps {
  items: ContentSignalItem[];
}

export default function ContentSignalGrid({ items }: ContentSignalGridProps) {
  const visibleItems = items.filter((item) => item.value.trim().length > 0);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className="content-signal-grid">
      {visibleItems.map((item) => (
        <div key={`${item.label}-${item.value}`} className="content-signal-card">
          <span className="content-signal-label">{item.label}</span>
          <div className="content-signal-value">
            {item.href ? <Link href={item.href}>{item.value}</Link> : item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
