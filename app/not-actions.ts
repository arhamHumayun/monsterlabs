import { createSupabaseAppServerClient } from "@/lib/supabase/server-client";
import { creaturesDocument } from "@/types/db/creature";
import { itemsDocument } from "@/types/db/item";
import { User } from "@supabase/supabase-js";

export async function getCreatureById(id: number): Promise<creaturesDocument | null> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('creatures')
    .select(`*`)
    .eq('id', id)
    .single();

  if (error || !data || data.length === 0) {
    console.error('Failed to get creature by id:', error);
    return null;
  }

  return data;
}

export async function getItemById(id: number): Promise<itemsDocument | null> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('items')
    .select(`*`)
    .eq('id', id)
    .single();

  if (error || !data || data.length === 0) {
    console.error('Failed to get item by id:', error);
    return null;
  }

  return data;
}
