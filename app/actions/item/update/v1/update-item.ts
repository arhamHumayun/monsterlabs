"use server"

import { itemSchema, itemSchemaType } from "@/types/item";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const systemPrompt = `
The user will ask you to edit an item in DnD 5e and you have to be creative and edit the item.
Never ever include markdown anywhere in your response.
When describing the properties, fill out each paragraph field separately.
The header should be a brief description of the item. Other adding than extra lore, do not repeat information.

Make sure you only change the item based on the user's request. If they ask to remove, edit, or add something, make sure to do so.
`;
export async function updateItem(prompt: string, item: itemSchemaType): Promise<{ data?: itemSchemaType, error?: string }> {

  const completion = await openai.beta.chat.completions.parse({
    messages: [
      { "role": "system", "content": systemPrompt },
      { "role": "user", "content": JSON.stringify(item) },
      { "role": "user", "content": prompt },
    ],
    model: "gpt-4o-mini-2024-07-18",
    response_format: zodResponseFormat(itemSchema, "update_item"),
  });

  const newItem = completion.choices[0].message.parsed;

  if (!newItem) {
    return {
      error: "We were unable to generate an item. Please try again."
    }
  }

  return {
    data: newItem
  }
}

