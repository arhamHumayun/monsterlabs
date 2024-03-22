import { z } from 'zod';

const statNumSchema = z.number().min(1).max(30);

const statSchema = z.object({
  strength: statNumSchema.describe("The physical strength of the monster. Used for physical attacks and checks."),
  dexterity: statNumSchema.describe("The agility and reflexes of the monster. Used for dodging and ranged attacks."),
  constitution: statNumSchema.describe("The health and stamina of the monster. Used for health and resisting poisons and diseases."),
  intelligence: statNumSchema.describe("The mental capacity of the monster. Used for knowledge and spellcasting."),
  wisdom: statNumSchema.describe("The perception and insight of the monster. Used for spellcasting, detecting lies and seeing through illusions."),
  charisma: statNumSchema.describe("The charm and presence of the monster. Used for social interactions and spellcasting."),
});

const speedNumSchema = z.number().min(0);

const speedSchema = z.object({
  walk: speedNumSchema.describe('The speed of the monster on foot'),
  fly: speedNumSchema.optional().describe('The speed of the monster while flying'),
  swim: speedNumSchema.optional().describe('The speed of the monster while swimming'),
  burrow: speedNumSchema.optional().describe('The speed of the monster while burrowing'),
  climb: speedNumSchema.optional().describe('The speed of the monster while climbing'),
});

const savingThrowSchema = z.object({
  strength: z.boolean().optional(),
  dexterity: z.boolean().optional(),
  constitution: z.boolean().optional(),
  intelligence: z.boolean().optional(),
  wisdom: z.boolean().optional(),
  charisma: z.boolean().optional()
});

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
  blindsight: sensesNumSchema.optional().describe('The range of the creatures ability to see without relying on sight. 0 if the monster does not have blindsight.'),
  darkvision: sensesNumSchema.optional().describe('The range of the creatures ability to see in the dark. 0 if the monster does not have darkvision.'),
  tremorsense: sensesNumSchema.optional().describe('The range of the creatures ability to sense vibrations in the ground. 0 if the monster does not have tremorsense.'),
  truesight: sensesNumSchema.optional().describe('The range of the creatures ability to see in normal and magical darkness, see illusions and invisible objects. The strongest and truest sense that exists. 0 if the monster does not have truesight.'),
});

const damageTypeSchema = z.enum(['acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder']);

export type damageMultiplierLiteral = 'resistance' | 'immunity' | 'vulnerability' | 'normal';
const damageMultiplierSchema = z.enum(['resistance', 'immunity', 'vulnerability', 'normal']).describe('Resistance means half damage, immunity means no damage, and vulnerability means double damage. Leave it out if the monster has relation to the damage type. Do not enter normal.');

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

const conditionImmunitiesSchema = z.object({
  blinded: z.boolean().optional(),
  charmed: z.boolean().optional(),
  deafened: z.boolean().optional(),
  frightened: z.boolean().optional(),
  grappled: z.boolean().optional(),
  incapacitated: z.boolean().optional(),
  invisible: z.boolean().optional(),
  paralyzed: z.boolean().optional(),
  petrified: z.boolean().optional(),
  poisoned: z.boolean().optional(),
  prone: z.boolean().optional(),
  restrained: z.boolean().optional(),
  stunned: z.boolean().optional(),
  unconscious: z.boolean().optional(),
}).describe('The conditions the monster is immune to. Only make the monster immune to conditions that make sense for the monster. True means the monster is immune to the condition, false means the monster is not immune to the condition.');

const specialTraitsSchema = z.object({
  name: z.string(),
  description: z.string(),
}).describe('The legendary actions the monster can take. Do not describe legendary resistance.');

const diceSides = [4, 6, 8, 10, 12, 20, 100];
const diceSchema = z.object({
  count: z.number().min(1),
  sides: z.number().min(4).max(100).refine(val => diceSides.includes(val), {
    message: "Not a valid dice type",
  })
});

const attackHitSchema = z.object({
  damage: z.object({
    primary: z.object({
      damageStat: singleStatSchema.optional().describe('The stat bonus the monster uses for the attack, only used if the attack is a weapon attack. If the attack is a spell attack use the spellcasting stat bonus.'),
      damageDice: diceSchema,
      damageType: damageTypeSchema,
      alternateDamageDice: z.object({
        condition: z.enum(['critical', 'advantage', 'two-handed']).describe('The condition that triggers the alternate damage dice'),
        damageDice: diceSchema,
      }).optional().describe('The alternate damage dice the monster uses if the condition is met.'),
    }),
    secondary: z.object({
      damageDice: diceSchema,
      damageType: damageTypeSchema,
    }).optional().describe('The potential secondary damage the monster deals if the attack hits. Typically an elemental or magical damage.'),
  }).optional(),
  affect: z.string().optional().describe('The affect the target will be affected by from the attack. Think of the condition before the description. Describe what happens to them and how they can get rid of it.'),
});

