'use client';

import { I18nProvider } from '@/lib/i18n-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <Navbar />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer />
    </I18nProvider>
  );
}
