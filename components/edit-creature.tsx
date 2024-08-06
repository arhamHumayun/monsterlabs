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
import { creatureDocumentToCreatureSchemaType, creaturesDocument } from '@/types/db';
import { updateCreature } from '@/app/actions/update/v1/route';

const formSchema = z.object({
  prompt: z.string(),
});

export function EditCreature({ creature }: { creature: creaturesDocument }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { prompt } = values;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/sign-in');
      return;
    }

    setIsLoading(true);

    const creatureSchemaTypeCreature = creatureDocumentToCreatureSchemaType(creature);

    // For example, send the form data to your API.
    const updatedCreature = await updateCreature(prompt, creatureSchemaTypeCreature);

    if (updatedCreature.data && !updatedCreature.error) {
      try {

        console.log('updateCreatureDataResponse', updatedCreature.data);

        if (updatedCreature.error) {
          console.error('Failed to create new creature version:', updatedCreature.error);
          return;
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
    await supabase.from('creatures').delete().eq('id', creature.id);
    router.push('/profile');
  }

  const loading = isLoading ? (
    <div className="flex justify-center mb-4">
      <p className="text-md font-medium">Updating your creature...</p>
      <Loader2 className="ml-2 animate-spin" />
    </div>
  ) : null;

  const creatureData = creatureSchema.parse({
    name: creature.name,
    lore: creature.lore,
    appearance: creature.appearance,
    pronoun: creature.pronoun,
    type: creature.type,
    isUnique: creature.is_unique,
    challengeRating: creature.challenge_rating / 100,
    alignment: creature.alignment,
    size: creature.size,
    ...creature.json,
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
      <div className="flex flex-row w-full">
        {/* <Button
          variant='default'
          className='mb-4 mr-4 p-3 rounded'
          onClick={() => setIsEditing(!isEditing)}
        >
          { isEditing ? 'Save' : 'Edit'}
        </Button> */}
        {/* <Button variant="default" className="mb-4 mr-4 p-3 rounded" onClick={setPreviousCreature}>
          Load Previous Version
        </Button> */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="destructive" className="mb-4 mr-4 p-3 rounded">
              Delete
            </Button>
          </PopoverTrigger>
          <PopoverContent className="rounded mt-1">
            <p className="text-sm">
              Are you sure you want to delete this creature? This action cannot
              be undone.
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
      <CreatureBlock
        creature={creatureData}
        onlyBlock={true}
      />
    </div>
  );
}
