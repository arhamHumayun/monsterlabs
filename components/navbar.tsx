'use client';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { useState } from 'react';

export function Navbar({ user }: { user: User | null }) {
  const supabase = createSupabaseBrowserClient();

  const [sheetOpen, setSheetOpen] = useState(false);

  const loginWithGoogle = async () => {
    const getURL = () => {
      let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        'http://localhost:3000';
      // Make sure to include `https://` when not localhost.
      url = url.includes('http') ? url : `https://${url}`;
      // Make sure to include a trailing `/`.
      url = url.charAt(url.length - 1) === '/' ? url : `${url}`;
      return url;
    };

    const redirectUrl = `${getURL()}/auth/callback`;

    const { data, error } = await supabase.auth.getUser();
    const existingUser = data?.user;
    if (existingUser && existingUser.is_anonymous) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
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
        },
      });
    }
  };

  return (
    <div>
      <NavigationMenu className="mx-auto max-w-2xl collapse sm:visible">
        <NavigationMenuList>
          <NavigationMenuItem className="p-2 px-4 items-center">
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/"
            >
              Create
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="p-2 px-4 items-center">
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/browse/creatures/1"
            >
              Browse Creatures
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="p-2 px-4 items-center">
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/browse/items/1"
            >
              Browse Items
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="p-2 px-4 items-center">
            <ModeToggle />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Sheet open={sheetOpen}>
        <SheetTrigger className="fixed top-0 left-0 p-2 visible sm:collapse">
          <Button
            variant={'outline'}
            onClick={() => {
              setSheetOpen(true);
            }}
          >
            Open
          </Button>
        </SheetTrigger>
        <SheetContent side={'left'}>
          <SheetHeader>
            <SheetTitle>Navigate To</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant={'ghost'}
              onClick={() => {
                setSheetOpen(false);
              }}
              asChild
            >
              <Link href="/">Create</Link>
            </Button>
            <Button
              variant={'ghost'}
              onClick={() => {
                setSheetOpen(false);
              }}
              asChild
            >
              <Link href="/browse/creatures/1">Browse Creatures</Link>
            </Button>
            <Button
              variant={'ghost'}
              onClick={() => {
                setSheetOpen(false);
              }}
              asChild
            >
              <Link href="/browse/items/1">Browse Items</Link>
            </Button>
            {!user || user.is_anonymous ? (
              <Button variant={'ghost'} onClick={loginWithGoogle}>
                Login
              </Button>
            ) : (
              <Button
                variant={'ghost'}
                onClick={() => {
                  setSheetOpen(false);
                }}
                asChild
              >
                <Link href="/profile">Profile</Link>
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
