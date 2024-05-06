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
});

export function LandingForm() {
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

    const response = await fetch('/api/create-creature/openai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const jsonResponse = await response.json();

      try {
        const creature = creatureSchema.parse(jsonResponse);

        const supabaseResponse = await supabase
          .from('creatures')
          .insert({
            created_at: new Date(),
            updated_at: new Date(),
            user_id: user.id,
            json: creature,
          })
          .select();

        const creatureId = supabaseResponse.data![0].id;

        router.push(`/creature/edit/${creatureId}`);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='mx-auto resize'>
        <fieldset disabled={isLoading}>
          <div className="flex w-full rounded border">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="w-full max-h-20">
                  <FormControl>
                    <Input
                      className="border-0"
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
  );
}
