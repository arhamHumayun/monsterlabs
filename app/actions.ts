'use server';

import { redirect } from 'next/navigation'
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client'
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