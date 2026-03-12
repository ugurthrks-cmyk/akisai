import Link from "next/link";
import type { DirectoryAuthor } from "@/lib/content-source";
import "./author-box.css";

interface AuthorBoxProps {
  author?: DirectoryAuthor | null;
}

export default function AuthorBox({ author }: AuthorBoxProps) {
  if (!author) {
    return null;
  }

  return (
    <div className="author-box">
      <div className="author-box-avatar">
        {author.avatarUrl ? (
          <img src={author.avatarUrl} alt={`${author.fullName} profil görseli`} loading="lazy" />
        ) : (
          <div className="avatar-placeholder">{author.name.charAt(0)}</div>
        )}
      </div>
      <div className="author-box-content">
        <div className="author-box-header">
          <span className="author-box-role">{author.role}</span>
          <h4 className="author-box-name">
            <Link href={`/yazar/${author.slug}`}>{author.fullName}</Link>
          </h4>
        </div>
        <p className="author-box-bio">{author.bio}</p>
        <div className="author-box-meta">
          <span className="meta-edu">🎓 {author.university}</span>
          <span className="meta-exp">⚡ {author.experience}</span>
        </div>
        <p className="author-box-methodology">{author.methodologyFocus}</p>
      </div>
    </div>
  );
}
