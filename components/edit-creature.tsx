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
import { json } from 'stream/consumers';

const formSchema = z.object({
  prompt: z.string(),
});

export function EditCreature({
  creature,
  creatureId,
}: {
  creature: creatureSchemaType;
  creatureId: number;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [updatedCreature, setUpdatedCreature] =
    React.useState<creatureSchemaType | null>(null);

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
      body: JSON.stringify({ prompt, creature }),
    });

    if (response.ok) {
      const jsonResponse = await response.json();

      try {
        const creature = creatureSchema.parse(jsonResponse);

        await supabase
          .from('creatures')
          .update({
            updated_at: new Date(),
            json: creature,
          })
          .eq('id', creatureId);

        setUpdatedCreature(creature);
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

  const loading = isLoading ? (
    <div className="flex justify-center mb-4">
      <p className="text-md font-medium">Updating your monster...</p>
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
                        placeholder="Update your monster..."
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
      <CreatureBlock creature={updatedCreature ? updatedCreature : creature} onlyBlock={true} />
    </div>
  );
}
