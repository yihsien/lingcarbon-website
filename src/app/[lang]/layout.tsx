/* app/[lang]/layout.tsx */
import type { Metadata } from 'next';
import '../globals.css'; // one level up to app/
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/components/LanguageProvider';

// Generate static pages for both English and Chinese
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'zh' }];
}

// Dynamic metadata based on current locale
export async function generateMetadata({
  params,
}: {
  params: { lang: 'en' | 'zh' };
}): Promise<Metadata> {
  const { lang } = await params;

  if (lang === 'zh') {
    return {
      title: '零碳科技｜全方位碳管理解決方案',
      description:
        '零碳科技（LingCarbon）結合資料科學與軟體工程，提供溫室氣體盤查、碳足跡計算與客製化碳管理規劃服務。',
      alternates: {
        canonical: '/zh',
        languages: { 'en-US': '/en', 'zh-TW': '/zh' },
      },
      icons: {
        icon: '/favicon.png',
        shortcut: '/favicon.png',
        apple: '/favicon.png',
      },
    };
  }

  return {
    title: 'LingCarbon – Sustainable Carbon Solutions',
    description:
      'LingCarbon empowers organizations with cutting-edge services for carbon accounting, footprint calculation, and net‑zero planning.',
    alternates: {
      canonical: '/en',
      languages: { 'en-US': '/en', 'zh-TW': '/zh' },
    },
    icons: {
      icon: '/favicon.png',
      shortcut: '/favicon.png',
      apple: '/favicon.png',
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: 'en' | 'zh' }>;
}) {
  // Await the params object before accessing its properties
  const { lang } = await params;
  
  return (
    <html
      lang={lang === 'zh' ? 'zh-Hant' : 'en'}
      className="dark"
      suppressHydrationWarning
    >
      {/*  ^^^^^  class matches your defaultTheme */}
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
        {/* JSON‑LD Organization schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'LingCarbon',
              alternateName: '零碳科技股份有限公司',
              url: 'https://www.lingcarbon.com',
              logo: 'https://www.lingcarbon.com/favicon.png',
            }),
          }}
        />
        {/* hreflang links */}
        <link rel="alternate" href="https://www.lingcarbon.com/" hrefLang="en" />
        <link rel="alternate" href="https://www.lingcarbon.com/zh" hrefLang="zh-Hant" />
      </head>

      <body className="font-satoshi bg-white dark:bg-black">
        {/* Global animated background */}
        <div className="animated-blob-container">
          <div className="animated-blob blob-1" />
          <div className="animated-blob blob-2" />
          <div className="animated-blob blob-3" />
        </div>

        <ThemeProvider defaultTheme="dark" storageKey="lingcarbon-theme">
          <LanguageProvider initialLang={lang}>
            <div className="relative z-10">{children}</div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}