"use client"

import { creatureSchemaType } from "@/types/creature"
import CreatureBlock from "./creature-block"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { CornerDownLeft } from "lucide-react";
import { Input } from "./ui/input";

const formSchema = z.object({
  prompt: z.string()
});

export function EditCreature({ creature }: { creature: creatureSchemaType} ) {

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="flex flex-row">
      <Form 
      {...form} 
      // aria-busy={isLoading}
      >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-2"
        >
          <div className="flex w-full rounded border">
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
          </div>
        </form>
        {/* {loading} */}
      </Form>
      <CreatureBlock creature={creature} />
    </div>
  )
}