'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'

import { Loader2 } from 'lucide-react'
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client'
import { redirect } from 'next/navigation'


interface LoginButtonProps extends ButtonProps {
  showGithubIcon?: boolean
  text?: string
}

export function LogoutButton({
  text = 'Log out',
  showGithubIcon = true,
  className,
  ...props
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const logoutWithGoogle = async () => {
    "use server"
    const supabase = await createSupabaseAppServerClient();
    setIsLoading(true)
    await supabase.auth.signOut();
    setIsLoading(false);
    redirect('/')
  }

  return (
    <Button
      variant="outline"
      onClick={logoutWithGoogle}
      disabled={isLoading}
      className={cn(className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 animate-spin" />
      ) : showGithubIcon}
      {text}
    </Button>
  )
}
