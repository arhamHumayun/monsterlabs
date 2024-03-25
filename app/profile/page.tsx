import { createSupabaseAppServerClient } from "@/lib/supabase/server-client";
import { creatureSchemaType } from "@/types/creature";
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

  if (!creatures) {
    return (
      <div>
        <h1>No creatures found</h1>
      </div>
    )
  }

  const creaturesJson = creatures.map(creatures => creatures.json) as creatureSchemaType[];

  console.log("creatures as json: ", creaturesJson);

  return (
    <div className="grid grid-cols-3 gap-4">
      {creaturesJson.map((creature) => (
        <div key={creature.name} className="p-4 rounded-md border border-gray-200">
          <h2 className="text-lg font-bold">{creature.name}</h2>
        </div>
      ))}
    </div>
  )
}
