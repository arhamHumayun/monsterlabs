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
import { User } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { Button } from './ui/button';

export function Navbar(
  { user }: { user: User | undefined }
) {

  const supabase = createSupabaseBrowserClient();

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    })
  }

  let navItemList = [
    { title: 'Create Creature', href: '/', alignment: 'justify-self-start'},
    { title: 'Browse', href: '/browse', alignment: 'justify-self-start'},
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
          {
            navItem.href === '/sign-in' && !user ? (
              <Button variant='ghost' onClick={loginWithGoogle}>Login</Button>
            ) : (
              <Link href={navItem.href} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {navItem.title}
              </NavigationMenuLink>
            </Link>
            )
          }
        </NavigationMenuItem>
      </div>
    );
  });

  return (
    <NavigationMenu className='mx-auto max-w-2xl'>
      <NavigationMenuList>
        {navItems}
        <NavigationMenuItem className='p-2 px-4 items-center'>
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
