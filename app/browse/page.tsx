import { CreatureLink } from "@/components/creature-link";
import { Separator } from "@/components/ui/separator";
import { getAllPublicCreatures } from '@/app/actions';

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
    <div className="max-w-5xl w-full">
      <h1 className="text-lg font-semibold">All creatures</h1>
      <Separator className="mb-4"/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {creatures.map((creature) => (
          <CreatureLink key={creature.versionId} id={creature.versionId} creature={creature.json} type={'view-public'}/>
        ))}
      </div>
    </div>
  )
}
