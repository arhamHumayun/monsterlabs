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

import { CornerDownLeft } from "lucide-react"

import { Input } from '@/components/ui/input';
import { useRecoilState } from 'recoil';
import { creatureState } from '@/lib/state';
import { creatureSchemaType } from '@/types/creature';
import React from 'react';

const formSchema = z.object({
  prompt: z
    .string()
    .min(2, {
      message: 'Prompt must be at least 2 characters.',
    })
    .max(500, {
      message: 'Prompt must be at most 500 characters.',
    }),
});

export function LandingForm() {
  const [_, setMonster] = useRecoilState(creatureState);
  const [isLoading, setIsLoading] = React.useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // For example, send the form data to your API.
    const response = await fetch('/api/create-creature/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      setMonster(jsonResponse as creatureSchemaType);
    } else {
      console.error('Failed to fetch monster data');
    }

    setIsLoading(false);
  }

  const loading = isLoading ? (
    <p className="text-center text-md font-medium animate-pulse duration-800 ease-in-out">
      Generating your monster...
    </p>
  ) : null;

  return (
    <Form {...form} aria-busy={isLoading}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full rounded border"
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input className='border-0' placeholder="Describe your monster..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant='outline' className="rounded sticky right-0 border-0">
          <CornerDownLeft className="h-4 w-4" />
        </Button>
        {loading}
      </form>
    </Form>
  );
}
