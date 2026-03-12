import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

type ContentType = 'ai' | 'kategori' | 'rehber';

const contentDirectory = path.join(process.cwd(), 'src', 'content');

export function getFiles(type: ContentType) {
  const directory = path.join(contentDirectory, type);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    return [];
  }
  return fs.readdirSync(directory).filter((file) => file.endsWith('.mdx') && !file.startsWith('_'));
}

export function getFileBySlug(type: ContentType, slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(contentDirectory, type, `${realSlug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    return null; /* Return null instead of crashing if tool not found */
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    frontmatter: data,
    content,
  };
}

export function getAllFilesFrontMatter(type: ContentType) {
  const files = getFiles(type);

  return files.reduce((allContent: any[], postSlug: string) => {
    const source = fs.readFileSync(
      path.join(contentDirectory, type, postSlug),
      'utf8'
    );
    const { data } = matter(source);

    return [
      {
        ...data,
        slug: postSlug.replace(/\.mdx$/, ''),
      },
      ...allContent,
    ];
  }, []);
}
