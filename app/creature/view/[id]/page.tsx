import { getCreatureById, getUser } from "@/app/actions";
import CreatureBlock from "@/components/creature-block";

export default async function ViewMonster(
  { params }: { params: { id: string } }
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

  if (!creature.is_public && (!userId || creature.user_id !== userId)) {
    return (
      <div>
        <h1>You do not have access to view this creature</h1>
      </div>
    )
  }

  return (
    <div>
      <CreatureBlock creature={creature.json} />
    </div>
  )
}
