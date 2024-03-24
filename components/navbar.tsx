'use client';

import * as React from 'react';
import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { ModeToggle } from './dark-mode-toggle';

type NavbarItemAlignment = 'justify-self-end' | 'justify-self-start';

export function Navbar() {
  let navItemList = [
    { title: 'Home', href: '/', alignment: 'justify-self-start'},
    { title: 'About', href: '/about', alignment: 'justify-self-start'},
    { title: 'Login', href: '/login', alignment: 'justify-self-end'},
    { title: 'Sign up', href: '/signup', alignment: 'justify-self-end'},
  ];

  const navItems = navItemList.map((navItem, i) => {
    return (
      <div className={`p-2 px-4 items-center`} key={i}>
        <NavigationMenuItem>
          <Link href={navItem.href} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {navItem.title}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </div>
    );
  });

  return (
    <NavigationMenu className='mx-auto'>
      <NavigationMenuList>
        {navItems}
        <ModeToggle/>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
