import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/shared/Providers';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'React StarWars (Next.js)',
  description: 'Migrated to Next.js App Router with SSR',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-white antialiased">
        <Providers>
          <header className="border-b border-white/10">
            <nav className="mx-auto max-w-5xl px-4 py-4 flex items-center gap-6">
              {/* временно обычные Link; позже заменим на next-intl createNavigation */}
              <Link href="/" className="font-semibold">Home</Link>
              <Link href="/about">About</Link>
            </nav>
          </header>

          <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>

          <footer className="mx-auto max-w-5xl px-4 py-10 text-sm text-white/60">
            © {new Date().getFullYear()} React StarWars
          </footer>
        </Providers>
      </body>
    </html>
  );
}
