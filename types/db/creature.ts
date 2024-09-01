import { z } from "zod";
import { creatureJsonBlobDocumentSchema, creatureSchemaType } from "../creature";

export const pronounsList = ["he", "she", "they", "it"] as const;
export const creatureTypesList = ["aberration", "beast", "celestial", "construct", "dragon", "elemental", "fey", "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead"] as const;
export const creatureAlignmentList = ["lawful good", "neutral good", "chaotic good", "lawful neutral", "true neutral", "neutral", "unaligned", "chaotic neutral", "lawful evil", "neutral evil", "chaotic evil"] as const;
export const creatureSizeList = ["tiny", "small", "medium", "large", "huge", "gargantuan"] as const;

export const creatureDocumentSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  name: z.string(),
  lore: z.string(),
  appearance: z.string(),
  pronoun: z.enum(pronounsList),
  type: z.enum(creatureTypesList),
  is_unique: z.boolean(),
  challenge_rating: z.number().min(25).max(3000),
  alignment: z.enum(creatureAlignmentList),
  size: z.enum(creatureSizeList),
  hit_dice_amount: z.number().min(1),
  json: creatureJsonBlobDocumentSchema,
})

export type creaturesDocument = z.infer<typeof creatureDocumentSchema>;

export const editCreatureDocumentSchema = creatureDocumentSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
})

export function creatureDocumentToCreatureSchemaType(creatureDocument: creaturesDocument): creatureSchemaType {
  return {
    name: creatureDocument.name,
    lore: creatureDocument.lore,
    appearance: creatureDocument.appearance,
    pronoun: creatureDocument.pronoun,
    type: creatureDocument.type,
    isUnique: creatureDocument.is_unique,
    challengeRating: creatureDocument.challenge_rating / 100,
    hitDiceAmount: creatureDocument.hit_dice_amount,
    alignment: creatureDocument.alignment,
    size: creatureDocument.size,
    ...creatureDocument.json,
  }
}

export function creatureSchemaTypeToCreatureDocument(creature: creatureSchemaType,
  id: number, userId: string,
  created_at: Date, updated_at: Date
): creaturesDocument {
  return {
    id,
    user_id: userId,
    created_at,
    updated_at,
    name: creature.name,
    lore: creature.lore,
    appearance: creature.appearance,
    pronoun: creature.pronoun,
    type: creature.type,
    is_unique: creature.isUnique,
    challenge_rating: creature.challengeRating * 100,
    alignment: creature.alignment,
    size: creature.size,
    hit_dice_amount: creature.hitDiceAmount,
    json: {
      stats: creature.stats,
      savingThrows: creature.savingThrows,
      skills: creature.skills,
      senses: creature.senses,
      speed: creature.speed,
      armorClass: creature.armorClass,
      damageTakenModifiers: creature.damageTakenModifiers,
      conditionImmunities: creature.conditionImmunities,
      languages: creature.languages,
      traits: creature.traits,
      spellcasting: creature.spellcasting,
      actions: creature.actions,
      reactions: creature.reactions,
      legendary: creature.legendary,
    }
  }
}
