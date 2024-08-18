import { z } from "zod";
import { creatureJsonBlobDocumentSchema, creatureSchemaType } from "../creature";

export interface creaturesDocument extends Creature {
  id: number,  // Document Id
  user_id: string,  // User Id
  created_at: Date,
  updated_at: Date,
}

export interface Creature {
  // Actual creature data
  name: string,
  lore: string,
  appearance: string,
  pronoun: "he" | "she" | "they" | "it",
  type: "aberration" | "beast" | "celestial" | "construct" | "dragon" | "elemental" | "fey" | "fiend" | "giant" | "humanoid" | "monstrosity" | "ooze" | "plant" | "undead",
  is_unique: boolean,
  challenge_rating: number,
  alignment: "lawful good" | "neutral good" | "chaotic good" | "lawful neutral" | "true neutral" | "neutral" | "unaligned" | "chaotic neutral" | "lawful evil" | "neutral evil" | "chaotic evil",
  size: "tiny" | "small" | "medium" | "large" | "huge" | "gargantuan",
  hit_dice_amount: number,
  json: z.infer<typeof creatureJsonBlobDocumentSchema>
}

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

export function creatureDocumentToCreature(creatureDocument: creaturesDocument): Creature {
  return {
    name: creatureDocument.name,
    lore: creatureDocument.lore,
    appearance: creatureDocument.appearance,
    pronoun: creatureDocument.pronoun,
    type: creatureDocument.type,
    is_unique: creatureDocument.is_unique,
    challenge_rating: creatureDocument.challenge_rating * 100,
    alignment: creatureDocument.alignment,
    size: creatureDocument.size,
    hit_dice_amount: creatureDocument.hit_dice_amount,
    json: creatureDocument.json
  }
}