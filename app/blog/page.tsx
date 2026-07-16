'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { posts } from '@/data/posts';
import { Locale } from '@/lib/i18n';

export default function BlogPage() {
  const { t, locale } = useI18n();
  const l = locale as Locale;

  return (
    <section className="py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[2px] text-primary-light mb-3">{t('blog.label')}</p>
        <h1 className="text-[clamp(28px,4vw,40px)] font-bold leading-[1.2] mb-2">{t('blog.title')}</h1>
        <p className="text-base text-text-secondary max-w-[600px] leading-[1.7] mb-12">{t('blog.desc')}</p>
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block p-6 rounded-xl bg-bg-card border border-border transition-all hover:border-[rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="text-[11px] text-text-muted mb-2">{post.date}</div>
                  <h3 className="text-lg font-semibold mb-2">{post.title[l]}</h3>
                  <p className="text-sm text-text-secondary leading-[1.7]">{post.summary[l]}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 md:flex-shrink-0">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[rgba(124,58,237,0.08)] text-primary-light border border-[rgba(124,58,237,0.15)]">{tag}</span>
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
