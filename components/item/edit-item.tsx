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
import { itemsDocument } from '@/types/db/item'; // Import the types for items
import ShareButton from '../share-button';
import Link from 'next/link';
import ManuallyEditItemModal from './manually-edit-item-modal';
import UpdateItemPromptForm from './update-item-text-box';
import GenerateImageDialog from '../generate-image-dialog';
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

  const [currentImageUrl, setCurrentImageUrl] = React.useState<string | null>(item.main_image_url);

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  if (itemObject.user_id !== user.id) {
    router.push('/your-creations');
    return null;
  }

  async function deleteItem() {
    await supabase.from('items').delete().eq('id', itemObject.id);
    router.push('/your-creations');
  }

  return (
    <div>
      {UpdateItemPromptForm({
        itemObject,
        setItemObject,
        isLoading,
        setIsLoading,
      })}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <Button
          variant="secondary"
          disabled={isLoading}
          onClick={() => goPreviousVersion()}
        >
          Undo
        </Button>
        <Button
          variant="secondary"
          disabled={isLoading}
          onClick={() => goNextVersion()}
        >
          Redo
        </Button>
        <Button
          variant="default"
          className='col-span-2'
          disabled={isLoading || isSaving}
          onClick={async () => {
            setIsSaving(true);
            await updateItemToDB(itemObject);
            setIsSaving(false);
            doToast('Item saved.');
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <div className='grid grid-cols-2 gap-4'>
      {ManuallyEditItemModal({
        itemObject,
        setItemObject,
        isLoading,
        setIsLoading,
      })}
      {GenerateImageDialog({
        type: 'item',
        name: itemObject.name,
        thingId: itemObject.id,
        setCurrentImageUrl,
        additionalDescription: itemObject.description,
      })}
      </div>
      <ItemBlock item={item} currentImageUrl={currentImageUrl} />
      <div className="flex flex-row flex-wrap gap-4 my-4">
        <ShareButton id={item.id} type={'item'} textOverride="Share this item!" />
        <Button asChild>
          <Link href="/">Create another</Link>
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="destructive">
              Delete Item
            </Button>
          </PopoverTrigger>
          <PopoverContent className="rounded mt-1">
            <p className="text-sm">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
            <Button variant="destructive" className='mt-2' onClick={deleteItem}>
              Delete Item
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
