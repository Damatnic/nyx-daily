import type { Metadata } from 'next';
import './globals.css';
import ReadingProgress from '@/components/briefing/ReadingProgress';
import MobileBottomNav from '@/components/nav/MobileBottomNav';

export const metadata: Metadata = {
  title: 'Nyx Daily — Morning Briefing',
  description: 'Your personal daily briefing dashboard. News, deadlines, workouts, and more.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#07070f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Nyx Daily" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased min-h-screen bg-[#07070f] text-slate-100">
        <ReadingProgress />
        <main className="lg:pb-0 pb-20">{children}</main>
        <MobileBottomNav />
      </body>
    </html>
  );
}
