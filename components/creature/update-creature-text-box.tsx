"use client"

import { updateCreature } from '@/app/actions/creature/update/v1/update-creature';
import { creatureDocumentToCreatureSchemaType, creatureSchemaTypeToCreatureDocument, creaturesDocument } from "@/types/db/creature";
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

export default function UpdateCreaturePromptForm(
  {
    creatureObject,
    setCreatureObject,
    isLoading,
    setIsLoading,
  }: {
    creatureObject: creaturesDocument;
    setCreatureObject: (newState: creaturesDocument | ((prevState: creaturesDocument) => creaturesDocument)) => void;
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
        text: 'You must be a Pro user to update creatures via AI. Please upgrade to continue!',
        router
      }));
      return;
    }

    setIsLoading(true);

    const creatureSchemaTypeCreature = creatureDocumentToCreatureSchemaType(creatureObject);

    const updatedCreature = await updateCreature(prompt, creatureSchemaTypeCreature);

    if (updatedCreature.data && !updatedCreature.error) {
      try {
        if (updatedCreature.error) {
          console.error(
            'Failed to create new creature version:',
            updatedCreature.error
          );
          return;
        } else {
          const updatedCreatureDoc = creatureSchemaTypeToCreatureDocument(
            updatedCreature.data,
            creatureObject.id,
            creatureObject.user_id,
            creatureObject.created_at,
            new Date(),
            creatureObject.main_image_url
          );
          setCreatureObject(updatedCreatureDoc);
          toast('Creature updated.');
        }
      } catch (error) {
        console.error('Something went wrong when generating the creature:', error);
      }
    } else {
      console.error('Failed to fetch creature data');
    }

    setIsLoading(false);
  }

  
  const loading = isLoading ? (
    <div className="flex justify-center mb-4">
      <p className="text-md font-medium">Updating your creature...</p>
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
                    placeholder="Make updates to your creature via AI..."
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