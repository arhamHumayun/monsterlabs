'use server';

import { redirect } from 'next/navigation'
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client'
import { creatureDocument, creatureView, creatureViewDataPartial } from '@/types/db';
import { User } from '@supabase/supabase-js';
import { mapCreatureDocumentToCreatureView, mapCreatureViewDocumentToCreatureView, mapGetCreatureByUserId } from '@/lib/utils';

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

export async function getCreatureById(id: number): Promise<creatureView | null> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('creatures')
    .select(`
      *,
      creatures_data(*)
    `)
    .eq('id', id)
    .order('id', { ascending: false })

  if (error || !data || data.length === 0) {
    return null;
  }

  console.log(`data`, JSON.stringify(data, null, 2));

  const returnObject = mapCreatureDocumentToCreatureView(data[0]);

  console.log(`returnObject`, JSON.stringify(returnObject, null, 2));

  return returnObject;
}

export async function getCreatureByCreatureDataId(id: number): Promise<creatureView | null> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('creatures_data')
    .select(`
    *,
    creatures (*)
  `)
    .eq('id', id).
    order('id', { ascending: false }).limit(1).single();

  if (!data || error) {
    return null;
  }

  const returnObject = mapCreatureViewDocumentToCreatureView(data)
  return returnObject;
}

export async function getCreaturesByUserId(userId: string): Promise<creatureViewDataPartial[] | null> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('creatures')
    .select(`
      *,
      creatures_data (
        id,
        creature_id,
        created_at,
        is_published,
        name,
        lore
      )
    `)
    .eq('user_id', userId);

  if (error || !data || data.length === 0) {
    return null;
  }

  const returnObject = data.map(val => mapGetCreatureByUserId(val))

  return returnObject;
}

export async function getAllPublicCreatures(): Promise<creatureView[]> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('creatures_data')
    .select(`
    *,
    creatures (*)
  `)
    .eq('is_published', true);

  if (!data || data.length === 0) {
    return [];
  }

  const returnObject = data.map(val => mapCreatureViewDocumentToCreatureView(val));

  return returnObject;
}
