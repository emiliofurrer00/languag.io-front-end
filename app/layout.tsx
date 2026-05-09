import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from './AuthProvider';
import { AppChrome } from '@/components/layout/AppChrome';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Languag.io',
  description: 'Language learning web app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="">
        <AuthProvider>
          <AppChrome>
            <div className="h-full bg-neutral-50">{children}</div>
          </AppChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
