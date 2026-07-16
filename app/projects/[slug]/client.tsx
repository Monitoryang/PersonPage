'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { projects } from '@/data/projects';
import { Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';

export default function ProjectDetailClient() {
  const { t, locale } = useI18n();
  const l = locale as Locale;
  const params = useParams();
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    return <div className="py-24 px-6 text-center text-text-muted">Project not found</div>;
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-[800px] mx-auto">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary-light transition-colors mb-8">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          {t('common.back')}
        </Link>

        <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-primary-light mb-3">{project.category[l]}</div>
        <h1 className="text-[clamp(28px,4vw,40px)] font-bold leading-[1.2] mb-6">{project.title[l]}</h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">{t('common.overview')}</h2>
          <p className="text-text-secondary leading-[1.8]">{project.detail[l]}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">{t('common.techStack')}</h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span key={tech} className="px-3 py-1.5 rounded-full text-xs font-medium bg-[rgba(124,58,237,0.08)] text-primary-light border border-[rgba(124,58,237,0.15)]">{tech}</span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">{t('common.keyResults')}</h2>
          <ul className="space-y-2">
            {project.results[l].map((result, i) => (
              <li key={i} className="flex items-start gap-3 text-text-secondary text-sm leading-[1.7]">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-light flex-shrink-0" />
                {result}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
