import { projects } from '@/data/projects';
import ProjectDetailClient from './client';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default function ProjectDetailPage() {
  return <ProjectDetailClient />;
}
