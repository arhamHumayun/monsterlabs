'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { logOut } from '@/app/actions'

export function LogOutButton() {
  return (
    <Button
      variant="secondary"
      onClick={() => logOut()}
      className='justify-self-center rounded'
    >
      Log out
    </Button>
  )
}
