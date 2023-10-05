'use client'

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';

import { SiteHeader } from '@/components/SiteHeader';
import ThemeProvider from '@/components/ThemeProvider';
import { SessionProvider } from 'next-auth/react';

export const config = { ssr: false };
export default function RootLayout(params: any) {
  if (!params) {
    return null;
  }
  const {
    children,
    // params1,
    session,  // Add this line to get the session from your pageProps
  } = params;
  let messages = {
    site: {
      title: 'HaoOffer.net - 北美秋季招聘必备',
      desc: '已帮助300+学员斩获北美顶级offer'
    },
    nav: { home: '首页' },
    theme: { light: '亮色', dark: '暗色', system: '系统' }
  };
  const locale = 'zh-CN'
  console.log('locale', locale)

  return (
    <html lang={locale}>
      <head />
      <body>
        <SessionProvider session={session}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider locale={locale}>
              <SiteHeader />
              <main>{children}</main>
            </ThemeProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

// export async function generateMetadata(): Promise<Metadata> {
//   const t = await getTranslations('site');
//   const title = t('title');
//   const description = t('desc');

//   return {
//     title,
//     description,
//     icons: {
//       icon: '/favicon.ico',
//     },
//   };
// }
