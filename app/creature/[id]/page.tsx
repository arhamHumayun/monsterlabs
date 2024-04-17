import { getCreatureById } from "@/app/actions";
import CreatureBlock from "@/components/creature-block";

export default async function MonsterPage(
  { params }: { params: { id: string } }
) {

  const { id } = params;

  const creature = await getCreatureById(id);

  if (!creature) {
    return (
      <div>
        <h1>No creature found</h1>
      </div>
    )
  }

  return (
    <div>
      <CreatureBlock creature={creature.json} />
    </div>
  )
}
