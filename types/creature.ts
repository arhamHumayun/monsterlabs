import { z } from 'zod';

const statNumSchema = z.number().min(1).max(30);

const statSchema = z.object({
  strength: statNumSchema.describe("The physical strength of the creature. Used for physical attacks and checks."),
  dexterity: statNumSchema.describe("The agility and reflexes of the creature. Used for dodging and ranged attacks."),
  constitution: statNumSchema.describe("The health and stamina of the creature. Used for health and resisting poisons and diseases."),
  intelligence: statNumSchema.describe("The mental capacity of the creature. Used for knowledge and spellcasting."),
  wisdom: statNumSchema.describe("The perception and insight of the creature. Used for spellcasting, detecting lies and seeing through illusions."),
  charisma: statNumSchema.describe("The charm and presence of the creature. Used for social interactions and spellcasting."),
});

const speedNumSchema = z.number().min(0);

const speedSchema = z.object({
  walk: speedNumSchema,
  fly: speedNumSchema.optional(),
  swim: speedNumSchema.optional(),
  burrow: speedNumSchema.optional(),
  climb: speedNumSchema.optional()
});

const savingThrowSchema = z.object({
  strength: z.boolean().optional(),
  dexterity: z.boolean().optional(),
  constitution: z.boolean().optional(),
  intelligence: z.boolean().optional(),
  wisdom: z.boolean().optional(),
  charisma: z.boolean().optional()
});

export const orderedKeys: (keyof statsType)[] = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
];

