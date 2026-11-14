import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'أثر — اكتشف طريقك في العمل الرقمي',
  description: 'مساحة عربية تساعدك تكتشف منصات العمل الرقمي وتتعلم من تجارب حقيقية.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
