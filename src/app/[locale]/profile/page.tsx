'use client';
import { useTranslations } from 'next-intl';

import { useSession, signIn, signOut, getSession } from 'next-auth/react';
export default function Page() {
    const t = useTranslations('site');
    const ssession = useSession();
    const session = getSession().then(res=>{
        console.log('session',res)
    });
    
    return (
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            {JSON.stringify(ssession)}
        </section>
    );
}
