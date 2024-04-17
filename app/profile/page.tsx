import { CreatureLink } from "@/components/creature-link";
import { Separator } from "@/components/ui/separator";
import { createSupabaseAppServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";
import { getCreaturesByUserId } from "../actions";
import { creatureDocument } from "@/types/db";
import { Button } from "@/components/ui/button";
import { LogOutButton } from "@/components/logout-button";

export default async function Profile() {

  const supabase = await createSupabaseAppServerClient();
  const session = (await supabase.auth.getSession()).data.session;
  const user = session?.user;

  const userId = user?.id;

  if (!userId) {
    redirect('/sign-in');
  }

  const creatures = await getCreaturesByUserId(userId)

  if (!creatures) {
    return (
      <div>
        <h1>No creatures found</h1>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-lg font-bold">Your creatures</h1>
      <Separator className="mb-4"/>
      <div className="grid grid-cols-4 gap-4">
        {creatures.map((creature : creatureDocument) => (
          <CreatureLink key={creature.id} id={creature.id} creature={creature.json}/>
        ))}
      </div>
      <Separator className="my-4"/>
      <LogOutButton/>
    </div>
  )
}
