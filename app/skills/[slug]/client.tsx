'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { skills } from '@/data/skills';
import { projects } from '@/data/projects';
import { Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';

export default function SkillDetailClient() {
  const { t, locale } = useI18n();
  const l = locale as Locale;
  const params = useParams();
  const skill = skills.find((s) => s.slug === params.slug);

  if (!skill) {
    return <div className="py-24 px-6 text-center text-text-muted">Skill not found</div>;
  }

  const related = projects.filter((p) => skill.relatedProjects.includes(p.slug));

  return (
    <section className="py-24 px-6">
      <div className="max-w-[800px] mx-auto">
        <Link href="/skills" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary-light transition-colors mb-8">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          {t('common.back')}
        </Link>

        <h1 className="text-[clamp(28px,4vw,40px)] font-bold leading-[1.2] mb-4">{skill.title[l]}</h1>

        <div className="mb-8">
          <div className="h-2 bg-border rounded-full overflow-hidden max-w-[300px]">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${skill.proficiency}%` }} />
          </div>
          <div className="text-sm text-text-muted mt-2">{skill.proficiency}%</div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">{t('common.overview')}</h2>
          <p className="text-text-secondary leading-[1.8]">{skill.detail[l]}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">{t('common.techStack')}</h2>
          <div className="flex flex-wrap gap-2">
            {skill.technologies.map((tech) => (
              <span key={tech} className="px-3 py-1.5 rounded-full text-xs font-medium bg-[rgba(124,58,237,0.08)] text-primary-light border border-[rgba(124,58,237,0.15)]">{tech}</span>
            ))}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">{t('common.relatedProjects')}</h2>
            <div className="space-y-3">
              {related.map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}`} className="block p-4 rounded-lg bg-bg-card border border-border hover:border-[rgba(124,58,237,0.3)] transition-all">
                  <h4 className="font-medium mb-1">{p.title[l]}</h4>
                  <p className="text-sm text-text-muted">{p.description[l]}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
