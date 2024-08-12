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
  { user }: { user: User | null }
) {

  const supabase = createSupabaseBrowserClient();

  const loginWithGoogle = async () => {

    const getURL = () => {
      let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        'http://localhost:3000'
      // Make sure to include `https://` when not localhost.
      url = url.includes('http') ? url : `https://${url}`
      // Make sure to include a trailing `/`.
      url = url.charAt(url.length - 1) === '/' ? url : `${url}`
      return url
    }

    console.log(`${getURL()}/auth/callback`)

    const redirectUrl = `${getURL()}/auth/callback`;

    const { data, error } = await supabase.auth.getUser();
    const existingUser = data?.user;
    if (existingUser && existingUser.is_anonymous) {
      await supabase.auth.linkIdentity({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
    } else {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
    }
  }

  let navItemList = [
    { title: 'Create', href: '/', alignment: 'justify-self-start'},
    { title: 'Browse', href: '/browse', alignment: 'justify-self-start'},
  ];

  if (!user || user.is_anonymous) {
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
