import { getAllItems } from "@/app/actions";
import { ThingLink } from "../thing-link";

export default async function ItemList(
  { 
    pageNumber, 
    itemsPerPage,
    sortingOrder,
  } : 
  { 
    pageNumber: number,
    itemsPerPage: number,
    sortingOrder: "latest" | "alphabetical", 
  },
) {

  pageNumber = pageNumber || 1;

  const items = await getAllItems(pageNumber, itemsPerPage, sortingOrder);

  if (!items || items.length === 0) {
    return (
      <div>
        <h1>No items found</h1>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {items.map((item) => {
      return (
        <ThingLink
          key={item.id}
          id={item.id}
          name={item.name}
          thingType='item'
          type="view"
        />
      );
    })}
  </div>
  )
}