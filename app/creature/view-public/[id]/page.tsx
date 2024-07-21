import CreatureBlock from "@/components/creature-block";

export default async function ViewPublicMonster(
  { params }: { params: { id: number } }
) {

  const { id } = params;  

  const creature = await getCreatureByCreatureDataId(id);

  if (!creature) {
    return (
      <div>
        <h1>Creature not found</h1>
      </div>
    )
  }

  return (
    <div>
      <CreatureBlock creature={creature.json} />
    </div>
  )
}
