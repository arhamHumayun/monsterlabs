import { getAllPublicCreatures } from "@/app/actions";
import { CreatureLink } from "@/components/creature-link";
import { Separator } from "@/components/ui/separator";
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
      <h1 className="text-lg font-bold">All creatures</h1>
      <Separator className="mb-4"/>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {creatures.map((creature : creatureDocument) => (
          <CreatureLink key={creature.id} id={creature.id} creature={creature.json} type={'view'}/>
        ))}
      </div>
    </div>
  )
}
