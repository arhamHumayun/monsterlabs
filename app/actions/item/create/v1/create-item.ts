"use server"

import { itemSchema, itemSchemaType } from "@/types/item";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const systemPrompt = `
The user will enter an idea for an item in DnD 5e and you have to be creative and create the item.
Never ever include markdown anywhere in your response.
When describing the properties, fill out each paragraph field separately.
The header should be a brief description of the item. Other adding than extra lore, do not repeat information.
Try not to write too much, but also not too little. The item should be balanced and interesting.
`;

export async function createItem(prompt: string): Promise<{ data?: itemSchemaType, error?: string }> {

  const completion = await openai.beta.chat.completions.parse({
    messages: [
      { "role": "system", "content": systemPrompt },
      { "role": "user", "content": prompt },
    ],
    model: "gpt-4o-mini-2024-07-18",
    response_format: zodResponseFormat(itemSchema, "create_item"),
  });

  const item = completion.choices[0].message.parsed;

  if (!item) {
    return {
      error: "We were unable to generate an item. Please try again."
    }
  }

  return {
    data: item
  }
}

