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
  blindsight: sensesNumSchema.optional().describe('The range of the monsters ability to see without relying on sight. 0 if the monster does not have blindsight.'),
  darkvision: sensesNumSchema.optional().describe('The range of the monsters ability to see in the dark. 0 if the monster does not have darkvision.'),
  tremorsense: sensesNumSchema.optional().describe('The range of the monsters ability to sense vibrations in the ground. 0 if the monster does not have tremorsense.'),
  truesight: sensesNumSchema.optional().describe('The range of the monsters ability to see in normal and magical darkness, see illusions and invisible objects. The strongest and truest sense that exists. 0 if the monster does not have truesight.'),
});

const damageTypeSchema = z.enum(['acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder']);

export type damageMultiplierLiteral = 'normal' | 'resistance' | 'immunity' | 'vulnerability';
const damageMultiplierSchema = z.enum(['normal', 'resistance', 'immunity', 'vulnerability']).describe('Normal means normal damage, resistance means half damage, immunity means no damage, and vulnerability means double damage.');

const damagesBaseSchema = z.object({
  nonMagicalBludgeoning: damageMultiplierSchema,
  nonMagicalSlashing: damageMultiplierSchema,
  nonMagicalPiercing: damageMultiplierSchema,
  magicalBludgeoning: damageMultiplierSchema,
  magicalSlashing: damageMultiplierSchema,
  magicalPiercing: damageMultiplierSchema,
  acid: damageMultiplierSchema,
  cold: damageMultiplierSchema,
  fire: damageMultiplierSchema,
  force: damageMultiplierSchema,
  lightning: damageMultiplierSchema,
  necrotic: damageMultiplierSchema,
  poison: damageMultiplierSchema,
  psychic: damageMultiplierSchema,
  radiant: damageMultiplierSchema,
  thunder: damageMultiplierSchema
});

export enum conditionSchemaEnum {
  blinded = 'blinded',
  charmed = 'charmed',
  deafened = 'deafened',
  frightened = 'frightened',
  grappled = 'grappled',
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
const conditionsSchema = z.enum(['blinded', 'charmed', 'deafened', 'frightened', 'grappled', 'incapacitated', 'invisible', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'stunned', 'unconscious']);

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
});

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
      attackStat: singleStatSchema.optional().describe('The stat bonus the monster uses for the attack, only used if the attack is a weapon attack. If the attack is a spell attack use the spellcasting stat bonus.'),
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
    }).optional(),
  }).optional(),
  conditions: z.array(z.object({
    name: conditionsSchema.describe('The condition the target will be affected by.'),
    save: singleStatSchema.optional().describe('The stat the target must save against.'),
    description: z.string().describe('Details about the condition and what it does to the target. Include information about how the target can end the condition if it can.'),
  })).optional().describe('The conditions the target will be affected by from the attack. Think of the condition before the description'),
});

const spellSaveAttackSchema = z.object({
  name: z.string(),
  recharge: z.number().min(0).max(6).optional().describe('The number of turns before the attack can be used again. Leave out or 0 if the attack can be used every turn.'),
  attackStat: singleStatSchema.describe('The stat the monster uses for the attack. Should be the same as the spellcasting stat.'),
  saveStat: singleStatSchema.describe('The stat the target must save against.'),
  ranges: z.object({
    melee: z.number().min(5).max(30).optional().describe('The reach of the attack if it is a melee spell attack.'),
    ranged: z.number().min(10).optional().describe('The normal range of the attack if it is a ranged spell attack.'),
    targetCount : z.number().min(1).describe('The number of targets the spell can affect.'),
  }),
  hit: attackHitSchema,
});

const targetedAttackSchema = z.object({
  name: z.string(),
  recharge: z.number().min(0).max(6).optional().describe('The number of turns before the attack can be used again. Leave out or 0 if the attack can be used every turn.'),
  attackType: z.enum(['spell', 'weapon']).describe('The type of attack. Default to weapon unless the attack is a spell.'),
  targetType: z.enum(['creature', 'target']).describe('The type of target. Default to target unless the attack depends on targeting a living creature.'),
  ranges: z.object({
    melee: z.number().min(5).max(30).optional().describe('The reach of the attack if it is a melee attack.'),
    ranged: z.number().min(10).optional().describe('The normal range of the attack if it is a ranged attack.'),
  }),
  hit: attackHitSchema
});

