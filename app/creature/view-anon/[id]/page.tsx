
import { getCreatureById } from "@/app/actions";
import CreatureBlock from "@/components/creature-block";
import { LoginButton } from "@/components/login-button";
import ShareCreatureButton from "@/components/share-creature-button";
import { Button } from "@/components/ui/button";
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
      <ShareCreatureButton id={id} textOverride="Share this creature!" />
      <CreatureBlock creature={creatureData} />
      <div className="grid grid-cols-1 gap-4 mt-4 mb-2 place-items-center">
        <h1 className="text-gray-200 text-center">
        Sign in with Google to save and edit your creatures. This creature will be saved.
        </h1>
        <LoginButton message="Sign in with Google."/>
      </div>
    </div>
  )
}

