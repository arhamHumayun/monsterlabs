import ItemBlock from "@/components/item/item-block";
import { LoginButton } from "@/components/login-button";
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
    <div className="mb-4 max-w-3xl">
      <ShareButton id={id} type={'item'} textOverride="Share this item!" />
      <ItemBlock item={itemAsSchema} />
      <div className="grid grid-cols-1 gap-4 mt-4 mb-2 place-items-center">
        <h1 className="text-gray-200 text-center">
          Sign in with Google to save and edit your creatures. This creature
          will be saved when you sign in. Otherwise you {`won't`} be able to edit it later.
        </h1>
        <div className="flex justify-center">
          <ShareButton id={id} type={'creature'} textOverride="Share this creature!" />
          <LoginButton message="Sign in with Google." />
        </div>
      </div>
    </div>
  )
}
