'use client';

import { itemSchema } from '@/types/item'; // Import the item schema
import ItemBlock from './item-block'; // Import the item block component
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
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
import {
  itemsDocument,
  itemDocumentToItemSchemaType,
  itemsDocumentSchema,
  itemSchemaTypeToItemDocument,
  itemTypesList,
  itemRarityList,
} from '@/types/db/item'; // Import the types for items
import ShareButton from '../share-button';
import Link from 'next/link';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from '../ui/dialog';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const promptSchema = z.object({
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

  const promptForm = useForm<z.infer<typeof promptSchema>>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const itemForm = useForm<z.infer<typeof itemsDocumentSchema>>({
    resolver: zodResolver(itemsDocumentSchema),
    defaultValues: itemObject,
  });

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  if (itemObject.user_id !== user.id) {
    router.push('/profile');
    return null;
  }

  async function onSubmitPrompt(values: z.infer<typeof promptSchema>) {
    const { prompt } = values;

    setIsLoading(true);

    const itemSchemaTypeItem = itemDocumentToItemSchemaType(itemObject);

    // For example, send the form data to your API.
    const updatedItem = await updateItem(prompt, itemSchemaTypeItem);

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
        console.error('Something went wrong when generating the item:', error);
      }
    } else {
      console.error('Failed to fetch item data');
    }

    setIsLoading(false);
  }

  async function onSubmitManualEdit(
    values: z.infer<typeof itemsDocumentSchema>
  ) {
    setIsLoading(true);

    const { data } = await updateItemToDB(values);

    if (data) {
      setItemObject(data);
      toast('Item updated.');
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
    cost: itemObject.cost_amount
  });

  return (
    <div>
      <Form {...promptForm} aria-busy={isLoading}>
        <form
          onSubmit={promptForm.handleSubmit(onSubmitPrompt)}
          className="pb-5 basic-1/4"
        >
          <fieldset disabled={isLoading}>
            <div className="flex w-full rounded border">
              <FormField
                control={promptForm.control}
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
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-4 w-full">
            Edit Item Manually
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Make changes to your item here. Click save when {`you're`} done.
            </DialogDescription>
          </DialogHeader>

          {/* begin form to edit item here */}
          <Form {...itemForm} aria-busy={isLoading}>
            <form onSubmit={itemForm.handleSubmit(onSubmitManualEdit)}>
              <fieldset disabled={isLoading}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue={itemData.name}
                      placeholder="Item Name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select>
                      <SelectTrigger className='col-span-3'>
                        <SelectValue placeholder={item.type}/>
                      </SelectTrigger>
                      <SelectContent>
                        {
                          itemTypesList.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subtype" className="text-right">
                      Subtype
                    </Label>
                    <Input
                      id="subtype"
                      defaultValue={itemData.subtype}
                      placeholder="Subtype"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rarity" className="text-right">
                      Rarity
                    </Label>
                    <Select>
                      <SelectTrigger className='col-span-3'>
                        <SelectValue placeholder={item.rarity}/>
                      </SelectTrigger>
                      <SelectContent>
                        {
                          itemRarityList.map((rarity) => (
                            <SelectItem key={rarity} value={rarity}>
                              {rarity}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="weight" className="text-right">
                      Weight
                    </Label>
                    <Input
                      id="weight"
                      defaultValue={itemData.weight}
                      placeholder="Weight"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Cost (gp)
                    </Label>
                    <Input
                      id="cost"
                      defaultValue={itemData.cost}
                      placeholder="Cost (gp)"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <DialogClose>
                    <Button type="submit">Save changes</Button>
                  </DialogClose>
                </DialogFooter>
              </fieldset>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="flex flex-row w-full"></div>
      <ItemBlock item={itemData} />
      <ShareButton
        id={item.id}
        type={'creature'}
        textOverride="Share this item!"
      />
      <Button asChild>
        <Link href="/">Create another</Link>
      </Button>
      <Popover>
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
