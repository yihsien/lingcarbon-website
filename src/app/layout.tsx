/* app/layout.tsx */
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/components/LanguageProvider';

export const metadata: Metadata = {
  title: 'LINGCARBON - Sustainable Carbon Solutions',
  icons: {
    icon: '/Favicon.png',
    shortcut: '/Favicon.png',
    apple: '/Favicon.png',
  },
  description:
    'LINGCARBON empowers organizations with cutting-edge services for carbon accounting, footprint calculation, and achieving carbon neutrality.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      {/*  ^^^^^  class matches your defaultTheme */}
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="font-satoshi bg-white dark:bg-black">
        {/* Global animated background */}
        <div className="animated-blob-container">
          <div className="animated-blob blob-1" />
          <div className="animated-blob blob-2" />
          <div className="animated-blob blob-3" />
        </div>

        <ThemeProvider defaultTheme="dark" storageKey="lingcarbon-theme">
          <LanguageProvider>
            <div className="relative z-10">{children}</div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}