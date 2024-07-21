import { createSupabaseAppServerClient } from "@/lib/supabase/server-client";
import { creaturesDocument } from "@/types/db";
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

  console.log(`data from getCreatureById`, JSON.stringify(data, null, 2));

  return data;
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
