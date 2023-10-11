// @ts-nocheck
'use client';

import { signIn } from "next-auth/react";

export default function Page() {
    signIn("google", undefined, {
        prompt: 'select_account',
    })
    return (<>
        <div></div>
    </>)
}