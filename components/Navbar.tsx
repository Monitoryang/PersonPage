'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { t, locale, toggleLocale } = useI18n();
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'nav.home' },
    { href: '/projects', label: 'nav.projects' },
    { href: '/skills', label: 'nav.skills' },
    { href: '/blog', label: 'nav.blog' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 bg-[rgba(10,10,15,0.85)] backdrop-blur-[12px] border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-text flex items-center gap-2 hover:text-text">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span>Portfolio</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-text ${
                pathname === link.href ? 'text-primary-light' : 'text-text-secondary'
              }`}
            >
              {t(link.label)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLocale}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bg-card border border-border text-text-secondary text-[13px] font-medium cursor-pointer transition-all hover:border-primary-light hover:text-text"
            aria-label="Switch language"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span className="text-primary-light font-semibold">
              {locale === 'en' ? 'EN' : '中'}
            </span>
          </button>

          {/* Mobile menu button */}
          <button className="md:hidden flex items-center p-2 text-text" aria-label="Toggle menu" id="mobile-menu-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
