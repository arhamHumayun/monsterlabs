import { getItemById, getUser } from "@/app/not-actions";
import { EditItem } from "@/components/item/edit-item";
import ItemBlock from "@/components/item/item-block";
import ShareButton from "@/components/share-button";
import { itemDocumentToItemSchemaType } from "@/types/db/item";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'View Item',
  description: 'View an item'
};

export default async function ViewItem(
  { params }: { params: { id: number } }
) {

  const { id } = params;  

  const item = await getItemById(id);

  if (!item) {
    return (
      <div>
        <h1>Item not found</h1>
      </div>
    )
  }

  const user = await getUser();
  const userId = user?.id;

  if (!userId || item.user_id !== userId) {
    return (
      <div>
        <h1>You do not have access to edit this item</h1>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <EditItem item={item} user={user} />
    </div>
  )
}
