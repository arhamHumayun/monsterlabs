'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client'

import { Github, Loader, Loader2 } from 'lucide-react'

interface LoginButtonProps extends ButtonProps {
  showGithubIcon?: boolean
  text?: string
}

export function LoginButton({
  text = 'Login with Google',
  showGithubIcon = true,
  className,
  ...props
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  
  const supabase = createSupabaseBrowserClient();

  const loginWithGoogle = async () => {
    setIsLoading(true)
    supabase.auth.signInWithOAuth({
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
      variant="outline"
      onClick={loginWithGoogle}
      disabled={isLoading}
      className={cn(className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 animate-spin" />
      ) : showGithubIcon ? (
        <p>Log in with Google</p>
      ) : null}
      {text}
    </Button>
  )
}
