import { getSession } from 'next-auth/react';

export const isLoggedIn = async () => {
    const session: any = await getSession();
    return !!session?.token?.token;
};

export function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export function convertKeysToCamelCase(obj: Record<string, any>): Record<string, any> {
    const newObj: Record<string, any> = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[toCamelCase(key)] = obj[key];
        }
    }
    return newObj;
}
