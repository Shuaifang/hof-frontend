'use client'

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';

import { SiteHeader } from '@/components/SiteHeader';
import ThemeProvider from '@/components/ThemeProvider';
import { SessionProvider } from 'next-auth/react';

export const config = { ssr: false };
export default async function RootLayout(params:any) {
  if(!params) {
    return null;
  }
  const {
    children,
    // params1,
    session,  // Add this line to get the session from your pageProps
  } = params;
  let messages;
  const locale = 'zh-CN'
  try {
    messages = (await import(`@/locale/messages/${locale}.json`)).default;
    console.log('messages',messages)
  } catch (error) {
    notFound();
  }

  console.log('locale',locale)

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
