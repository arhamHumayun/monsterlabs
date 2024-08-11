import { getCreatureById } from "@/app/not-actions";
import CreatureBlock from "@/components/creature-block";
import { creatureSchema } from "@/types/creature";

export default async function ViewMonster(
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
    </div>
  )
}