const areaOfEffectAttackSchema = z.object({
  name: z.string(),
  description: z.string(),
  recharge: z.number().min(0).max(6).optional(),
  savingThrow: z.object({
    save: singleStatSchema.describe('The stat the target must save against.'),
    attack: singleStatSchema.describe('The stat the monster must attack with.'),
  }),
  ranges: z.object({
    startingPointDistance: z.number().min(0).describe('The range of the attack from the monster.'),
    areaSize: z.number().min(0).describe('The size of the area of effect attack. In feet.'),
    areaShape: z.enum(['cone', 'cube', 'cylinder', 'line', 'sphere'])
  }),
  fail: attackHitSchema,
  pass: z.enum(['none', 'half']).optional().describe('The damage the target takes if they pass the saving throw.'),
});

const genericActionSchema = z.object({
  name: z.string(),
  description: z.string()
}).describe('A special or generic action the monster can take that is not a weapon or spell attack, area of effect attack or spell save attack. Only used for monsters that have special abilities or actions that are not attacks as defined by the other attack types.');

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
  deepSpeech: z.boolean().optional(),
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
  resistance: z.number().min(0).optional(),
  traits: z.array(specialTraitsSchema).optional(),
  actions: z.object({
    name: z.string(),
    description: z.string(),
    cost: z.number().min(1),
  }),
});

export const monsterSchema = z.object({
  name: z.string(),
  description: z.string().describe('A description of the monster. This can be used to give the monster a backstory or to describe its appearance.'),
  stats: statSchema.describe('The stats of the monster'),
  hitDiceAmount: z.number().min(1).describe('The number of hit dice given to the monster. The actual max health is based off of this amount'), // Total health determined by size, constitution, and hitDiceAmount
  armorClass: armorClassSchema,
  size: z.enum(['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan']),
  type: z.enum(['aberration', 'beast', 'celestial', 'construct', 'dragon', 'elemental', 'fey', 'fiend', 'giant', 'humanoid', 'monstrosity', 'ooze', 'plant', 'undead']),
  alignment: z.enum(['lawful good', 'neutral good', 'chaotic good', 'lawful neutral', 'true neutral', 'chaotic neutral', 'lawful evil', 'neutral evil', 'chaotic evil']),
  challengeRating: z.number().min(0).max(30).describe('The challenge rating of the monster. This represents the difficulty of the monster in combat and what level of players it is suitable for.'),
  speed: speedSchema,
  savingThrows: savingThrowSchema.describe('Which saving throws the monster is proficient in. Only pick the ones that make sense for the monster.'),
  skills: skillsSchema.describe('Which skills the monster is proficient in. Only pick the ones that make sense for the monster.'),
  senses: sensesSchema.describe('The senses the monster has and their range. 0 if the monster does not have the sense. Only pick the ones that make sense for the monster.'),
  damageTakenModifiers: damagesBaseSchema.describe('The damage multipliers the monster has for each damage type.'),
  conditionImmunities: conditionImmunitiesSchema,
  languages: languagesSchema.describe('The languages the monster can speak and understand. Only pick the ones that make sense for the monster.'),
  traits: z.array(specialTraitsSchema),
  actions: z.object({
    targetedWeaponAttacks: z.array(targetedAttackSchema).optional().describe('The targeted attacks the monster can take. Only used for monsters that can make weapon or natural attacks. This attack requires an attack roll.'),
    targetedSpellAttacks: z.array(spellSaveAttackSchema).optional().describe('The spell save attacks the monster can take. Only used for spellcasting monsters. This attack does not require an attack roll, the target must save against the attack.'),
    areaOfEffectAttacks: z.array(areaOfEffectAttackSchema).optional().describe('The area of effect attacks the monster can take. Only used for monsters that can make area of effect attacks such as breath weapons or spells. This attack requires a saving throw from the target.'),
    specialActions: z.array(genericActionSchema).optional().describe('The special actions the monster can take. Only used for monsters that have special abilities or actions that are not attacks.'),
  }),
  // legendary: legendarySchema.optional().describe('The legendary actions the monster can take. Only used for high level or boss monsters.'),
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
