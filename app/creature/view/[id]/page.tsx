import { getCreatureById, getUser } from "@/app/not-actions";
import CreatureBlock from "@/components/creature-block";
import { Button } from "@/components/ui/button";
import { creatureSchema } from "@/types/creature";
import Link from "next/link";

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

  const user = await getUser();
  const userId = user?.id;

  if (creature && (!userId || creature.user_id !== userId)) {
    return (
      <div>
        <h1>You do not have access to view this creature</h1>
      </div>
    )
  }

  const editLink = userId && creature.user_id === userId ? (
    <Button asChild className="my-4" variant='secondary'>
      <Link href={`/creature/edit/${id}`}>
        Edit
      </Link>
    </Button>
  ) : null;

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
      {/* {editLink} */}
    </div>
  )
}
