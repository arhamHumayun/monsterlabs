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

const formSchema = z.object({
  prompt: z.string().min(2, {
    message: "Prompt must be at least 2 characters.",
  }).max(500, {
    message: "Prompt must be at most 500 characters.",
  }),
});

export function LandingForm() {

  
  const [monster, setMonster] = useRecoilState(monsterState);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)

    // For example, send the form data to your API.
    const response = await fetch("/api/monster-gen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    console.log(response);

    if (response.ok) {

      console.log("in ok", response);

      const jsonResponse = await response.json();
      console.log(jsonResponse);
      // Handle the response.
      // For example, update the monster state with the received data.
      setMonster(jsonResponse as monsterSchemaType);
    } else {
      console.error("Failed to fetch monster data");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="A vampire dragon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}