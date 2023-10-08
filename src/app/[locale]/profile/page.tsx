// @ts-nocheck
'use client';

import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import JobList from '@/components/JobListNew/JobList';
export default function Page() {
    const session = useSession();

    return (
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            {
                
                session.data?.user ? <>
                    <div className='w-full text-3xl text-[#444] text-center mb-[20px]'>🎯 Hi {session.data?.user?.name} 您在HaoOffer已经申请了3个职位</div>
                    <JobList isApply={true} />
                </>
                    :
                    <>
                        <div className='w-full text-3xl text-[#444] text-center'>请先登录！</div>
                    </>
            }

        </section>
    );
}