import ItemBlock from "@/components/item/item-block";
import ShareButton from "@/components/share-button";
import { createSupabaseAppServerClient } from "@/lib/supabase/server-client";
import { itemDocumentToItemSchemaType, itemsDocument } from "@/types/db/item";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'View Item',
  description: 'View an item'
};

export default async function ViewItem(
  { params }: { params: { id: number } }
) {

  const { id } = params;  

  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('items')
    .select(`*`)
    .eq('id', id)
    .single();

  if (error || !data || data.length === 0) {
    console.error('Failed to get item by id:', error);
    return (
      <div>
        <h1>Item not found</h1>
      </div>
    );
  }

  const item = data as itemsDocument;

  const itemAsSchema = itemDocumentToItemSchemaType(item);

  return (
    <div className="mb-4">
      <ShareButton id={id} type={'item'} textOverride="Share this item!" />
      <ItemBlock item={itemAsSchema} />
    </div>
  )
}
