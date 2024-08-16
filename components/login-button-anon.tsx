'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'

import { Button  } from '@/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client'

export function LoginButtonAnon() {
  const [isLoading, setIsLoading] = React.useState(false)
  
  const supabase = createSupabaseBrowserClient();

  const loginWithGoogle = async () => {
    setIsLoading(true)
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

  return (
    <Button
      variant="default"
      onClick={loginWithGoogle}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 animate-spin" />
      ) : null}
      Sign in with Google
    </Button>
  )
}