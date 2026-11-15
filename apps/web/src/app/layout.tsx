import type { Metadata } from 'next';
import './globals.css';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';

export const metadata: Metadata = {
  title: 'أثر — اكتشف طريقك في العمل الرقمي',
  description:
    'مساحة عربية تساعدك تكتشف منصات العمل الرقمي وتتعلم من تجارب حقيقية.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
