import { posts } from '@/data/posts';
import BlogDetailClient from './client';

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}
