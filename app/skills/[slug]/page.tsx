import { skills } from '@/data/skills';
import SkillDetailClient from './client';

export function generateStaticParams() {
  return skills.map((s) => ({ slug: s.slug }));
}

export default function SkillDetailPage() {
  return <SkillDetailClient />;
}
