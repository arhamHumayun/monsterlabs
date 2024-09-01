import { itemSchemaType } from "../item"

export interface itemsDocument {
  id: number,
  user_id: string,
  created_at: Date,
  updated_at: Date,
  name: string,
  type: "Weapon" | "Armor" | "Ammunition" | "Potion" | "Scroll" | "Ring" | "Wand" | "Rod" | "Staff" | "Wondrous item" | "Consumable" | "Tool" | "Trinket",
  subtype: string,
  rarity: "common" | "uncommon" | "rare" | "very rare" | "legendary",
  is_magical: boolean,
  magic_bonus: number,
  requires_attunement: boolean,
  requires_attunement_types: string[],
  cost_unit: "pp" | "ep" | "gp" | "sp" | "cp",
  cost_amount: number,
  weight: number,
  description: string,
  paragraphs: {
    title: string,
    content: string,
  }[],
}

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
    cost: {
      unit: item.cost_unit,
      amount: item.cost_amount,
    },

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
    cost_unit: item.cost.unit,
    cost_amount: item.cost.amount,
  }
}