'use client';

import { creatureSchema, creatureSchemaType } from '@/types/creature';
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
import { creatureView } from '@/types/db';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const formSchema = z.object({
  prompt: z.string(),
});

export function EditCreature({ creature }: { creature: creatureView }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSettingPublic, setIsSettingPublic] = React.useState(false);
  const [isActuallyPublic, setIsActuallyPublic] = React.useState(
    creature.is_published
  );
  const [currentVersionId, setCurrentVersionId] = React.useState(creature.versionId);

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [updatedCreature, setUpdatedCreature] =
    React.useState<creatureSchemaType>(creature.json);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const { prompt } = values;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/sign-in');
      return;
    }

    setIsLoading(true);

    // For example, send the form data to your API.
    const response = await fetch('/api/update-creature/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        creature: updatedCreature ? updatedCreature : creature.json,
      }),
    });

    if (response.ok) {
      const jsonResponse = await response.json();

      try {
        const creatureResponse = creatureSchema.parse(jsonResponse);

        const {
          name,
          lore,
          appearance,
          pronoun,
          size,
          type,
          isUnique,
          challengeRating,
          // json
          stats,
          hitDiceAmount,
          armorClass,
          speed,
          savingThrows,
          skills,
          senses,
          damageTakenModifiers,
          conditionImmunities,
          languages,
          traits,
          spellcasting,
          actions,
          reactions,
          legendary,
        } = creatureResponse;

        const {data, error} = await supabase
          .from('creatures_data')
          .insert({
            creature_id: creature.id,
            created_at: new Date(),
            is_published: false,
            name,
            lore,
            appearance,
            pronoun,
            size,
            type,
            isUnique,
            challengeRating: challengeRating * 100,
            json: {
              stats,
              hitDiceAmount,
              armorClass,
              speed,
              savingThrows,
              skills,
              senses,
              damageTakenModifiers,
              conditionImmunities,
              languages,
              traits,
              spellcasting,
              actions,
              reactions,
              legendary,
            },
          }).select()

        if (error) {
          console.error('Failed to create new creature version:', error);
          return;
        }

        setCurrentVersionId(data[0].id);

        setUpdatedCreature(creatureResponse);
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

  async function setCreatureIsPublic(is_published: boolean) {
    setIsSettingPublic(true);
    await supabase
      .from('creatures_data')
      .update({ is_published })
      .eq('id', creature.versionId);
    setIsSettingPublic(false);
    setIsActuallyPublic(is_published);
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
        <Button
          variant="default"
          className="mb-4 mr-4 p-3 rounded"
          onClick={() => setCreatureIsPublic(!isActuallyPublic)}
          aria-disabled={isSettingPublic}
        >
          {isActuallyPublic ? 'Make Private' : 'Make Public'}{' '}
          {isSettingPublic && <Loader2 className="ml-2 animate-spin" />}
        </Button>
        {/* <Button
          variant='default'
          className='mb-4 mr-4 p-3 rounded'
          onClick={() => setIsEditing(!isEditing)}
        >
          { isEditing ? 'Save' : 'Edit'}
        </Button> */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="destructive" className="mb-4 p-3 rounded">
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
        creature={updatedCreature || creature.json}
        onlyBlock={true}
        editMode={false}
      />
    </div>
  );
}
