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

  if (error || !data || data.length === 0) {
    return null;
  }

  return data;
}

export async function getAllCreatures(page: number, monstersPerPage: number) : Promise<{
  id: number,
  name: string,
}[] | null>
{
  const supabase = await createSupabaseAppServerClient();

  const rangeStart = (page - 1) * monstersPerPage;
  const rangeEnd = page * monstersPerPage;

  const { data, error } = await supabase
    .from('creatures')
    .select(`id, name`)
    .order('created_at', { ascending: false })
    .range(rangeStart, rangeEnd);

  if (error || !data || data.length === 0) {
    return null;
  }

  return data;
}

export async function getCountOfCreatures() : Promise<number | null>
{
  const supabase = await createSupabaseAppServerClient();
  const { count, error } = await supabase
    .from('creatures')
    .select('*', { count: 'estimated' })

  if (error || !count) {
    return null;
  }

  return count;
}

export async function updateCreature(creature: creaturesDocument): 
Promise<{ data: creaturesDocument | null}> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('creatures')
    .update(creature)
    .eq('id', creature.id)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Failed to update creature:', error);
    return {
      data: null
    }
  }

  return {
    data,
  };
}