const singleStatSchema = z.enum(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']);

const skillsSchema = z.object({
  acrobatics: z.boolean().optional(),
  animalHandling: z.boolean().optional(),
  arcana: z.boolean().optional(),
  athletics: z.boolean().optional(),
  deception: z.boolean().optional(),
  history: z.boolean().optional(),
  insight: z.boolean().optional(),
  intimidation: z.boolean().optional(),
  investigation: z.boolean().optional(),
  medicine: z.boolean().optional(),
  nature: z.boolean().optional(),
  perception: z.boolean().optional(),
  performance: z.boolean().optional(),
  persuasion: z.boolean().optional(),
  religion: z.boolean().optional(),
  sleightOfHand: z.boolean().optional(),
  stealth: z.boolean().optional(),
  survival: z.boolean().optional(),
});

const armorClassSchema = z.object({
  base: z.number().min(0),
  type: z.enum(['natural', 'armor']),
  hasShield: z.boolean().optional(),
});

const sensesNumSchema = z.number().min(0);

const sensesSchema = z.object({
  blindsight: sensesNumSchema.optional().describe('The range in feet of the creatures ability to see without relying on sight. 0 if the creature does not have blindsight.'),
  darkvision: sensesNumSchema.optional().describe('The range in feet of the creatures ability to see in the dark. 0 if the creature does not have darkvision.'),
  tremorsense: sensesNumSchema.optional().describe('The range in feet of the creatures ability to sense vibrations in the ground. 0 if the creature does not have tremorsense.'),
  truesight: sensesNumSchema.optional().describe('The range in feet of the creatures ability to see in normal and magical darkness, see illusions and invisible objects. The strongest and truest sense that exists. 0 if the creature does not have truesight.'),
}).describe('The range of the creatures senses in feet. Leave out if the creature does not have any special senses.');

const damageTypeSchema = z.enum(['acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder']);

export type damageMultiplierLiteral = 'resistance' | 'immunity' | 'vulnerability' | 'normal';
const damageMultiplierSchema = z.enum(['resistance', 'immunity', 'vulnerability', 'normal']).describe('Resistance means half damage, immunity means no damage, and vulnerability means double damage. Leave it out if the creature has relation to the damage type. Do not enter normal.');

const damagesBaseSchema = z.object({
  nonMagicalBludgeoning: damageMultiplierSchema.optional(),
  nonMagicalSlashing: damageMultiplierSchema.optional(),
  nonMagicalPiercing: damageMultiplierSchema.optional(),
  magicalBludgeoning: damageMultiplierSchema.optional(),
  magicalSlashing: damageMultiplierSchema.optional(),
  magicalPiercing: damageMultiplierSchema.optional(),
  acid: damageMultiplierSchema.optional(),
  cold: damageMultiplierSchema.optional(),
  fire: damageMultiplierSchema.optional(),
  force: damageMultiplierSchema.optional(),
  lightning: damageMultiplierSchema.optional(),
  necrotic: damageMultiplierSchema.optional(),
  poison: damageMultiplierSchema.optional(),
  psychic: damageMultiplierSchema.optional(),
  radiant: damageMultiplierSchema.optional(),
  thunder: damageMultiplierSchema.optional(),
});

export enum conditionSchemaEnum {
  blinded = 'blinded',
  charmed = 'charmed',
  deafened = 'deafened',
  frightened = 'frightened',
  grappled = 'grappled',
  exhaustion = 'exhaustion',
  incapacitated = 'incapacitated',
  invisible = 'invisible',
  paralyzed = 'paralyzed',
  petrified = 'petrified',
  poisoned = 'poisoned',
  prone = 'prone',
  restrained = 'restrained',
  stunned = 'stunned',
  unconscious = 'unconscious',
}
const conditionsSchema = z.enum(['blinded', 'charmed', 'deafened', 'frightened', 'grappled', 'exhaustion', 'incapacitated', 'invisible', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'stunned', 'unconscious']);

const conditionImmunitiesSchema = z.array(conditionsSchema).optional().describe('The conditions the creature is immune to. Leave out if the creature is not immune to any conditions.');

const specialTraitsSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const diceSides = [4, 6, 8, 10, 12, 20, 100];
const diceSchema = z.object({
  count: z.number().min(1),
  sides: z.number().min(4).max(100).refine(val => diceSides.includes(val), {
    message: "Not a valid dice type",
  })
});

const rechargeSchema = z.object({
  min: z.number().min(1).max(6),
  max: z.number().min(1).max(6),
});

const attackHitSchema = z.object({
  damage: z.object({
    primary: z.object({
      damageStat: singleStatSchema.optional().describe('The stat bonus the creature uses for the attack, only used if the attack is a weapon attack. If the attack is a spell attack use the spellcasting stat bonus.'),
      damageDice: diceSchema,
      damageType: damageTypeSchema,
      alternateDamageDice: z.object({
        condition: z.enum(['critical', 'advantage', 'two-handed']).describe('The condition that triggers the alternate damage dice'),
        damageDice: diceSchema,
      }).optional().describe('The alternate damage dice the creature uses if the condition is met.'),
    }),
    secondary: z.object({
      damageDice: diceSchema,
      damageType: damageTypeSchema,
    }).optional().describe('The potential secondary damage the creature deals if the attack hits. Typically an elemental or magical damage.'),
  }).optional(),
  affect: z.string().optional().describe('The affect the target will be affected by from the attack. Think of the condition before the description. Describe what happens to them and how they can get rid of it.'),
});

const targetedAttackSchema = z.object({
  name: z.string(),
  attackType: z.enum(['weapon', 'spell', 'psionic', 'innate']),
  targetCount: z.number().min(1).describe('The number of targets the attack can affect.'),
  rechargeRange: rechargeSchema.optional().describe('The recharge range of the attack. Leave out if the attack does not have a recharge.'),
  attackStat: singleStatSchema.describe('The stat the creature uses for the attack.'),
  targetType: z.enum(['creature', 'target']).describe('The type of target. Default to target unless the attack depends on targeting a living creature.'),
  range: z.object({
    melee: z.number().min(5).max(30).optional().describe('The reach of the attack if it is a melee attack.'),
    ranged: z.number().min(10).optional().describe('The normal range of the attack if it is a ranged attack.'),
  }),
  hit: attackHitSchema
});

const saveAttackSchema = z.object({
  name: z.string(),
  rechargeRange: rechargeSchema.optional().describe('The recharge range of the attack. Leave out if the attack does not have a recharge.'),
  savingThrow: z.object({
    save: singleStatSchema.describe('The stat the target must save against.'),
    attack: singleStatSchema.describe('The stat the creature must attack with.'),
  }),
  description: z.string().describe('The description of the entire attack. The save DC should be 8 + proficiency bonus + the stat bonus the creature uses for the attack.'),
});

const genericActionSchema = z.object({
  name: z.string(),
  description: z.string()
})

const languagesSchema = z.object({
  common: z.boolean().optional(),
  dwarvish: z.boolean().optional(),
  elvish: z.boolean().optional(),
  giant: z.boolean().optional(),
  gnomish: z.boolean().optional(),
  goblin: z.boolean().optional(),
  halfling: z.boolean().optional(),
  orc: z.boolean().optional(),
  abyssal: z.boolean().optional(),
  celestial: z.boolean().optional(),
  draconic: z.boolean().optional(),
  "deep speech": z.boolean().optional(),
  infernal: z.boolean().optional(),
  primordial: z.boolean().optional(),
  sylvan: z.boolean().optional(),
  undercommon: z.boolean().optional(),
  telepathy: z.object({
    range: z.number().min(0),
    description: z.string(),
  }).optional(),
});

const legendarySchema = z.object({
  actionsPerTurn: z.number().min(1),
  resistance: z.number().min(0),
  traits: z.array(specialTraitsSchema).optional(),
  actions: z.array(z.object({
    cost: z.number().min(1).default(1).optional().describe('The cost of the legendary action. This is the number of legendary actions the creature must spend to take the action.'),
    name: z.string(),
    description: z.string().describe('The description of the legendary action the creature can take. This can also be an action or attack that the creature already has.'),
  })),
});

const actionSchema = z.object({
  multiAttack: z.string().optional().describe('The multi-attack the creature can take. Only used for creatures that can make multiple weapon or natural attacks in a single turn. Simply describe the attacks the creature can make in a single turn.'),
  savingThrowAttacks: z.array(saveAttackSchema).optional().describe('This type of attack requires the target to make a saving throw. This could be a spell or a special ability such as a breath attack. Describe AoE attacks here.'),
  targetedWeaponAttacks: z.array(targetedAttackSchema).optional().describe('This attack requires an attack roll and is typically a weapon or non-AoE spell attacks. Do not describe spells, breath attacks, or other AoE attacks here.'),
  specialActions: z.array(genericActionSchema).optional().describe('Other special actions the creature can take. Fill this in last. Do not describe spells here.'),
}).describe(
  `The actions the creature can take. Never describe just plain spells here. Remeber to include multiattack if the creature has one. Keep in mind the following:
  - Multiattack is a sentence that describes the creature's multiattack.
  - TargetedWeaponAttacks are for attacks that target a specific creature. Do not include AoE or saving throw attacks here.
  - SavingThrowAttacks are for attacks that require a saving throw.
  - SpecialActions are for actions that do not fit either criteria.`
);

const spellcastingSchema = z.object({
  spellcastingStat: singleStatSchema.describe('The stat the creature uses for spellcasting.'),
  spellcastingLevel: z.number().min(1).max(20).describe('The level of the spellcasting the creature has.'),
  spellcastingClass: z.enum(['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard']).describe('The class the creature uses for spellcasting.'),
  spells: z.array(z.object({
    name: z.string(),
    level: z.number().min(0).max(9)
  })).describe('The spells the creature can cast. Include cantrips as level 0 spells. Make sure to include at least one spell per each level that the creature can cast. '),
}).describe("Make sure to include at least one spell per each level that the creature can cast. ");

const reactionsSchema = z.object({
  reactions: z.array(genericActionSchema),
});

const traitsSchema = z.object({
  traits: z.array(specialTraitsSchema)
});

export const creatureSchema = z.object({
  name: z.string(),
  isUnique: z.boolean().describe('If the creature is unique, meaning there is only one of its kind in the world.'),
  lore: z.string(),
  appearance: z.string(),
  pronoun: z.enum(['he', 'she', 'they', 'it']).describe("Always fill this in."),
  stats: statSchema,
  hitDiceAmount: z.number().min(1).describe('The number of hit dice given to the creature. The actual max health is based off of this amount'), // Total health determined by size, constitution, and hitDiceAmount
  armorClass: armorClassSchema,
  size: z.enum(['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan']),
  type: z.enum(['aberration', 'beast', 'celestial', 'construct', 'dragon', 'elemental', 'fey', 'fiend', 'giant', 'humanoid', 'monstrosity', 'ooze', 'plant', 'undead']),
  alignment: z.enum(['lawful good', 'neutral good', 'chaotic good', 'lawful neutral', 'true neutral', 'neutral', 'unaligned', 'chaotic neutral', 'lawful evil', 'neutral evil', 'chaotic evil']).describe('The alignment of the creature. Always fill in the alignment. If no alignment is given, the creature is true neutral.'),
  challengeRating: z.number().min(0).max(30),
  speed: speedSchema,
  savingThrows: savingThrowSchema.optional().describe('Which saving throws the creature is proficient in.'),
  skills: skillsSchema.optional(),
  senses: sensesSchema.optional(),
  damageTakenModifiers: damagesBaseSchema.optional().describe('The damage multipliers the creature has for each damage type.'),
  conditionImmunities: conditionImmunitiesSchema.optional(),
  languages: languagesSchema,
  traits: z.array(specialTraitsSchema).min(1).optional().describe('The special traits the creature has. Do not describe legendary resistance or actions. Never repeat the same trait. Always include some traits.'),
  spellcasting: spellcastingSchema.optional().describe('The spells the creature can cast and other info. Only fill in if the creature can cast spells.'),
  actions: actionSchema.optional(),
  reactions: z.array(genericActionSchema).optional().nullable().describe('Used for creatures that can take a reaction. Do not describe legendary resistance. Do not describe spells like shield and counterspell.'),
  legendary: legendarySchema.optional().nullable().describe('Used for high level or boss creatures.'),
});

export const chunkedMonsterSchema = {
  base: z.object({
    name: z.string(),
    isUnique: z.boolean().describe('If the creature is unique, meaning there is only one of its kind in the world.'),
    lore: z.string(),
    appearance: z.string(),
    stats: statSchema,
    hitDiceAmount: z.number().min(1).describe('The number of hit dice given to the creature. The actual max health is based off of this amount'), // Total health determined by size, constitution, and hitDiceAmount
    armorClass: armorClassSchema,
    size: z.enum(['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan']),
    type: z.enum(['aberration', 'beast', 'celestial', 'construct', 'dragon', 'elemental', 'fey', 'fiend', 'giant', 'humanoid', 'monstrosity', 'ooze', 'plant', 'undead']),
    alignment: z.enum(['lawful good', 'neutral good', 'chaotic good', 'lawful neutral', 'true neutral', 'neutral', 'unaligned', 'chaotic neutral', 'lawful evil', 'neutral evil', 'chaotic evil']).describe('The alignment of the creature. Always fill in the alignment. If no alignment is given, the creature is true neutral.'),
    challengeRating: z.number().min(0).max(30),
    speed: speedSchema,
    savingThrows: savingThrowSchema.describe('Which saving throws the creature is proficient in.'),
    skills: skillsSchema.optional(),
    senses: sensesSchema.optional(),
    damageTakenModifiers: damagesBaseSchema.optional().describe('The damage multipliers the creature has for each damage type.'),
    conditionImmunities: conditionImmunitiesSchema.optional(),
    languages: languagesSchema,
  }),
  multiAttack: z.object({
    multiAttack: z.string().optional().describe('The multi-attack the creature can take. Only used for creatures that can make multiple weapon or natural attacks in a single turn. Simply describe the attacks the creature can make in a single turn.'),
  }),
  savingThrowAttacks: z.object({
    savingThrowAttacks: z.array(saveAttackSchema).optional().describe('This type of attack requires the target to make a saving throw. This could be a spell or a special ability such as a breath attack. Describe AoE attacks here.'),
  }),
  targetedWeaponAttacks: z.object({
    targetedWeaponAttacks: z.array(targetedAttackSchema).optional().describe('This attack requires an attack roll and is typically a weapon or non-AoE spell attacks. Do not describe spells, breath attacks, or other AoE attacks here.'),
  }),
  specialActions: z.object({
    specialActions: z.array(genericActionSchema).optional().describe('Other special actions the creature can take. Fill this in last. Do not describe spells here.'),
  }),
  traits: z.object({
    traits: z.array(specialTraitsSchema).min(1).optional().describe('The special traits the creature has. Do not describe legendary resistance or actions. Never repeat the same trait. Always include some traits.'),
  }),
  spellcasting: spellcastingSchema.describe('The spells the creature can cast. Only fill in if the creature can cast spells.'),
  legendary: legendarySchema,
  reactions: z.object({
    reactions: z.array(genericActionSchema).optional().describe('Used for creatures that can take a reaction. Do not describe legendary resistance. Do not describe spells like shield and counterspell.'),
  })
}

export const creatureDataDocumentSchema = z.object({
  name: z.string(),
  lore: z.string(),
  pronoun: z.enum(['he', 'she', 'they', 'it']).describe("Always fill this in."),
  appearance: z.string(),
  size: z.enum(['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan']),
  type: z.enum(['aberration', 'beast', 'celestial', 'construct', 'dragon', 'elemental', 'fey', 'fiend', 'giant', 'humanoid', 'monstrosity', 'ooze', 'plant', 'undead']),
  isUnique: z.boolean().describe('If the creature is unique, meaning there is only one of its kind in the world.'),
  challengeRating: z.number().min(0).max(30),
  alignment: z.enum(['lawful good', 'neutral good', 'chaotic good', 'lawful neutral', 'true neutral', 'neutral', 'unaligned', 'chaotic neutral', 'lawful evil', 'neutral evil', 'chaotic evil']).describe('The alignment of the creature. Always fill in the alignment. If no alignment is given, the creature is true neutral.'),
  json: z.object({
    stats: statSchema,
    hitDiceAmount: z.number().min(1).describe('The number of hit dice given to the creature. The actual max health is based off of this amount'), // Total health determined by size, constitution, and hitDiceAmount
    armorClass: armorClassSchema,
    speed: speedSchema,
    savingThrows: savingThrowSchema.optional().describe('Which saving throws the creature is proficient in.'),
    skills: skillsSchema.optional(),
    senses: sensesSchema.optional(),
    damageTakenModifiers: damagesBaseSchema.optional().describe('The damage multipliers the creature has for each damage type.'),
    conditionImmunities: conditionImmunitiesSchema.optional(),
    languages: languagesSchema,
    traits: z.array(specialTraitsSchema).min(1).optional().describe('The special traits the creature has. Do not describe legendary resistance or actions. Never repeat the same trait. Always include some traits.'),
    spellcasting: spellcastingSchema.optional().describe('The spells the creature can cast and other info. Only fill in if the creature can cast spells.'),
    actions: actionSchema.optional(),
    reactions: z.array(genericActionSchema).optional().nullable().describe('Used for creatures that can take a reaction. Do not describe legendary resistance. Do not describe spells like shield and counterspell.'),
    legendary: legendarySchema.optional().nullable().describe('Used for high level or boss creatures.'),
  }),
});

export type creatureDataDocumentType = z.infer<typeof creatureDataDocumentSchema>;

export type chunkedMonsterType = z.infer<typeof chunkedMonsterSchema.base>;
export type traitsType = z.infer<typeof chunkedMonsterSchema.traits>;
export type spellcastingType = z.infer<typeof chunkedMonsterSchema.spellcasting>;
export type legendaryType = z.infer<typeof chunkedMonsterSchema.legendary>;
export type reactionsType = z.infer<typeof chunkedMonsterSchema.reactions>;

export type creatureSchemaType = z.infer<typeof creatureSchema>;
export type damageTakenModifiersType = z.infer<typeof damagesBaseSchema>;
export type speedType = z.infer<typeof speedSchema>;
export type statsType = z.infer<typeof statSchema>;
export type savingThrowsType = z.infer<typeof savingThrowSchema>;
export type skillsType = z.infer<typeof skillsSchema>;

export const sizeToHitDice = {
  tiny: 4,
  small: 6,
  medium: 8,
  large: 10,
  huge: 12,
  gargantuan: 20,
};

export const statToBonus = (stat: number) => Math.floor((stat - 10) / 2);

export const skillToStat: Record<string, string> = {
  acrobatics: 'dexterity',
  animalHandling: 'wisdom',
  arcana: 'intelligence',
  athletics: 'strength',
  deception: 'charisma',
  history: 'intelligence',
  insight: 'wisdom',
  intimidation: 'charisma',
  investigation: 'intelligence',
  medicine: 'wisdom',
  nature: 'intelligence',
  perception: 'wisdom',
  performance: 'charisma',
  persuasion: 'charisma',
  religion: 'intelligence',
  sleightOfHand: 'dexterity',
  stealth: 'dexterity',
  survival: 'wisdom',
};

export const pronounToSubject = {
  he: 'his',
  she: 'her',
  they: 'their',
  it: 'its',
};

interface spellSlotsPerLevel {
  level: number,
  count: number
}


export const spellSlotsPerLevelMapping: Record<number, spellSlotsPerLevel[]> = {
  1: [
    { level: 1, count: 2 }
  ],
  2: [
    { level: 1, count: 3 }
  ],
  3: [
    { level: 1, count: 4 },
    { level: 2, count: 2 }
  ],
  4: [
    { level: 1, count: 4 },
    { level: 2, count: 3 }
  ],
  5: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 2 }
  ],
  6: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 }
  ],
  7: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 },
    { level: 4, count: 1 }
  ],
  8: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 },
    { level: 4, count: 2 }
  ],
  9: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 },
    { level: 4, count: 3 }
  ],
  10: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 },
    { level: 4, count: 3 },
    { level: 5, count: 1 }
  ],
  11: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 },
    { level: 4, count: 3 },
    { level: 5, count: 2 },
    { level: 6, count: 1 }
  ],
  12: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 },
    { level: 4, count: 3 },
    { level: 5, count: 2 },
    { level: 6, count: 1 }
  ],
  13: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 },
    { level: 4, count: 3 },
    { level: 5, count: 2 },
    { level: 6, count: 1 },
    { level: 7, count: 1 }
  ],
  14: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 },
    { level: 4, count: 3 },
    { level: 5, count: 2 },
    { level: 6, count: 1 },
    { level: 7, count: 1 }
  ],
  15: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 },
    { level: 4, count: 3 },
    { level: 5, count: 2 },
    { level: 6, count: 1 },
    { level: 7, count: 1 },
    { level: 8, count: 1 }
  ],
  16: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 },
    { level: 4, count: 3 },
    { level: 5, count: 2 },
    { level: 6, count: 1 },
    { level: 7, count: 1 },
    { level: 8, count: 1 }
  ],
  17: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 },
    { level: 4, count: 3 },
    { level: 5, count: 2 },
    { level: 6, count: 1 },
    { level: 7, count: 1 },
    { level: 8, count: 1 },
    { level: 9, count: 1 }
  ],
  18: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 },
    { level: 4, count: 3 },
    { level: 5, count: 3 },
    { level: 6, count: 1 },
    { level: 7, count: 1 },
    { level: 8, count: 1 },
    { level: 9, count: 1 }
  ],
  19: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 },
    { level: 4, count: 3 },
    { level: 5, count: 3 },
    { level: 6, count: 2 },
    { level: 7, count: 1 },
    { level: 8, count: 1 },
    { level: 9, count: 1 }
  ],
  20: [
    { level: 1, count: 4 },
    { level: 2, count: 3 },
    { level: 3, count: 3 },
    { level: 4, count: 3 },
    { level: 5, count: 3 },
    { level: 6, count: 2 },
    { level: 7, count: 2 },
    { level: 8, count: 1 },
    { level: 9, count: 1 }
  ]
};

export const challengeRatingToXP: Record<number, number> = {
  0: 0,
  0.125: 25, // 1/8
  0.25: 50, // 1/4
  0.5: 100, // 1/2
  1: 200,
  2: 450,
  3: 700,
  4: 1100,
  5: 1800,
  6: 2300,
  7: 2900,
  8: 3900,
  9: 5000,
  10: 5900,
  11: 7200,
  12: 8400,
  13: 10000,
  14: 11500,
  15: 13000,
  16: 15000,
  17: 18000,
  18: 20000,
  19: 22000,
  20: 25000,
  21: 33000,
  22: 41000,
  23: 50000,
  24: 62000,
  25: 75000,
  26: 90000,
  27: 105000,
  28: 120000,
  29: 135000,
  30: 155000
};

export const digitToWord = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
}