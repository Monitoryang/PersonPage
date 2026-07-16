'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { posts } from '@/data/posts';
import { Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';

export default function BlogDetailClient() {
  const { t, locale } = useI18n();
  const l = locale as Locale;
  const params = useParams();
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    return <div className="py-24 px-6 text-center text-text-muted">Article not found</div>;
  }

  return (
    <section className="py-24 px-6">
      <article className="max-w-[800px] mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary-light transition-colors mb-8">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          {t('common.back')}
        </Link>

        <div className="text-sm text-text-muted mb-3">{post.date}</div>
        <h1 className="text-[clamp(28px,4vw,40px)] font-bold leading-[1.2] mb-4">{post.title[l]}</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(124,58,237,0.08)] text-primary-light border border-[rgba(124,58,237,0.15)]">{tag}</span>
          ))}
        </div>

        <div className="max-w-none">
          {post.content[l].split('\n').map((line, i) => {
            if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-8 mb-4">{line.slice(3)}</h2>;
            if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold mt-6 mb-3">{line.slice(4)}</h3>;
            if (line.startsWith('- ')) return <li key={i} className="text-text-secondary leading-[1.7] ml-4">{line.slice(2)}</li>;
            if (line.startsWith('| ')) {
              const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
              if (cells.every(c => c.match(/^-+$/))) return null;
              return (
                <div key={i} className="grid text-sm" style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
                  {cells.map((cell, j) => (
                    <div key={j} className="p-2 border-b border-border text-text-secondary">{cell}</div>
                  ))}
                </div>
              );
            }
            if (line.match(/^\d+\.\s/)) {
              const content = line.replace(/^\d+\.\s/, '');
              return <li key={i} className="text-text-secondary leading-[1.7] ml-4 list-decimal">{content.split('**').map((part, pi) => pi % 2 === 1 ? <strong key={pi} className="text-text font-semibold">{part}</strong> : part)}</li>;
            }
            if (line.trim() === '') return <br key={i} />;
            return <p key={i} className="text-text-secondary leading-[1.8] mb-4">{line.split('**').map((part, pi) => pi % 2 === 1 ? <strong key={pi} className="text-text font-semibold">{part}</strong> : part)}</p>;
          })}
        </div>
      </article>
    </section>
  );
}
