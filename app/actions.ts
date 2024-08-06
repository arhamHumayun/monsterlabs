'use server';

import { redirect } from 'next/navigation'
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client'
import { User } from '@supabase/supabase-js';
import { creaturesDocument } from '@/types/db';

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

export async function logOut(): Promise<void> {
  const supabase = await createSupabaseAppServerClient();
  await supabase.auth.signOut();
  return redirect('/')
}

export async function getUser(): Promise<User | null> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  const { user } = data;
  return user;
}

export async function getCreatureById(id: number): Promise<creaturesDocument | null> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('creatures')
    .select(`*`)
    .eq('id', id)
    .limit(1)
    .single();

  if (error || !data || data.length === 0) {
    console.error('Failed to get creature by id:', error);
    return null;
  }

  return data;
}

export async function getCreaturesByUserId(userId: string): Promise<creaturesDocument[] | null> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('creatures')
    .select('*')
    .eq('user_id', userId);

  console.log(`data from getCreaturesByUserId`, JSON.stringify(data, null, 2));

  if (error || !data || data.length === 0) {
    return null;
  }

  return data;
}
