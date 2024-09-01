'use client';

import { itemSchema } from '@/types/item'; // Import the item schema
import ItemBlock from './item-block'; // Import the item block component
import { Button } from '../ui/button';
import React from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { User } from '@supabase/supabase-js';
import { usePreviousState } from '@/lib/hooks';
import { updateItem as updateItemToDB } from '@/app/actions';
import { doToast } from '@/lib/utils';
import {
  itemsDocument,
} from '@/types/db/item'; // Import the types for items
import ShareButton from '../share-button';
import Link from 'next/link';
import ManuallyEditItemModal from './manually-edit-item-modal';
import UpdateItemPromptForm from './update-item-text-box';
export function EditItem({
  item,
  user,
}: {
  item: itemsDocument;
  user: User | null;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [itemObject, setItemObject, goPreviousVersion, goNextVersion] =
    usePreviousState(item);

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  if (itemObject.user_id !== user.id) {
    router.push('/profile');
    return null;
  }

  async function deleteItem() {
    await supabase.from('items').delete().eq('id', itemObject.id);
    router.push('/profile');
  }

  const itemData = itemSchema.parse({
    name: itemObject.name,
    description: itemObject.description,
    type: itemObject.type,
    subtype: itemObject.subtype,
    rarity: itemObject.rarity,
    requiresAttunement: itemObject.requires_attunement,
    requiresAttunementSpecific: itemObject.requires_attunement_specific,
    paragraphs: itemObject.paragraphs,
    weight: itemObject.weight,
    cost: itemObject.cost_amount
  });

  return (
    <div>
      {UpdateItemPromptForm({ itemObject, setItemObject, isLoading, setIsLoading })}
      <div className="grid grid-cols-4">
        <Button
          variant="secondary"
          className="mb-4 mr-4 p-3 rounded"
          disabled={isLoading}
          onClick={() => goPreviousVersion()}
        >
          Undo
        </Button>
        <Button
          variant="secondary"
          className="mb-4 mr-4 p-3 rounded"
          disabled={isLoading}
          onClick={() => goNextVersion()}
        >
          Redo
        </Button>
        <Button
          variant="default"
          className="mb-4 mr-4 p-3 rounded"
          disabled={isLoading || isSaving}
          onClick={async () => {
            setIsSaving(true);
            await updateItemToDB(itemObject);
            setIsSaving(false);
            doToast('Item saved.');
          } }
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button
          variant="default"
          className="mb-4 mr-4 p-3 rounded"
          disabled={isLoading}
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/item/view/${itemObject.id}`
            );
            doToast('Link copied.');
          } }
        >
          Share
        </Button>
      </div>
      {ManuallyEditItemModal({ itemObject, setItemObject, isLoading, setIsLoading })}
    <div className="flex flex-row w-full"></div><ItemBlock item={itemData} /><ShareButton
        id={item.id}
        type={'item'}
        textOverride="Share this item!" /><Button asChild>
        <Link href="/">Create another</Link>
      </Button><Popover>
        <PopoverTrigger className="mx-4 my-4" asChild>
          <Button variant="destructive" className="mb-4 mr-4 p-3 rounded">
            Delete Item
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded mt-1">
          <p className="text-sm">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>
          <Button variant="destructive" className="mt-4" onClick={deleteItem}>
            Delete Item
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}