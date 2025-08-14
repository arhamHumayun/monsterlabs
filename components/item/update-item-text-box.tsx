"use client"

import { updateItem } from '@/app/actions/item/update/v1/update-item';
import { itemDocumentToItemSchemaType, itemSchemaTypeToItemDocument, itemsDocument } from "@/types/db/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { CornerDownLeft, Loader2 } from "lucide-react";
import { useForm, } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import LimitReachInnerToast from '../limit-reach-inner-toast';
import { useRouter } from 'next/navigation';

const promptSchema = z.object({
  prompt: z.string(),
});

export default function UpdateItemPromptForm(
  {
    itemObject,
    setItemObject,
    isLoading,
    setIsLoading,
  }: {
    itemObject: itemsDocument;
    setItemObject: (newState: itemsDocument | ((prevState: itemsDocument) => itemsDocument)) => void;
    isLoading: boolean;
    setIsLoading: (newState: boolean) => void;
  }
) {

  const router = useRouter();

  const promptForm = useForm<z.infer<typeof promptSchema>>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: '',
    },
  });

  
  async function onSubmitPrompt(values: z.infer<typeof promptSchema>) {
    const { prompt } = values;

    const supabase = createSupabaseBrowserClient();

    const { data: userResponse, error } = await supabase.auth.getUser();
    const user = userResponse.user;

    if (!user || error) {
      console.error('no user?');
      return;
    }

    if (user.is_anonymous) {
      console.error('user is anon?');
      return;
    }

    // get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Failed to get user profile:', profileError);
      return;
    }

    if (!userProfile) {
      console.error('no user profile?');
      return;
    }

    const role = userProfile.role as string;

    if (role !== 'pro') {
      toast(LimitReachInnerToast({
        text: 'You must be a Pro user to update items via AI. Please upgrade to continue!',
        router
      }));
      return;
    }

    setIsLoading(true);

    const itemSchemaTypeItem = itemDocumentToItemSchemaType(itemObject);

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
            new Date(),
            itemObject.main_image_url
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

  
  const loading = isLoading ? (
    <div className="flex justify-center mb-4">
      <p className="text-md font-medium">Updating your item...</p>
      <Loader2 className="ml-2 animate-spin" />
    </div>
  ) : null;

  return (
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
                    placeholder="Make updates to your item via AI..."
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
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
  )
}