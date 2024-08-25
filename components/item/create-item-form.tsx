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
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { createItem } from '@/app/actions/item/create/v1/create-item';
import { useState } from 'react';

const formSchema = z.object({
  description: z.string().min(1).max(1000),
});

export function CreateItemForm({
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: ''
    },
  });

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
        return;
      }
    }

    setIsLoading(true);

    const createItemResponse = await createItem(values.description);

    if (createItemResponse.error) {
      console.error('Failed to create item:', createItemResponse.error);
      return;
    }

    if (!createItemResponse.data) {
      console.error('No data returned from createItem');
      return;
    }

    const { data, error } = createItemResponse;

    if (error || !data) {
      console.error('Failed to create item data:', error);
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
        requires_attunement_types: requiresAttunementSpecific,
        cost_amount: cost,
        weight,
      })
      .select();

    if (createItemDataSupaBaseResponse.error || !createItemDataSupaBaseResponse.data) {
      console.error('Failed to add item data to DB:', createItemDataSupaBaseResponse.error);
      return;
    }

    if (!user || user.is_anonymous) {
      router.push(`/item/view-anon/${createItemDataSupaBaseResponse.data[0].id}`);
    } else {
      router.push(`/item/edit/${createItemDataSupaBaseResponse.data[0].id}`);
    }

    setIsLoading(false);
  }

  const loading = isLoading ? (
    <div className="flex justify-center">
      <p className="text-md font-medium">Generating your item...</p>
      <Loader2 className="ml-2 animate-spin" />
    </div>
  ) : null;

  return (
    <Form {...form} aria-busy={isLoading}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full resize'>
        <fieldset disabled={isLoading}>
          <div className="rounded relative">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      className="border-2 resize-y pr-10"
                      placeholder="Describe your item..."
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
          You have reached the limit of 3 item generations as an anonymous user. Please sign in to continue.
        </p>
      ) : null}
      {loading}
    </Form>
  );
}
