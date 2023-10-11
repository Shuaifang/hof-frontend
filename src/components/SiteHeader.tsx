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

function signInWithGooglePopup() {
  const googleLoginWindow = window.open(
    '/api/auth/signin/google', // 此 URL 应该指向 NextAuth 的 Google 登录路由
    '_blank',
    'width=500,height=800'
  );

  const checkLoginStatus = setInterval(() => {
    if (googleLoginWindow?.closed) {
      clearInterval(checkLoginStatus);
      // 检查用户是否在弹出窗口中登录
      fetch('/api/auth/session')
        .then(res => res.json())
        .then(session => {
          console.log('session', session)
          if (session.user) {
            // 用户已登录，可以进行页面重定向或其他操作
            location.reload();
          }
        });
    }
  }, 500);
}

export function SiteHeader() {
  const { data: session } = useSession();

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
                  <Avatar size={40} src={<img src='https://lh3.googleusercontent.com/a/ACg8ocLPeXuzjAt6UTFMmZgCwIi_HMHo-GqAfBJlx3fqkgbojm0=s96-c' />}>{session?.user?.name?.[0]}</Avatar>
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