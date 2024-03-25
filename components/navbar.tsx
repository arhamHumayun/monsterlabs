"use client";
import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { ModeToggle } from './dark-mode-toggle';

import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation'

export function Navbar(
  { user }: { user: User | undefined }
) {

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/logged-out');
  }

  let navItemList = [
    { title: 'Home', href: '/', alignment: 'justify-self-start'},
    { title: 'About', href: '/about', alignment: 'justify-self-start'}
  ];

  if (!user) {
    navItemList.push({ title: 'Login', href: '/sign-in', alignment: 'justify-self-end'});
  } else {
    navItemList.push({ title: 'Profile', href: '/profile', alignment: 'justify-self-end'});
  }

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

  if (user) {
    navItems.push(
      <div className={`p-2 px-4 items-center`} key={navItems.length}>
        <NavigationMenuItem>
          <button onClick={logout} className={navigationMenuTriggerStyle()}>
            Logout
          </button>
        </NavigationMenuItem>
      </div>
    );
  }

  return (
    <NavigationMenu className='mx-auto'>
      <NavigationMenuList>
        {navItems}
        <ModeToggle/>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
