'use server';

import { redirect } from 'next/navigation'
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client'
import { User } from '@supabase/supabase-js';
import { creaturesDocument } from '@/types/db/creature';
import { itemsDocument } from '@/types/db/item';

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

export async function getItemsByUserId(userId: string): Promise<itemsDocument[] | null> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', userId);

  if (error || !data || data.length === 0) {
    return null;
  }

  return data;
}

export async function getAllCreatures(page: number, monstersPerPage: number, sortingOrder: "latest" | "alphabetical"): Promise<{
  id: number,
  name: string,
}[] | null> {
  const supabase = await createSupabaseAppServerClient();

  const rangeStart = (page - 1) * monstersPerPage;
  const rangeEnd = page * monstersPerPage;

  const orderingColumn = sortingOrder === 'latest' ? 'created_at' : 'name';
  const ascending = sortingOrder === 'alphabetical';

  const { data, error } = await supabase
    .from('creatures')
    .select(`id, name`)
    .order(orderingColumn, { ascending })
    .range(rangeStart, rangeEnd);

  if (error || !data || data.length === 0) {
    return null;
  }

  return data;
}

export async function getAllItems(page: number, itemsPerPage: number, sortingOrder: "latest" | "alphabetical"): Promise<{
  id: number,
  name: string,
}[] | null> {
  const supabase = await createSupabaseAppServerClient();

  const rangeStart = (page - 1) * itemsPerPage;
  const rangeEnd = page * itemsPerPage;

  const orderingColumn = sortingOrder === 'latest' ? 'created_at' : 'name';
  const ascending = sortingOrder === 'alphabetical';

  const { data, error } = await supabase
    .from('items')
    .select(`id, name`)
    .order(orderingColumn, { ascending })
    .range(rangeStart, rangeEnd);

  if (error || !data || data.length === 0) {
    return null;
  }

  return data;
}

export async function updateCreature(creature: creaturesDocument): Promise<{ data: creaturesDocument | null }> {
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

export async function updateItem(item: itemsDocument): Promise<{ data: itemsDocument | null }> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('items')
    .update(item)
    .eq('id', item.id)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Failed to update item:', error);
    return {
      data: null
    }
  }

  return {
    data,
  };
}