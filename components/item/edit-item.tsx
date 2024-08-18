'use client';

import { itemSchema } from '@/types/item'; // Import the item schema
import ItemBlock from './item-block'; // Import the item block component
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { CornerDownLeft, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import React from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { updateItem } from '@/app/actions/item/update/v1/update-item'; // Import the updateItem function for items
import { User } from '@supabase/supabase-js';
import { usePreviousState } from '@/lib/hooks';
import { updateItem as updateItemToDB } from '@/app/actions'; // Import the updateItem function for items
import { toast } from 'sonner';
import { doToast } from '@/lib/utils';
import { itemsDocument, itemDocumentToItemSchemaType, itemSchemaTypeToItemDocument } from '@/types/db/item'; // Import the types for items
import ShareButton from '../share-button';
import Link from 'next/link';

const formSchema = z.object({
  prompt: z.string(),
});

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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  if (itemObject.user_id !== user.id) {
    router.push('/profile');
    return null;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { prompt } = values;

    setIsLoading(true);

    const itemSchemaTypeItem =
      itemDocumentToItemSchemaType(itemObject);

    // For example, send the form data to your API.
    const updatedItem = await updateItem(
      prompt,
      itemSchemaTypeItem
    );

    if (updatedItem.data && !updatedItem.error) {
      try {
        if (updatedItem.error) {
          console.error(
            'Failed to create new item version:',
            updatedItem.error
          );
          return;
        } else {
          const updatedItemDoc = itemSchemaTypeToItemDocument(
            updatedItem.data,
            itemObject.id,
            itemObject.user_id,
            itemObject.created_at,
            new Date()
          );
          setItemObject(updatedItemDoc);
          toast('Item updated.');
        }
      } catch (error) {
        console.error(
          'Something went wrong when generating the item:',
          error
        );
      }
    } else {
      console.error('Failed to fetch item data');
    }

    setIsLoading(false);
  }

  async function deleteItem() {
    await supabase.from('items').delete().eq('id', itemObject.id);
    router.push('/profile');
  }

  const loading = isLoading ? (
    <div className="flex justify-center mb-4">
      <p className="text-md font-medium">Updating your item...</p>
      <Loader2 className="ml-2 animate-spin" />
    </div>
  ) : null;

  const itemData = itemSchema.parse({
    name: itemObject.name,
    description: itemObject.description,
    type: itemObject.type,
    subtype: itemObject.subtype,
    rarity: itemObject.rarity,
    requiresAttunement: {
      requires: itemObject.requires_attunement,
      requiresSpecific: itemObject.requires_attunement_types,
    },
    paragraphs: itemObject.paragraphs,
    weight: itemObject.weight,
    isMagical: itemObject.is_magical,
    magicBonus: itemObject.magic_bonus,
    cost: {
      unit: itemObject.cost_unit,
      amount: itemObject.cost_amount
    }
  });

  return (
    <div>
      <Form {...form} aria-busy={isLoading}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pb-5 basic-1/4">
          <fieldset disabled={isLoading}>
            <div className="flex w-full rounded border">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        className="border-0"
                        placeholder="Make updates to your item..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="outline"
                className="rounded sticky right-0 border-0"
              >
                <CornerDownLeft className="h-4 w-4" />
              </Button>
            </div>
          </fieldset>
        </form>
        {loading}
      </Form>
      <div className="grid grid-cols-4">
        {/* Update the button labels and onClick handlers */}
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
          }}
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
          }}
        >
          Share
        </Button>
      </div>
      <div className="flex flex-row w-full"></div>
      {/* Update the component name and props */}
      <ItemBlock item={itemData} />
      <ShareButton id={item.id} type={'creature'} textOverride="Share this item!" />
      <Button asChild>
        <Link href="/">Create another</Link>
      </Button>
      <Popover>
        <PopoverTrigger className='mx-4 my-4' asChild>
          <Button variant="destructive" className="mb-4 mr-4 p-3 rounded">
            Delete Item
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded mt-1">
          <p className="text-sm">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>
          <Button
            variant="destructive"
            className="mt-4"
            onClick={deleteItem}
          >
            Delete Item
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
