'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { projects } from '@/data/projects';
import { Locale } from '@/lib/i18n';

export default function ProjectsPage() {
  const { t, locale } = useI18n();
  const l = locale as Locale;

  return (
    <section className="py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[2px] text-primary-light mb-3">{t('projects.label')}</p>
        <h1 className="text-[clamp(28px,4vw,40px)] font-bold leading-[1.2] mb-2">{t('projects.title')}</h1>
        <p className="text-base text-text-secondary max-w-[600px] leading-[1.7] mb-12">{t('projects.desc')}</p>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group rounded-xl bg-bg-card border border-border overflow-hidden transition-all hover:border-[rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:-translate-y-0.5 cursor-pointer block"
            >
              <div className="w-full h-[180px] bg-gradient-to-br from-surface to-bg-card flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[rgba(124,58,237,0.1)] flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
                </div>
              </div>
              <div className="p-6">
                <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-primary-light mb-2">{project.category[l]}</div>
                <h3 className="text-xl font-semibold mb-2.5">{project.title[l]}</h3>
                <p className="text-sm text-text-secondary leading-[1.7] mb-4">{project.description[l]}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface text-text-muted border border-border">{tech}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
