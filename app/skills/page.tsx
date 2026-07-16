'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { skills } from '@/data/skills';
import { Locale } from '@/lib/i18n';

export default function SkillsPage() {
  const { t, locale } = useI18n();
  const l = locale as Locale;

  return (
    <section className="py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[2px] text-primary-light mb-3">{t('skills.label')}</p>
        <h1 className="text-[clamp(28px,4vw,40px)] font-bold leading-[1.2] mb-2">{t('skills.title')}</h1>
        <p className="text-base text-text-secondary max-w-[600px] leading-[1.7] mb-12">{t('skills.desc')}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              className="group p-8 rounded-xl bg-bg-card border border-border transition-all hover:border-[rgba(124,58,237,0.3)] hover:bg-bg-card-hover hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:-translate-y-0.5 cursor-pointer block"
            >
              <h3 className="text-lg font-semibold mb-2.5">{skill.title[l]}</h3>
              <p className="text-sm text-text-secondary leading-[1.7] mb-4">{skill.description[l]}</p>
              {/* Proficiency bar */}
              <div className="mb-4">
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${skill.proficiency}%` }} />
                </div>
                <div className="text-[11px] text-text-muted mt-1.5">{skill.proficiency}%</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.technologies.slice(0, 4).map((tech) => (
                  <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(124,58,237,0.08)] text-primary-light border border-[rgba(124,58,237,0.15)]">{tech}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
