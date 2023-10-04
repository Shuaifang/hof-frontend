'use client'

import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
      asd
    </SessionProvider>
  );
}

export default MyApp;
