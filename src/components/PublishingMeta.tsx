import Link from "next/link";
import "./content-signals.css";
import { formatDisplayDate } from "@/lib/content";
import type { DirectoryAuthor } from "@/lib/content-source";

interface PublishingMetaProps {
  author?: DirectoryAuthor | null;
  publishedAt?: string;
}

export default function PublishingMeta({ author, publishedAt }: PublishingMetaProps) {
  const formattedPublishedAt = formatDisplayDate(publishedAt);

  if (!author && !formattedPublishedAt) {
    return null;
  }

  return (
    <div>
      <div className="publishing-meta">
        {author ? (
          <div className="publishing-card">
            <span className="publishing-label">Yazar</span>
            <div className="publishing-value">
              <Link href={`/yazar/${author.slug}`}>{author.fullName}</Link>
            </div>
          </div>
        ) : null}
        {formattedPublishedAt ? (
          <div className="publishing-card">
            <span className="publishing-label">Yayımlanma tarihi</span>
            <div className="publishing-value">{formattedPublishedAt}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
