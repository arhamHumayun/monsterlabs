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
import React, { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { createItem } from '@/app/actions/item/create/v1/create-item';

const formSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  category: z.enum(['weapon', 'armor', 'consumable']),
});

export function CreateItemForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [actionCount, setActionCount] = useState(0);
  const [showLimitAlert, setShowLimitAlert] = useState(false);

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const initializeUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // If no user is signed in, sign in anonymously
        await supabase.auth.signInAnonymously();
      } else {
        setUser(user);
      }

      console.log('user:', user);

      // Initialize action count from localStorage
      const storedCount = localStorage.getItem('create_item_action_count');
      setActionCount(storedCount ? parseInt(storedCount, 10) : 0);
    };

    initializeUser();
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'weapon',
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
        // alert('You have reached the limit of 3 item generations as an anonymous user. Please sign in to continue.');
        return;
      }
    }

    setIsLoading(true);

    const createItemResponse = await createItem(values.name);

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

    const createItemDataResponse = await supabase
      .from('items')
      .insert({
        created_at: new Date(),
        updated_at: new Date(),
        user_id: user.id,

      })
      .select();

    const { data, error } = createItemDataResponse;

    if (error || !data) {
      console.error('Failed to create item data:', error);
      return;
    }

    const currentUser = await supabase.auth.getUser();

    const currentUserData = currentUser.data.user;

    if (!currentUserData || currentUserData.is_anonymous) {
      router.push(`/item/view-anon/${data[0].id}`);
    } else {
      router.push(`/item/edit/${data[0].id}`);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto resize">
        <fieldset disabled={isLoading}>
          <div className="rounded relative">
            <FormField
              control={form.control}
              name="name"
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
