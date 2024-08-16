'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export function LoginButton({
  message
} : {
  message?: string
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  const supabase = createSupabaseBrowserClient();

  const loginWithGoogle = async () => {
    const { data } = await supabase.auth.getUser();

    const user = data?.user;

    setIsLoading(true);
    if (user && !user.is_anonymous) {
      console.log('user is already signed in', user.id, user.email);
      return;
    }

    if (user && user.is_anonymous) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
    }

    if (!user) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
    }
  };

  return (
    <Button variant="default" onClick={loginWithGoogle} disabled={isLoading} className='max-w-3xl'>
      {isLoading ? <Loader2 className="mr-2 animate-spin" /> : null}
      { message ? message : 'Sign in with Google'}
    </Button>
  );
}
