import type { Metadata } from 'next';
import './globals.css';
import ReadingProgress from '@/components/briefing/ReadingProgress';

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
      <body className="antialiased min-h-screen bg-[#07070f] text-slate-100">
        <ReadingProgress />
        <main>{children}</main>
      </body>
    </html>
  );
}
