import { z } from "zod"
import { itemSchemaType } from "../item"

export const itemTypesList = ["Weapon", "Armor", "Ammunition", "Potion", "Scroll", "Ring", "Wand", "Rod", "Staff", "Wondrous item", "Consumable", "Tool", "Trinket"] as const
export const itemRarityList = ["common", "uncommon", "rare", "very rare", "legendary"] as const
export const itemCostUnitList = ["pp", "ep", "gp", "sp", "cp"] as const

export const itemsDocumentSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  name: z.string(),
  type: z.enum(itemTypesList),
  subtype: z.string(),
  rarity: z.enum(itemRarityList),
  is_magical: z.boolean(),
  magic_bonus: z.number(),
  requires_attunement: z.boolean(),
  requires_attunement_types: z.array(z.string()),
  cost_amount: z.number(),
  weight: z.number(),
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
    isMagical: item.is_magical,
    magicBonus: item.magic_bonus,
    weight: item.weight,
    description: item.description,
    paragraphs: item.paragraphs,
    type: item.type,
    rarity: item.rarity,
    requiresAttunement: {
      requires: item.requires_attunement,
      requiresSpecific: item.requires_attunement_types,
    },
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
    is_magical: item.isMagical,
    requires_attunement: item.requiresAttunement.requires,
    requires_attunement_types: item.requiresAttunement.requiresSpecific,
    magic_bonus: item.magicBonus,
    cost_amount: item.cost,
  }
}