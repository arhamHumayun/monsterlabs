'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

import { CornerDownLeft, Loader2 } from 'lucide-react';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { createCreature } from '@/app/actions/creature/create/v1/create-creature';
import { toast } from 'sonner';

import LimitReachInnerToast from '../limit-reach-inner-toast';
import { LoginButton } from '../login-button';
import { getOneMonthAgoDate } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  prompt: z.string().min(1).max(1000),
  model: z.enum(['gpt-4o-mini', 'claude-haiku']),
});

export function CreateCreatureForm({
  user,
  setUser,
  actionCount,
  setActionCount,
}: {
  user: User | null;
  setUser: (user: User | null) => void;
  actionCount: number;
  setActionCount: (count: number) => void;
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
      const result = await supabase.auth.signInAnonymously();
      setUser(result.data.user);
      return;
    }

    if (user.is_anonymous) {

      if (actionCount >= 3) {
        toast(
          <div>
            <p className="text-sm font-medium mb-2">
              You have reached the limit of 3 generations as an anonymous user.
              Please sign in to continue.
            </p>
            <LoginButton />
          </div>
        );
        return;
      }
    } else {
      const userId = user.id;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId);

      if (profileError) {
        console.error('Failed to get user profile:', profileError);
        return;
      }

      if (!profileData || profileData.length === 0) {
        console.error('No user profile found.');
        return;
      }

      const role = profileData[0].role as string;

      if (role === 'free') {
        // check if user is over limit
        const { count } = await supabase
          .from('events')
          .select('id', { count: 'exact' })
          .eq('user_id', userId)
          .eq('event_type', 'creature_created')
          .gte('created_at', getOneMonthAgoDate().toISOString());

        const maxAllowedPerMonth = 10;

        if (count && count >= maxAllowedPerMonth) {
          toast(
            LimitReachInnerToast({
              text: 'You have reached the limit of 10 creature generations per month. Upgrade to the pro plan for unlimited use!',
              router,
            })
          );
          return;
        }
      }
    }

    setIsLoading(true);

    const createCreatureResponse = await createCreature(values.prompt);

    if (createCreatureResponse.error) {
      console.error('Failed to create creature:', createCreatureResponse.error);
      toast('Something went wrong when creating your creature. Please try again.');
      setIsLoading(false);
      return;
    }

    if (!createCreatureResponse.data) {
      console.error('No data returned from createCreature');
      toast('Something went wrong when creating your creature. Please try again.');
      setIsLoading(false);
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
      toast('Something went wrong when creating your creature. Please try again.');
      setIsLoading(false);
      return;
    }

    // Increment action count for anonymous users
    const newActionCount = actionCount + 1;
    setActionCount(newActionCount);
    localStorage.setItem('action_count', newActionCount.toString());

    if (user.is_anonymous) {
      router.push(`/creature/view-anon/${data[0].id}`);
    } else {
      router.push(`/creature/edit/${data[0].id}`);
    }

    setIsLoading(false);
  }

  const loading = isLoading ? (
    <div className="flex justify-center mt-2">
      <p className="text-md font-medium">Generating your creature...</p>
      <Loader2 className="ml-2 animate-spin" />
    </div>
  ) : null;

  return (
    <Form {...form} aria-busy={isLoading}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading}>
          <div className="flex flex-col flex-wrap">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className='grow'>
                  <FormLabel htmlFor="prompt">Create a creature</FormLabel>
                  <FormControl>
                    <Textarea
                      className="border-2 pr-10"
                      placeholder="Describe your creature..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="ghost"
              className="rounded-lg border-2 mt-4 w-full self-center"
            >
              {<span className='visible mr-2'>Submit</span>}<CornerDownLeft className="h-4 w-4" />
            </Button>
          </div>
        </fieldset>
      </form>
      {loading}
    </Form>
  );
}
