import { z } from 'zod';

export const itemSchema = z.object({
  name: z.string(),
  type: z.union([z.literal('Weapon'), z.literal('Armor'), z.literal('Ammunition'), z.literal('Potion'), z.literal('Scroll'), z.literal('Ring'), z.literal('Wand'), z.literal('Rod'), z.literal('Staff'), z.literal('Wondrous item'), z.literal('Consumable'), z.literal('Tool'), z.literal('Trinket')]),
  subtype: z.string().nullable().describe("Subtype of the item, if applicable. Examples include 'longsword', 'dagger', or 'plate', 'chain' etc. Leave blank if not applicable."),
  rarity: z.union([z.literal('common'), z.literal('uncommon'), z.literal('rare'), z.literal('very rare'), z.literal('legendary')]),
  requiresAttunement: z.boolean().describe("Whether the item requires attunement, and if so, whether it requires attunement by a specific class. Only applies to magical items that are very special and powerful. It should make sense for lore reasons. Generally avoid requiring attunement unless it makes a lot of sense."),
  requiresAttunementSpecific: z.string()
  // .startsWith("requires attunement by ")
  .describe("If the item requires attunement, specify what conditions someone must have in to attune to it. Do not include if the item does not require attunement. Always structure your sentence as 'requires attunement by ...'. For example, 'requires attunement by a wizard' or 'requires attunement by a creature of good alignment' or 'requires attunement by an elf, half-elf, or a ranger'.")
  // .default('')
  .nullable()
  .optional(),
  cost: z.number().describe("Cost in gold pieces"),
  weight: z.number().describe("Weight in pounds"),
  description: z.string().describe("A detailed and inspired description of the item. This should include its visual description, lore, history, and any other relevant information."),
  paragraphs: z.array(z.object({
    title: z.string(),
    content: z.string()
  })).describe("Description of the item. If the item can do something, explain how it works here. For example if it needs an action or bonus action to activate, or if it has charges, when they recharge etc."),
});

export type itemSchemaType = z.infer<typeof itemSchema>;
