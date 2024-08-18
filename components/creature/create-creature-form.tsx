'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { CornerDownLeft, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { createCreature } from '@/app/actions/creature/create/v1/create-creature';
import { Label } from '../ui/label';

const formSchema = z.object({
  prompt: z.string().min(1).max(1000),
  model: z.enum(['gpt-4o-mini', 'claude-haiku']),
});

export function CreateCreatureForm({
  user,
  actionCount,
  setActionCount,
  showLimitAlert,
  setShowLimitAlert,
}: {
  user: User | null;
  actionCount: number;
  setActionCount: (count: number) => void;
  showLimitAlert: boolean;
  setShowLimitAlert: (show: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

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
    if (!user) {
      console.error('no user?');
      return;
    }

    if (user.is_anonymous) {
      // Increment action count for anonymous users
      const newActionCount = actionCount + 1;
      setActionCount(newActionCount);
      localStorage.setItem('action_count', newActionCount.toString());

      if (newActionCount >= 3) {
        setShowLimitAlert(true);
        // alert('You have reached the limit of 3 creature generations as an anonymous user. Please sign in to continue.');
        return;
      }
    }

    setIsLoading(true);

    const createCreatureResponse = await createCreature(values.prompt);

    if (createCreatureResponse.error) {
      console.error('Failed to create creature:', createCreatureResponse.error);
      return;
    }

    if (!createCreatureResponse.data) {
      console.error('No data returned from createCreature');
      return;
    }

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
    } = createCreatureResponse.data;

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

    if (!user || user.is_anonymous) {
      router.push(`/creature/view-anon/${data[0].id}`);
    } else {
      router.push(`/creature/edit/${data[0].id}`);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
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
      {showLimitAlert ? (
        <p className="text-red-500 text-sm mt-2">
          You have reached the limit of 3 creature generations as an anonymous
          user. Please sign in to continue.
        </p>
      ) : null}
      {loading}
    </Form>
  );
}
