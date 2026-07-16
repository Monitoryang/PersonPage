'use client';

import { useI18n } from '@/lib/i18n-context';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="py-8 px-6 border-t border-border text-center">
      <p className="text-[13px] text-text-muted">{t('footer.text')}</p>
    </footer>
  );
}
