"use client";
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Icons from './Icons';
import { MainNav } from './MainNav';
import ThemeToggle from './ThemeToggle';
import { Button } from 'antd';
export const config = { ssr: false };

export function SiteHeader() {
  const { data: session } = useSession();
  console.log('session', session)
  return (
    <header className="sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />

            {session?.user ? (
              <>
                <span>Welcome, {session.user.name || 'Guest'}!</span>
                <Button onClick={() => signOut()} shape="round">
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                icon={<Icons.google className="h-4 w-4" />}
                style={{
                  background: '#000',
                }}
                shape="round"
                onClick={() => signIn("google", undefined, {
                  prompt: 'select_account',
                })}
              >
                Google Login
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}