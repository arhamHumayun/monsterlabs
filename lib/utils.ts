import { creature_creatureDataViewDocument, creatureViewDataPartial, creatureView, creatureData_creatureViewDocument } from "@/types/db";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function mapGetCreatureByUserId(data: creature_creatureDataViewDocument) : creatureViewDataPartial {
  const {
    id,
    user_id,
    created_at,
    creatures_data,
  } = data;

  const {
    is_published,
    name,
    lore,
  } = creatures_data[0];

  const versionId = creatures_data[0].id;

  return {
    id,
    versionId,
    user_id,
    is_published,
    created_at,
    json: {
      name,
      lore,
    }
  }
}

export function mapCreatureDocumentToCreatureView(data: creature_creatureDataViewDocument) : creatureView {
  const {
    id,
    user_id,
    created_at,
    creatures_data,
  } = data;

  const {
    is_published,
    name,
    isUnique,
    lore,
    appearance,
    pronoun,
    size,
    type,
    alignment,
    challengeRating,
    json,
  } = creatures_data.sort((a, b) => b.id - a.id)[0];

  const versionId = creatures_data[0].id;

  const {
    stats,
    hitDiceAmount,
    armorClass,
    speed,
    savingThrows,
    skills,
    senses,
    damageTakenModifiers,
    conditionImmunities,
    languages,
    traits,
    spellcasting,
    actions,
    reactions,
    legendary,
  } = json;

  return {
    id,
    versionId,
    user_id,
    is_published,
    created_at,
    json: {
      name,
      isUnique,
      lore,
      appearance,
      pronoun,
      size,
      type,
      alignment,
      stats,
      hitDiceAmount,
      armorClass,
      challengeRating: challengeRating / 100,
      speed,
      savingThrows,
      skills,
      senses,
      damageTakenModifiers,
      conditionImmunities,
      languages,
      traits,
      spellcasting,
      actions,
      reactions,
      legendary,
    }
  }
}

export function mapCreatureViewDocumentToCreatureView(data: creatureData_creatureViewDocument) : creatureView {
  const {
    id,
    user_id,
    creature_id,
    created_at,
    is_published,
    name,
    isUnique,
    lore,
    appearance,
    pronoun,
    size,
    type,
    alignment,
    challengeRating,
    json,
  } = data;

  const {
    stats,
    hitDiceAmount,
    armorClass,
    speed,
    savingThrows,
    skills,
    senses,
    damageTakenModifiers,
    conditionImmunities,
    languages,
    traits,
    spellcasting,
    actions,
    reactions,
    legendary,
  } = json;

  return {
    id: creature_id,
    versionId: id,
    user_id,
    is_published,
    created_at,
    json: {
      name,
      isUnique,
      lore,
      appearance,
      pronoun,
      size,
      type,
      alignment,
      stats,
      hitDiceAmount,
      armorClass,
      challengeRating: challengeRating / 100,
      speed,
      savingThrows,
      skills,
      senses,
      damageTakenModifiers,
      conditionImmunities,
      languages,
      traits,
      spellcasting,
      actions,
      reactions,
      legendary,
    }
  }
}