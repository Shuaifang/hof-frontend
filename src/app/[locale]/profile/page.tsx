'use client';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';

export default function Page() {
    const session = useSession();

    return (
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            <div className='w-full text-3xl text-[#444] text-center'>🎯 Hi {session.data?.user?.name} 您在HaoOffer已经申请了3个职位</div>
            
        </section>
    );
}