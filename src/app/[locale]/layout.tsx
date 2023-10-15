'use client'

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';

import { SiteHeader } from '@/components/Common/SiteHeader';
import ThemeProvider from '@/components/Providers/ThemeProvider';
import { SessionProvider } from 'next-auth/react';
import { ConfigProvider } from '@/contexts/GlobalContext';
import { Button } from 'antd';
import Icons from '@/components/Common/Icons';

// export const config = { ssr: false };
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
  const locale = 'en-US'
  console.log('locale', locale)

  return (
    <html lang={locale}>
      <head />
      <body>
        <SessionProvider session={session}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ConfigProvider>
              <ThemeProvider locale={locale}>
                <SiteHeader />
                <main>{children}</main>
                <footer className='text-center font-bold text-[#444] my-[15px]'>
                  <div className='text-center mb-[10px]'>
                    <Button
                      type="primary"
                      icon={<Icons.MessageCircle className="h-4 w-4" style={{
                        transform: 'translateY(3px)'
                      }} />}
                      style={{
                        background: '#000',
                      }}
                      onClick={() => {
                        window.open("https://docs.google.com/forms/d/1EoN8lT3cEXrvbdZ_eu2CPRwlk-0nGryfs23xOaVEJvY")
                      }}
                    >Submit Request</Button>
                  </div>
                  Copyright©2022-2023  haooffer.net All rights reserved

                  <div className='h-[30px]'></div>
                </footer>
              </ThemeProvider>
            </ConfigProvider>
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
