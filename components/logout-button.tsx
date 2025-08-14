'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation'

export function LogOutButton() {

  const supabase = createSupabaseBrowserClient();
  const router = useRouter()

  return (
    <Button
      variant="secondary"
      onClick={async () => {
        await supabase.auth.signOut();
        router.push('/')
      }}
      className='justify-self-center rounded w-fit'
    >
      Log out
    </Button>
  )
}
