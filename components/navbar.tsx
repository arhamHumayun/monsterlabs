import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { ModeToggle } from './dark-mode-toggle';
import { Button } from './ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Menu } from 'lucide-react';
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client';
export async function Navbar() {
  const supabase = await createSupabaseAppServerClient();

  let {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('User signed in');
      user = session!.user;
    } else if (event === 'USER_UPDATED') {
      console.log('User updated');
      user = session!.user;
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      user = null;
    }
  });

  return (
    <div>
      <div className="block md:hidden">
        <Sheet>
          <SheetTrigger className="top-0 left-0 p-4 rounded-md border-1">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side={'left'}>
            <SheetHeader>
              <SheetTitle className="text-center">Navigate To</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <SheetClose asChild>
                <Button variant={'ghost'} asChild>
                  <Link href="/">Create</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant={'ghost'} asChild>
                  <Link href="/browse/creatures">Browse Creatures</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant={'ghost'} asChild>
                  <Link href="/browse/items">Browse Items</Link>
                </Button>
              </SheetClose>
              {!user || user.is_anonymous ? (
                <SheetClose asChild>
                  <Button variant={'ghost'} asChild>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                </SheetClose>
              ) : (
                <SheetClose asChild>
                  <Button variant={'ghost'} asChild>
                    <Link href="/your-creations">Your Creations</Link>
                  </Button>
                </SheetClose>
              )}
              {user && !user.is_anonymous ? (
                <SheetClose asChild>
                  <Button variant={'ghost'} asChild>
                    <Link href="/profile">Profile</Link>
                  </Button>
                </SheetClose>
              ) : null}
              <SheetClose asChild>
                <ModeToggle />
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <NavigationMenu className="mx-auto max-w-2xl hidden md:block">
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
              href="/browse/creatures"
            >
              Browse Creatures
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="p-2 px-4 items-center">
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/browse/items"
            >
              Browse Items
            </NavigationMenuLink>
          </NavigationMenuItem>
          {!user || user.is_anonymous ? (
            <NavigationMenuItem className="p-2 px-4 items-center">
              <Button variant={'ghost'} asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem className="p-2 px-4 items-center">
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/your-creations"
              >
                Your Creations
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
          {user && !user.is_anonymous ? (
            <NavigationMenuItem className="p-2 px-4 items-center">
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/profile"
              >
                Profile
              </NavigationMenuLink>
            </NavigationMenuItem>
          ) : null}
          <NavigationMenuItem className="p-2 px-4 items-center">
            <ModeToggle />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
