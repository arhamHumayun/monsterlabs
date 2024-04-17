'use server';

import { redirect } from 'next/navigation'
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client'
import { creatureDocument } from '@/types/db';

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


export async function logOut() : Promise<void> {
  const supabase = await createSupabaseAppServerClient();
  await supabase.auth.signOut();
  return redirect('/')
}

export async function getUser() : Promise<User | {
  error: string
}> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return {
      error: error.message
    }
  }
  const { user } = data;
  return user;
}

export async function getCreatureById(id: string) : Promise<creatureDocument | null> {
  const supabase = await createSupabaseAppServerClient();
  const creature = await supabase
  .from('creatures')
  .select('*')
  .eq('id', id);

  if (!creature.data || creature.data.length === 0) {
    return null;
  }

  return creature.data[0];
}

export async function getCreaturesByUserId(userId: string) : Promise<creatureDocument[] | null>  {
  const supabase = await createSupabaseAppServerClient();
  const creatures = await supabase
    .from('creatures')
    .select('*')
    .eq('user_id', userId);

  if (!creatures.data || creatures.data.length === 0) {
    return null;
  }

  return creatures.data;
}

export async function getAllPublicCreatures() : Promise<creatureDocument[]> {
  const supabase = await createSupabaseAppServerClient();
  const creatures = await supabase
    .from('creatures')
    .select('*')
    .eq('is_public', true);

  if (!creatures.data || creatures.data.length === 0) {
    return [];
  }

  return creatures.data;
}