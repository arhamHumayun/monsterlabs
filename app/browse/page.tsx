import { CreatureLink } from "@/components/creature-link";
import { Separator } from "@/components/ui/separator";
import { getAllCreatures } from "../actions";

export default async function AllMonsters() {

  const creatures = await getAllCreatures();

  if (!creatures || creatures.length === 0) {
    return (
      <div>
        <h1>No creatures found</h1>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex min-h-screen flex-col px-4 sm:px-6 mb-4">
      <h1 className="text-lg font-semibold">All creatures</h1>
      <Separator className="mb-4"/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {creatures.map((creature) => {
          return (
            <CreatureLink key={creature.id} id={creature.id} creatureName={creature.name} type="view-public"/>
          )
        })}
      </div>
    </div>
  )
}
