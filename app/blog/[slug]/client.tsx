'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { posts } from '@/data/posts';
import { Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';

function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = '';
  let inTable = false;
  let tableRows: string[][] = [];
  let inAlert = false;
  let alertType = '';
  let alertLines: string[] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(2); // skip separator row
      const cols = headerRow.length;
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-6 rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {headerRow.map((cell, j) => (
                  <th key={j} className="bg-bg-card text-text font-semibold p-3 text-left border-b border-border">{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, j) => (
                    <td key={j} className="p-3 border-b border-border text-text-secondary last:border-none">{formatInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  const flushAlert = () => {
    if (alertLines.length > 0) {
      const colorMap: Record<string, string> = {
        danger: 'border-l-[#EF4444] bg-[rgba(239,68,68,0.08)]',
        warning: 'border-l-[#F59E0B] bg-[rgba(245,158,11,0.08)]',
        success: 'border-l-[#10B981] bg-[rgba(16,185,129,0.08)]',
        info: 'border-l-secondary bg-[rgba(99,102,241,0.08)]',
      };
      elements.push(
        <div key={`alert-${i}`} className={`rounded-lg p-4 my-5 border-l-4 ${colorMap[alertType] || colorMap.info}`}>
          {alertLines.map((line, li) => (
            <p key={li} className="text-text-secondary text-sm leading-relaxed mb-1 last:mb-0">{formatInline(line)}</p>
          ))}
        </div>
      );
      alertLines = [];
      inAlert = false;
    }
  };

  const formatInline = (text: string): React.ReactNode => {
    // Bold
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, pi) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pi} className="text-text font-semibold">{part.slice(2, -2)}</strong>;
      }
      // Inline code
      const codeParts = part.split(/(`[^`]+`)/g);
      return codeParts.map((cp, ci) => {
        if (cp.startsWith('`') && cp.endsWith('`')) {
          return <code key={`${pi}-${ci}`} className="bg-[rgba(124,58,237,0.12)] text-primary-light px-1.5 py-0.5 rounded text-[0.85em]">{cp.slice(1, -1)}</code>;
        }
        return <span key={`${pi}-${ci}`}>{cp}</span>;
      });
    });
  };

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
        codeLines = [];
      } else {
        inCodeBlock = false;
        elements.push(
          <div key={`code-${i}`} className="relative my-5">
            {codeLang && <div className="absolute top-2 right-3 text-[10px] font-medium text-text-muted uppercase">{codeLang}</div>}
            <pre className="bg-[#1E1E2E] border border-border rounded-lg p-5 overflow-x-auto text-[13px] leading-[1.7]">
              <code className="text-[#CDD6F4]">{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
      }
      i++;
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      i++;
      continue;
    }

    // Alert blocks (> [!TYPE])
    if (line.match(/^>\s*\[!(danger|warning|success|info)\]/i)) {
      flushTable();
      inAlert = true;
      alertType = line.match(/\[!(danger|warning|success|info)\]/i)?.[1].toLowerCase() || 'info';
      alertLines = [];
      i++;
      continue;
    }
    if (inAlert && line.startsWith('> ')) {
      alertLines.push(line.slice(2));
      i++;
      continue;
    }
    if (inAlert && line.trim() === '') {
      flushAlert();
      i++;
      continue;
    }
    if (inAlert) {
      flushAlert();
    }

    // Table
    if (line.startsWith('| ')) {
      flushAlert();
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (!inTable) inTable = true;
      tableRows.push(cells);
      i++;
      continue;
    }
    if (inTable && !line.startsWith('|')) {
      flushTable();
    }

    // Headers
    if (line.startsWith('#### ')) {
      flushTable();
      elements.push(<h4 key={i} className="text-base font-semibold text-text-secondary mt-6 mb-3">{formatInline(line.slice(5))}</h4>);
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      flushTable();
      elements.push(<h3 key={i} className="text-lg font-semibold mt-8 mb-4">{formatInline(line.slice(4))}</h3>);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      flushTable();
      elements.push(<h2 key={i} className="text-xl font-bold mt-10 mb-5 pb-3 border-b-2 border-border">{formatInline(line.slice(3))}</h2>);
      i++;
      continue;
    }

    // List items
    if (line.startsWith('- ')) {
      elements.push(<li key={i} className="text-text-secondary leading-[1.7] ml-5 mb-1 list-disc">{formatInline(line.slice(2))}</li>);
      i++;
      continue;
    }
    if (line.match(/^\d+\.\s/)) {
      const content = line.replace(/^\d+\.\s/, '');
      elements.push(<li key={i} className="text-text-secondary leading-[1.7] ml-5 mb-1 list-decimal">{formatInline(content)}</li>);
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(<p key={i} className="text-text-secondary leading-[1.8] mb-4">{formatInline(line)}</p>);
    i++;
  }

  flushTable();
  flushAlert();
  return elements;
}

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
          {renderMarkdown(post.content[l])}
        </div>
      </article>
    </section>
  );
}
