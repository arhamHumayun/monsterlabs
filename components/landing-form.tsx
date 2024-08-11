'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';


import { CornerDownLeft, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { creatureSchema } from '@/types/creature';
import React from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  prompt: z.string().min(1).max(1000),
  model: z.enum(['gpt-4o-mini', 'claude-haiku']),
});

export function LandingForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [numCreatures, setNumCreatures] = React.useState(0);

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      model: 'gpt-4o-mini',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/sign-in');
      return;
    }

    setIsLoading(true);

    const response = await fetch(
      `/api/create-creature/openai/v1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }
    );

    if (response.ok) {
      const jsonResponse = await response.json();

      try {
        const creature = creatureSchema.parse(jsonResponse);

        const {
          name,
          lore,
          appearance,
          pronoun,
          type,
          size,
          isUnique,
          challengeRating,
          alignment,
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
        } = creature;

        const creatureJson = {
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
        };

        const createCreatureDataResponse = await supabase
          .from('creatures')
          .insert({
            created_at: new Date(),
            updated_at: new Date(),
            user_id: user.id,
            name,
            lore,
            appearance,
            pronoun,
            type,
            size,
            is_unique: isUnique,
            challenge_rating: challengeRating * 100,
            alignment,
            hit_dice_amount: hitDiceAmount,
            json: creatureJson,
          })
          .select();

        const { data, error } = createCreatureDataResponse;

        if (error || !data) {
          console.error('Failed to create creature data:', error);
          return;
        }

        router.push(`/creature/edit/${data[0].id}`);
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
    <div className="flex justify-center">
      <p className="text-md font-medium">Generating your creature...</p>
      <Loader2 className="ml-2 animate-spin" />
    </div>
  ) : null;

  return (
    <Form {...form} aria-busy={isLoading}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto resize">
        <fieldset disabled={isLoading}>
          <div className="rounded relative">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      className="border-2 resize-y pr-10"
                      placeholder="Describe your creature..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem className="flex mt-2">
                  <FormLabel className="pt-2 pr-3">Set model:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="gpt-4o-mini" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          GPT 4o-mini
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="claude-haiku" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Claude Haiku
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <Button
              type="submit"
              variant="ghost"
              className="rounded border-0 absolute top-0 right-0"
            >
              <CornerDownLeft className="h-4 w-4" />
            </Button>
          </div>
        </fieldset>
      </form>
      {loading}
    </Form>
  );
}
