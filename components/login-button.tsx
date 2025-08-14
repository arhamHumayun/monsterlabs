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
      return;
    }

    const mainUrl = process.env.NEXT_PUBLIC_VERCEL_URL || location.origin;

    if (!user || user.is_anonymous) {
      const {data, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${mainUrl}/auth/callback`,
        },
      });

      if (error) {
        console.error('error', error);
      }

      if (data) {
        console.log('data', data);
      }
    }
  };

  return (
    <Button variant="default" onClick={loginWithGoogle} disabled={isLoading} className='max-w-3xl'>
      {isLoading ? <Loader2 className="mr-2 animate-spin" /> : null}
      { message ? message : 'Sign in with Google'}
    </Button>
  );
}
