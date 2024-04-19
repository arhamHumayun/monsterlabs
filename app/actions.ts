'use server';

import { redirect } from 'next/navigation'
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client'
import { creatureDocument } from '@/types/db';
import { cache } from 'react';
import { User } from '@supabase/supabase-js';

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

export async function getUser() : Promise<User | null> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  const { user } = data;
  return user;
}

async function getCreatureById(id: number) : Promise<creatureDocument | null> {
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

async function getCreaturesByUserId(userId: string) : Promise<creatureDocument[] | null>  {
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

async function getAllPublicCreatures() : Promise<creatureDocument[]> {
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

const getCreatureByIdCached = getCreatureById;
const getCreaturesByUserIdCached = cache(getCreaturesByUserId);
const getAllPublicCreaturesCached = getAllPublicCreatures

export {
  getCreatureByIdCached as getCreatureById,
  getCreaturesByUserIdCached as getCreaturesByUserId,
  getAllPublicCreaturesCached as getAllPublicCreatures,
}