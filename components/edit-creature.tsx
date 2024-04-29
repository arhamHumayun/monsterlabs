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
import { creatureDocument } from '@/types/db';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const formSchema = z.object({
  prompt: z.string(),
});

export function EditCreature({
  creature,
}: {
  creature: creatureDocument;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSettingPublic, setIsSettingPublic] = React.useState(false);
  const [isActuallyPublic, setIsActuallyPublic] = React.useState(creature.is_public);
  const [isEditing, setIsEditing] = React.useState(false);

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
      body: JSON.stringify({ prompt, creature: updatedCreature ? updatedCreature : creature.json}),
    });

    if (response.ok) {
      const jsonResponse = await response.json();

      try {
        const creatureResponse = creatureSchema.parse(jsonResponse);

        await supabase
          .from('creatures')
          .update({
            updated_at: new Date(),
            json: creatureResponse,
          })
          .eq('id', creature.id);

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

  async function setCreatureIsPublic(is_public: boolean) {
    setIsSettingPublic(true);
    await supabase
      .from('creatures')
      .update({ is_public })
      .eq('id', creature.id);
    setIsSettingPublic(false);
    setIsActuallyPublic(is_public);
  }

  async function deleteCreature() {
    await supabase
      .from('creatures')
      .delete()
      .eq('id', creature.id);
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
      <div className='flex flex-row w-full'>
        <Button
          variant='default'
          className='mb-4 mr-4 p-3 rounded'
          onClick={() => setCreatureIsPublic(!isActuallyPublic)}
          aria-disabled={isSettingPublic}
        >
          {isActuallyPublic ? 'Make Private' : 'Make Public'} {isSettingPublic && <Loader2 className='ml-2 animate-spin' />}
        </Button>
        <Button
          variant='default'
          className='mb-4 mr-4 p-3 rounded'
          onClick={() => setIsEditing(!isEditing)}
        >
          { isEditing ? 'Save' : 'Edit'}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='destructive' className='mb-4 p-3 rounded'>
              Delete
            </Button>
          </PopoverTrigger>
          <PopoverContent className='rounded mt-1'>
            <p className='text-sm'>
              Are you sure you want to delete this creature? 
              This action cannot be undone.
            </p>
            <Button
              variant='destructive'
              className='mt-4'
              onClick={deleteCreature}
            >
              Delete Creature
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <CreatureBlock creature={updatedCreature || creature.json} onlyBlock={true} editMode={isEditing}/>
    </div>
  );
}
