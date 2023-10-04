'use client'

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';

import { SiteHeader } from '@/components/SiteHeader';
import ThemeProvider from '@/components/ThemeProvider';
import { SessionProvider } from 'next-auth/react';

export const config = { ssr: false };
export default async function RootLayout({
  children,
  params: { locale },
  session,  // Add this line to get the session from your pageProps
}: {
  children: React.ReactNode;
  params: Record<string, any>;
  session?: any;  // Add this line to define the session in your type
}) {
  let messages;
  try {
    messages = (await import(`@/locale/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

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