const targetedAttackSchema = z.object({
  name: z.string(),
  attackType: z.enum(['weapon', 'spell', 'psionic', 'innate']),
  targetCount: z.number().min(1).describe('The number of targets the attack can affect.'),
  recharge: z.number().min(0).max(6).optional().describe('The number of turns before the attack can be used again. Leave out or 0 if the attack can be used every turn.'),
  attackStat: singleStatSchema.describe('The stat the monster uses for the attack.'),
  targetType: z.enum(['creature', 'target']).describe('The type of target. Default to target unless the attack depends on targeting a living creature.'),
  range: z.object({
    melee: z.number().min(5).max(30).optional().describe('The reach of the attack if it is a melee attack.'),
    ranged: z.number().min(10).optional().describe('The normal range of the attack if it is a ranged attack.'),
  }),
  hit: attackHitSchema
});

const saveAttackSchema = z.object({
  name: z.string(),
  recharge: z.number().min(0).max(6).optional(),
  savingThrow: z.object({
    save: singleStatSchema.describe('The stat the target must save against.'),
    attack: singleStatSchema.describe('The stat the monster must attack with.'),
  }),
  description: z.string().describe('The description of the entire attack. The save DC should be 8 + proficiency bonus + the stat bonus the monster uses for the attack.'),
});

const genericActionSchema = z.object({
  name: z.string(),
  description: z.string()
}).describe('A special or generic action the monster can take that is not a weapon or spell attack or spell save attack. Only used for creatures that have special abilities or actions that are not attacks as defined by the other attack types.');

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
    cost: z.number().min(1).default(1).optional().describe('The cost of the legendary action. This is the number of legendary actions the monster must spend to take the action.'),
    name: z.string(),
    description: z.string().describe('The description of the legendary action the monster can take. This can also be an action or attack that the monster already has.'),
  })),
});

const actionSchema = z.object({
  multiAttack: z.string().optional().describe('The multi-attack the monster can take. Only used for creatures that can make multiple weapon or natural attacks in a single turn. Simply describe the attacks the monster can make in a single turn.'),
  targetedWeaponAttacks: z.array(targetedAttackSchema).optional().describe('The targeted attacks the monster can take. This attack requires an attack roll.'),
  savingThrowAttacks: z.array(saveAttackSchema).optional().describe('The save attacks the monster can take. This type of attack requires the target to make a saving throw. If the target fails the save, they take the full effect of the attack. This could be a spell or a special ability such as a breath attack.'),
  specialActions: z.array(genericActionSchema).optional().describe('The special actions the monster can take. Only used for creatures that have special abilities which are not targeted attacks or save attacks or actions that are not attacks.'),
});

const spellcastingSchema = z.object({
  spellcastingStat: singleStatSchema.describe('The stat the monster uses for spellcasting.'),
  spellcastingLevel: z.number().min(1).max(20).describe('The level of the spellcasting the monster has.'),
  spellcastingClass: z.enum(['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard']).describe('The class the monster uses for spellcasting.'),
  spells: z.array(z.object({
    name: z.string(),
    level: z.number().min(0).max(9)
  })),
});

export const monsterSchema = z.object({
  name: z.string(),
  isUnique: z.boolean().describe('If the monster is unique, meaning there is only one of its kind in the world.'),
  lore: z.string(),
  appearance: z.string(),
  stats: statSchema,
  hitDiceAmount: z.number().min(1).describe('The number of hit dice given to the monster. The actual max health is based off of this amount'), // Total health determined by size, constitution, and hitDiceAmount
  armorClass: armorClassSchema,
  size: z.enum(['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan']),
  type: z.enum(['aberration', 'beast', 'celestial', 'construct', 'dragon', 'elemental', 'fey', 'fiend', 'giant', 'humanoid', 'monstrosity', 'ooze', 'plant', 'undead']),
  alignment: z.enum(['lawful good', 'neutral good', 'chaotic good', 'lawful neutral', 'true neutral', 'neutral', 'unaligned', 'chaotic neutral', 'lawful evil', 'neutral evil', 'chaotic evil']).describe('The alignment of the monster. Always fill in the alignment. If no alignment is given, the monster is true neutral.'),
  challengeRating: z.number().min(0).max(30),
  speed: speedSchema,
  savingThrows: savingThrowSchema.describe('Which saving throws the monster is proficient in.'),
  skills: skillsSchema,
  senses: sensesSchema,
  damageTakenModifiers: damagesBaseSchema.describe('The damage multipliers the monster has for each damage type.'),
  conditionImmunities: conditionImmunitiesSchema,
  languages: languagesSchema,
  traits: z.array(specialTraitsSchema),
  actions: actionSchema,
  // spellcasting: spellcastingSchema.optional().describe('Only used for creatures that can cast spells.'),
  legendary: legendarySchema.optional().describe('Only used for high level or boss creatures.'),
  reactions: z.array(genericActionSchema).optional().nullable().describe('Only used for creatures that can take a reaction. Do not describe legendary resistance.'),
});

export type monsterSchemaType = z.infer<typeof monsterSchema>;
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

export const skillToStat : Record<string, string> = {
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

export const challengeRatingToXP : Record<number, number> = {
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