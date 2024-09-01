import { z } from "zod"
import { itemSchemaType } from "../item"

export const itemTypesList = ["Weapon", "Armor", "Ammunition", "Potion", "Scroll", "Ring", "Wand", "Rod", "Staff", "Wondrous item", "Consumable", "Tool", "Trinket"] as const
export const itemRarityList = ["common", "uncommon", "rare", "very rare", "legendary"] as const

export const itemsDocumentSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  name: z.string(),
  type: z.enum(itemTypesList),
  subtype: z.string().nullable().default(''),
  rarity: z.enum(itemRarityList),
  requires_attunement: z.boolean(),
  requires_attunement_specific: z.string().nullable().default(''),
  cost_amount: z.number().transform(value => Math.round(value)),
  weight: z.number().int(),
  description: z.string(),
  paragraphs: z.array(z.object({
    title: z.string(),
    content: z.string(),
  })),
})

export interface itemsDocument extends z.infer<typeof itemsDocumentSchema> {}

export function itemDocumentToItemSchemaType(item: itemsDocument): itemSchemaType {
  return {
    name: item.name,
    subtype: item.subtype,
    weight: item.weight,
    description: item.description,
    paragraphs: item.paragraphs,
    type: item.type,
    rarity: item.rarity,
    requiresAttunement: item.requires_attunement,
    requiresAttunementSpecific: item.requires_attunement_specific,
    cost: item.cost_amount
  }
}

export function itemSchemaTypeToItemDocument(item: itemSchemaType, id: number, user_id: string, created_at: Date, updated_at: Date): itemsDocument {
  return {
    id,
    user_id,
    created_at,
    updated_at,
    name: item.name,
    type: item.type,
    subtype: item.subtype,
    rarity: item.rarity,
    weight: item.weight,
    description: item.description,
    paragraphs: item.paragraphs,
    requires_attunement: item.requiresAttunement,
    requires_attunement_specific: item.requiresAttunementSpecific ? item.requiresAttunementSpecific : '',
    cost_amount: item.cost,
  }
}