
import { getCreatureById } from "@/app/actions";
import CreatureBlock from "@/components/creature-block";
import { LoginButton } from "@/components/login-button";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { createSupabaseAppServerClient } from "@/lib/supabase/server-client";
import { creatureSchema } from "@/types/creature";

export default async function ViewAnonMonster(
  { params }: { params: { id: number } }
) {

  const { id } = params;  

  const creature = await getCreatureById(id);

  if (!creature) {
    return (
      <div>
        <h1>Creature not found</h1>
      </div>
    )
  }

  const creatureData = creatureSchema.parse({
    name: creature.name,
    lore: creature.lore,
    appearance: creature.appearance,
    pronoun: creature.pronoun,
    type: creature.type,
    isUnique: creature.is_unique,
    challengeRating: creature.challenge_rating / 100,
    alignment: creature.alignment,
    size: creature.size,
    hitDiceAmount: creature.hit_dice_amount,
    ...creature.json,
  });

  return (
    <div>
      <CreatureBlock creature={creatureData} />
      <div className="flex grid-cols-2 gap-4 justify-center mt-4 mb-2">
        <LoginButton message="Sign in with Google to save and edit your creatures."/>
      </div>
    </div>
  )
}

