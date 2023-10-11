"use client";
import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Icons from './Icons';
import { MainNav } from './MainNav';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

import { Button, Avatar, Menu, Dropdown } from 'antd';
import type { MenuProps } from 'antd';

import SubscriptionModal from './JobListNew/SubscribeJobModal';


export const config = { ssr: false };


export function SiteHeader() {
  const { data: session } = useSession();
  console.log(session)
  const [isModalVisible, setIsModalVisible] = useState(false);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link href="/profile" legacyBehavior>
          <a>个人中心</a>
        </Link>
      )
    },
    {
      key: '2',
      label: (
        <span>登出</span>
      ),
      onClick: () => {
        signOut()
      }
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {/* <ThemeToggle /> */}
            <Button
              type="primary"
              style={{
                background: '#fff',
                color: '#000'
              }}
              shape="round"
              onClick={() => {
                setIsModalVisible(true)
              }}
            >
              🔔 Job Alert
            </Button>
            {session?.user ? (
              <>
                <Dropdown menu={{ items }} trigger={['hover']}>
                  <Avatar size={40} src={session?.user?.image ? <img src={session?.user?.image} /> : ''}>{session?.user?.name?.[0]}</Avatar>
                </Dropdown>
              </>
            ) : (
              <Button
                type="primary"
                icon={<Icons.google className="h-4 w-4" />}
                style={{
                  background: '#000',
                }}
                shape="round"
                onClick={() => {
                  // signInWithGooglePopup()
                  signIn("google", undefined, {
                    prompt: 'select_account',
                  })
                }}
              >
                Google Login
              </Button>
            )}
          </nav>
        </div>
      </div>

      <SubscriptionModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />

    </header>
  );
}