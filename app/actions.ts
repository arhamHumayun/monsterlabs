'use server';

import { redirect } from 'next/navigation'
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client'

export async function logInToGoogle() {
  const supabase = await createSupabaseAppServerClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { 
      redirectTo: '/auth/callback', 
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    return {
      error: error.message
    }
  }

  return redirect('/')
}
