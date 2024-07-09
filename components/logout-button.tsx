'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export function LogOutButton() {

  const supabase = createSupabaseBrowserClient();

  return (
    <Button
      variant="secondary"
      onClick={() => supabase.auth.signOut()}
      className='justify-self-center rounded'
    >
      Log out
    </Button>
  )
}
