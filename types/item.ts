import { z } from 'zod';

export const itemSchema = z.object({
  name: z.string(),
  type: z.union([z.literal('weapon'), z.literal('armor'), z.literal('potion'), z.literal('scroll'), z.literal('ring'), z.literal('wand'), z.literal('rod'), z.literal('staff'), z.literal('wondrous item'), z.literal('consumable'), z.literal('tool'), z.literal('trinket')]),
  subtype: z.string().describe("Subtype of the item, if applicable. Examples include 'longsword', 'dagger', etc. Leave blank if not applicable."),
  rarity: z.union([z.literal('common'), z.literal('uncommon'), z.literal('rare'), z.literal('very rare'), z.literal('legendary')]),
  isMagical: z.boolean(),
  requiresAttunement: z.object({
    requires: z.boolean(),
    requiresSpecific: z.array(z.string()).describe("If the item restricts attunement by class, this is the name of the class or race."),
  }).describe("Whether the item requires attunement, and if so, whether it requires attunement by a specific class. Only applies to magical items."),
  magicBonus: z.number().describe("The bonus granted by the item, if applicable. For example, a +1 sword would have a magic bonus of 1."),
  cost: z.object({
    unit: z.union([z.literal('pp'), z.literal('ep'), z.literal('gp'), z.literal('sp'), z.literal('cp')]),
    amount: z.number(),
  }),
  weight: z.number().describe("Weight in pounds"),
  description: z.object({
    header: z.string(),
    body: z.array(z.object({
      title: z.string(),
      content: z.string().describe("Description of the item. If the item can do something, explain how it works here. For example if it needs an action or bonus action to activate, or if it has charges, when they recharge etc."),
    })),
  }),
});

export type itemSchemaType = z.infer<typeof itemSchema>;
