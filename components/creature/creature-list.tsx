import { getAllCreatures } from "@/app/actions";
import { CreatureLink } from "./creature-link";

export default async function CreatureList(
  { 
    pageNumber, 
    monstersPerPage,
    sortingOrder,
  } : 
  { 
    pageNumber: number,
    monstersPerPage: number,
    sortingOrder: "latest" | "alphabetical", 
  },
) {

  pageNumber = pageNumber || 1;

  const creatures = await getAllCreatures(pageNumber, monstersPerPage, sortingOrder);

  if (!creatures || creatures.length === 0) {
    return (
      <div>
        <h1>No creatures found</h1>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {creatures.map((creature) => {
      return (
        <CreatureLink
          key={creature.id}
          id={creature.id}
          creatureName={creature.name}
          type="view"
        />
      );
    })}
  </div>
  )
}