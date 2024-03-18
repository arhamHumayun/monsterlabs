"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRecoilState } from "recoil"
import { monsterState } from "@/lib/state"
import { monsterSchemaType } from "@/types/monster"
import React from "react"

const formSchema = z.object({
  prompt: z.string().min(2, {
    message: "Prompt must be at least 2 characters.",
  }).max(500, {
    message: "Prompt must be at most 500 characters.",
  }),
});

export function LandingForm() {  
  const [_, setMonster] = useRecoilState(monsterState);
  const [isLoading, setIsLoading] = React.useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    setIsLoading(true);

    // For example, send the form data to your API.
    const response = await fetch("/api/monster-gen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    if (response.ok) {
      const jsonResponse = await response.json();
      setMonster(jsonResponse as monsterSchemaType);
    } else {
      console.error("Failed to fetch monster data");
    }

    setIsLoading(false);
  }

  const loading = isLoading ? <p className="text-center text-md font-medium animate-pulse duration-800 ease-in-out" 
  >
    Generating your monster...</p> : null;

  return (
    <Form {...form} aria-busy={isLoading}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Describe your monster..." {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
      {loading}
    </Form>
  )
}