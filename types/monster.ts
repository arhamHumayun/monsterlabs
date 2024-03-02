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

const damageMultiplierSchema = z.enum(['normal', 'resistance', 'immunity', 'vulnerability'])

const damagesBaseSchema = z.object({
  nonMagical: z.object({
    bludgeoning: damageMultiplierSchema,
    slashing: damageMultiplierSchema,
    piercing: damageMultiplierSchema,
  }).describe("Basic non-magical physical damage type. Give the monster a resistance or immunity to this if they are high level or very magical."),
  magical: z.object({
    bludgeoning: damageMultiplierSchema,
    slashing: damageMultiplierSchema,
    piercing: damageMultiplierSchema,
  }).describe("Magical physical damage types. Only give the monster resistance to this if their physical form directly resists this type of damage."),
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
});

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

const targetedAttackSchema = z.object({
  name: z.string(),
  recharge: z.number().min(0).max(6).optional().describe('The number of turns before the attack can be used again. Leave out or 0 if the attack can be used every turn.'),
  attackType: z.enum(['spell', 'weapon']).describe('The type of attack. Default to weapon unless the attack is a spell.'),
  targetType: z.enum(['creature', 'target']).describe('The type of target. Default to target unless the attack depends on target a living creature.'),
  ranges: z.object({
    melee: z.number().min(0).max(30).optional().describe('The reach of the attack if it is a melee attack.'),
    ranged: z.number().min(0).optional().describe('The normal range of the attack if it is a ranged attack.'),
  }),
  hit: z.array(z.object({
    statBonus: singleStatSchema.optional(),
    damageDice: diceSchema,
    alternateDamageDice: z.object({
      condition: z.enum(['critical', 'advantage', 'two-handed']).describe('The condition that triggers the alternate damage dice'),
      damageDice: diceSchema,
    }).optional(),
    damageType: damageTypeSchema,
  }))
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
  fail: z.array(z.object({
    statBonus: singleStatSchema.optional(),
    damageDice: diceSchema,
    damageType: damageTypeSchema,
  })).describe('The damage the target takes if they fail the saving throw.'),
  pass: z.enum(['none', 'half']).describe('The damage the target takes if they pass the saving throw.'),
});

const actionSchema = z.object({
  name: z.string(),
  description: z.string()
}).describe('A special or generic action the monster can take that is not an attack.');

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
  alignment: z.enum(['lawful good', 'neutral good', 'chaotic good', 'lawful neutral', 'neutral', 'chaotic neutral', 'lawful evil', 'neutral evil', 'chaotic evil']),
  challengeRating: z.number().min(0).max(30).describe('The challenge rating of the monster. This represents the difficulty of the monster in combat and what level of players it is suitable for.'),
  speed: speedSchema,
  savingThrows: savingThrowSchema.describe('Which saving throws the monster is proficient in. Only pick the ones that make sense for the monster.'),
  skills: skillsSchema.describe('Which skills the monster is proficient in. Only pick the ones that make sense for the monster.'),
  senses: sensesSchema.describe('The senses the monster has and their range. 0 if the monster does not have the sense. Only pick the ones that make sense for the monster.'),
  damageTakenModifiers: damagesBaseSchema.describe('The damage multipliers the monster has for each damage type. If the monster is themed around a damage type it should have resistance or immunity to it. If the monster is weak to a damage type it should have vulnerability to it. If the monster is resistant to a damage type it should have resistance to it. If the monster is immune to a damage type it should have immunity to it. If the monster is not affected by a damage type it should have normal damage to it. Only pick the ones that make sense for the monster.'),
  conditionImmunities: conditionImmunitiesSchema.describe('The conditions the monster is immune to. Only pick the ones that make sense for the monster.'),
  languages: languagesSchema.describe('The languages the monster can speak and understand. Only pick the ones that make sense for the monster.'),
  traits: z.array(specialTraitsSchema),
  actions: z.object({
    targetedAttacks: z.array(targetedAttackSchema).optional(),
    areaOfEffectAttacks: z.array(areaOfEffectAttackSchema).optional(),
    specialActions: z.array(actionSchema).optional(),
  }),
  // legendary: legendarySchema.optional().describe('The legendary actions the monster can take. Only used for high level or boss monsters.'),
});
