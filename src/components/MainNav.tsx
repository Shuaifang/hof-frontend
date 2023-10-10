import React from 'react';
import Link from 'next/link';
import { Menu, Dropdown } from 'antd';
import { useTranslations } from 'next-intl';

import Icons from './Icons';
import { useConfig } from '@/contexts/GlobalContext';

export interface NavItem {
  title: React.ReactNode;
  href: string;
  children?: NavItem[];
}

export function MainNav() {
  const t = useTranslations();
  const { state: { data: configData } } = useConfig();

  const staticNavItems: NavItem[] = [
    {
      title: t('nav.home'),
      href: '/',
    },
  ];

  const dynamicNavItems = configData?.header.infoList.map(item => ({
    title: item.title,
    href: (item.link === '/jobs/list' ? '/jobs' : item.link) + '?pageId=' + item.id + '&infoId=' + item.info_id,
    children: Array.isArray(item.children) ? item.children.map(child => ({
      title: child.title,
      href: (child.link === '/jobs/list' ? '/jobs' : child.link) + '?pageId=' + child.id + '&infoId=' + child.info_id,
    })) : []
  })) || [];

  const NavItems = [...staticNavItems, ...dynamicNavItems.slice(1)];
  // console.log('NavItems',NavItems)
  const menu = (
    <Menu>
      {NavItems.map((item, index) => (
        !item.children || item.children.length === 0
          ? <Menu.Item key={index}>
            {item.href.includes('http')
              ? <a href={item.href} target="_blank" rel="noopener noreferrer">{item.title}</a>
              : <Link href={item.href}><a>{item.title}</a></Link>
            }
          </Menu.Item>
          : <Menu.SubMenu key={index} title={item.title}>
            {item.children.map((child, childIndex) => (
              <Menu.Item key={childIndex}>
                {child.href.includes('http')
                  ? <a href={child.href} target="_blank" rel="noopener noreferrer">{child.title}</a>
                  : <Link href={child.href}><a>{child.title}</a></Link>
                }
              </Menu.Item>
            ))}
          </Menu.SubMenu>
      ))}
    </Menu>
  );


  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/">
        <div className="hidden items-center space-x-2 md:flex">
          <Icons.logo className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            HaoOffer.net
          </span>
        </div>
      </Link>
      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6">
        {NavItems.map((item, index) => (
          !item.children || item.children.length === 0
            ? item.href.includes('http')
              ? <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-600 hover:text-slate-900 dark:text-slate-100"
              >
                {item.title}
              </a>
              : <Link key={index} href={item.href} className="font-bold text-slate-600 hover:text-slate-900 dark:text-slate-100">
                {item.title}
              </Link>
            : <Dropdown key={index} overlay={(
              <Menu>
                {item.children.map((child, childIndex) => (
                  <Menu.Item key={childIndex}>
                    {child.href.includes('http')
                      ? <a href={child.href} target="_blank" rel="noopener noreferrer">
                        {child.title}
                      </a>
                      : <Link href={child.href}>
                        {child.title}
                      </Link>
                    }
                  </Menu.Item>
                ))}
              </Menu>
            )}>
              <a className="font-bold text-slate-600 hover:text-slate-900 dark:text-slate-100 cursor-pointer">
                {item.title}
              </a>
            </Dropdown>
        ))}
      </div>
      {/* Mobile Menu */}
      <Dropdown overlay={menu} className="md:hidden">
        <div className="btn">
          <Icons.logo className="mr-2 h-4 w-4" />{' '}
          <span className="font-bold">Menu</span>
        </div>
      </Dropdown>
    </div>
  );
}
