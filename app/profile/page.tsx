import { createSupabaseAppServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

export default async function Profile() {
  
  const supabase = await createSupabaseAppServerClient();
  const session = (await supabase.auth.getSession()).data.session;
  const user = session?.user;

  const userId = user?.id;

  if (!userId) {
    redirect('/sign-in');
  }

  console.log('User ID:', userId);

  const usersCreatures = await supabase
    .from('creatures')
    .select('*')
    .eq('user_id', userId);

  console.log(usersCreatures.data);

  const creatures = usersCreatures.data;

  return (
    <div>
      {JSON.stringify(usersCreatures.data, null, 2)}
    </div>
  )
}
