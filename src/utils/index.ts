import { getSession } from 'next-auth/react';

export const isLoggedIn = async () => {
    const session: any = await getSession();
    return !!session?.token?.token;
};