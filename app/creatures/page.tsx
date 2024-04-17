import { getAllPublicCreatures, getCreatureById } from "@/app/actions";
import { CreatureLink } from "@/components/creature-link";
import { creatureDocument } from "@/types/db";

export default async function AllMonsters() {

  const creatures = await getAllPublicCreatures();

  if (!creatures || creatures.length === 0) {
    return (
      <div>
        <h1>No creatures found</h1>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {creatures.map((creature : creatureDocument) => (
          <CreatureLink key={creature.id} id={creature.id} creature={creature.json}/>
        ))}
      </div>
    </div>
  )
}
