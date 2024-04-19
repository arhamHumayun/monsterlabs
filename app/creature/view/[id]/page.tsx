import { getCreatureById, getUser } from "@/app/actions";
import CreatureBlock from "@/components/creature-block";
import { Button } from "@/components/ui/button";
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

  if (!creature.is_public && (!userId || creature.user_id !== userId)) {
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

  return (
    <div>
      <CreatureBlock creature={creature.json} />
      {editLink}
    </div>
  )
}
