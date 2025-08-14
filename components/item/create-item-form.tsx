'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

import { CornerDownLeft, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { createItem } from '@/app/actions/item/create/v1/create-item';
import { useState } from 'react';
import { toast } from 'sonner';

import LimitReachInnerToast from '../limit-reach-inner-toast';
import { LoginButton } from '../login-button';
import { getOneMonthAgoDate } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  description: z.string().min(1).max(1000),
});

export function CreateItemForm({
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

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
        // check if user is over limit for the month
        const { count } = await supabase
          .from('events')
          .select('id', { count: 'exact' })
          .eq('user_id', userId)
          .eq('event_type', 'item_created')
          .gte('created_at', getOneMonthAgoDate().toISOString());

        const maxAllowedPerMonth = 10;

        if (count && count >= maxAllowedPerMonth) {
          toast(
            LimitReachInnerToast({
              text: 'You have reached the limit of 10 items generations per month. Upgrade to the pro plan for unlimited use!',
              router,
            })
          );
          return;
        }
      }
      
    }

    setIsLoading(true);

    const createItemResponse = await createItem(values.description);

    const { data, error } = createItemResponse;

    if (error) {
      console.error('Failed to create item:', createItemResponse.error);
      toast('Something went wrong when creating your creature. Please try again.');
      setIsLoading(false);
      return;
    }

    if (!data) {
      console.error('No data returned from createItem');
      toast('Something went wrong when creating your creature. Please try again.');
      setIsLoading(false);
      return;
    }


    const {
      name,
      paragraphs,
      description,
      type,
      subtype,
      rarity,
      requiresAttunement,
      requiresAttunementSpecific,
      cost,
      weight,
    } = data;

    const createItemDataSupaBaseResponse = await supabase
      .from('items')
      .insert({
        created_at: new Date(),
        updated_at: new Date(),
        user_id: user.id,
        name,
        paragraphs,
        description,
        type,
        subtype,
        rarity,
        requires_attunement: requiresAttunement,
        requires_attunement_specific: requiresAttunementSpecific,
        cost_amount: cost,
        weight,
      })
      .select();

    if (
      createItemDataSupaBaseResponse.error ||
      !createItemDataSupaBaseResponse.data
    ) {
      console.error(
        'Failed to add item data to DB:',
        createItemDataSupaBaseResponse.error
      );
      toast('Something went wrong when creating your item. Please try again.');
      setIsLoading(false);
      return;
    }

    // Increment action count for anonymous users
    const newActionCount = actionCount + 1;
    setActionCount(newActionCount);
    localStorage.setItem('action_count', newActionCount.toString());

    if (user.is_anonymous) {
      router.push(
        `/item/view-anon/${createItemDataSupaBaseResponse.data[0].id}`
      );
    } else {
      router.push(`/item/edit/${createItemDataSupaBaseResponse.data[0].id}`);
    }

    setIsLoading(false);
  }

  const loading = isLoading ? (
    <div className="flex justify-center mt-2">
      <p className="text-md font-medium">Generating your item...</p>
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
              name="description"
              render={({ field }) => (
                <FormItem className='grow'>
                  <FormLabel htmlFor="prompt">Create a magic item</FormLabel>
                  <FormControl>
                    <Textarea
                      className="border-2 pr-10 "
                      placeholder="Describe your item..."
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
