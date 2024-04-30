import { CreatureLink } from "@/components/creature-link";
import { Separator } from "@/components/ui/separator";
import { createSupabaseAppServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";
import { getCreaturesByUserId } from "../actions";
import { creatureDocument } from "@/types/db";
import { Button } from "@/components/ui/button";
import { LogOutButton } from "@/components/logout-button";
import Link from "next/link";

export default async function Profile() {

  const supabase = await createSupabaseAppServerClient();
  const session = (await supabase.auth.getSession()).data.session;
  const user = session?.user;

  const userId = user?.id;

  if (!userId) {
    redirect('/sign-in');
  }

  const creatures = await getCreaturesByUserId(userId)

  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-lg font-semibold">Your creations</h1>
      <Separator className="mb-4"/>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {creatures ? creatures.map((creature : creatureDocument) => (
          <CreatureLink key={creature.id} id={creature.id} creature={creature.json} type='edit' />
        )) : (
          <div>
            <p className="mb-4">You have no creatures.</p>
            <Button asChild>
              <Link href="/">Create</Link>
            </Button>
          </div>
        )}
      </div>
      <Separator className="my-4"/>
      <LogOutButton/>
      <Button 
      className="mx-2"
      asChild
      >
        <Link
        href="/pro"
        >
          Get Pro
        </Link>
      </Button>
    </div>
  )
}
