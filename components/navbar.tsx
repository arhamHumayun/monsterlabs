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


export function Navbar() {
  let navItemList = [
    { title: 'Home', href: '/' },
    { title: 'About us', href: '/about' },
  ];

  const navItems = navItemList.map((navItem, i) => {
    return (
      <div className="p-3 items-center" key={i}>
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
    <NavigationMenu>
      <NavigationMenuList>
        {navItems}
        <ModeToggle/>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
