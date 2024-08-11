'use client';

import { creatureSchema } from '@/types/creature';
import CreatureBlock from './creature-block';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { CornerDownLeft, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import React from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  creatureDocumentToCreatureSchemaType,
  creatureSchemaTypeToCreatureDocument,
  creaturesDocument,
} from '@/types/db';
import { updateCreature } from '@/app/actions/update/v1/updateCreature';
import { User } from '@supabase/supabase-js';
import { usePreviousState } from '@/lib/hooks';
import { updateCreature as updateCreatureToDB } from '@/app/actions';
import { toast } from 'sonner';

const formSchema = z.object({
  prompt: z.string(),
});

export function EditCreature({
  creature,
  user,
}: {
  creature: creaturesDocument;
  user: User | null;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [
    creatureObject,
    setCreatureObject,
    goPreviousVersion,
    goNextVersion
  ] = usePreviousState(creature);

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
    return;
  }

  if (creatureObject.user_id !== user.id) {
    router.push('/profile');
    return;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { prompt } = values;

    setIsLoading(true);

    const creatureSchemaTypeCreature =
      creatureDocumentToCreatureSchemaType(creatureObject);

    // For example, send the form data to your API.
    const updatedCreature = await updateCreature(
      prompt,
      creatureSchemaTypeCreature
    );

    if (updatedCreature.data && !updatedCreature.error) {
      try {
        if (updatedCreature.error) {
          console.error(
            'Failed to create new creature version:',
            updatedCreature.error
          );
          return;
        } else {
          console.log(
            'Successfully created new creature version',
            updatedCreature.data
          );
          const updatedCreatureDoc = creatureSchemaTypeToCreatureDocument(
            updatedCreature.data,
            creatureObject.id,
            creatureObject.user_id,
            creatureObject.created_at,
            new Date()
          );
          setCreatureObject(updatedCreatureDoc);
          toast('Creature updated.');
        }
      } catch (error) {
        console.error(
          'Something went wrong when generating the creature:',
          error
        );
      }
    } else {
      console.error('Failed to fetch monster data');
    }

    setIsLoading(false);
  }

  async function deleteCreature() {
    await supabase.from('creatures').delete().eq('id', creatureObject.id);
    router.push('/profile');
  }

  const loading = isLoading ? (
    <div className="flex justify-center mb-4">
      <p className="text-md font-medium">Updating your creature...</p>
      <Loader2 className="ml-2 animate-spin" />
    </div>
  ) : null;

  const creatureData = creatureSchema.parse({
    name: creatureObject.name,
    hitDiceAmount: creatureObject.hit_dice_amount,
    lore: creatureObject.lore,
    appearance: creatureObject.appearance,
    pronoun: creatureObject.pronoun,
    type: creatureObject.type,
    isUnique: creatureObject.is_unique,
    challengeRating: creatureObject.challenge_rating / 100,
    alignment: creatureObject.alignment,
    size: creatureObject.size,
    ...creatureObject.json,
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
                        placeholder="Make updates to your creature..."
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
      <div className="grid grid-cols-3">
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
            await updateCreatureToDB(creatureObject);
            setIsSaving(false);
            doToast('Creature saved.');
          }}
        >
          {isSaving ? 'Saving...': 'Save'}
        </Button>
      </div>
      <div className="flex flex-row w-full"></div>
      <CreatureBlock creature={creatureData} onlyBlock={true} />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="destructive" className="mb-4 mr-4 p-3 rounded">
            Delete Creature
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded mt-1">
          <p className="text-sm">
            Are you sure you want to delete this creature? This action cannot be
            undone.
          </p>
          <Button
            variant="destructive"
            className="mt-4"
            onClick={deleteCreature}
          >
            Delete Creature
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const doToast = (message: string) => {
  toast(message);
}