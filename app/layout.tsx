import type { Metadata } from 'next';
import './globals.css';
import ReadingProgress from '@/components/briefing/ReadingProgress';
import MobileBottomNav from '@/components/nav/MobileBottomNav';
import ScrollToTop from '@/components/ui/ScrollToTop';

export const metadata: Metadata = {
  title: { default: 'Nyx Daily', template: '%s · Nyx Daily' },
  description: 'Your personal daily briefing — news, weather, deadlines, workouts, and more.',
  icons: { icon: '/favicon.ico', apple: '/icon-192.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#06060e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Nyx Daily" />
      </head>
      <body className="antialiased min-h-screen" style={{ background: 'var(--bg)', color: '#f1f5f9' }}>
        <ReadingProgress />
        <main className="lg:pb-0 pb-20">{children}</main>
        <MobileBottomNav />
        <ScrollToTop />
      </body>
    </html>
  );
}
