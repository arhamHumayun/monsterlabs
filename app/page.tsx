import LandingPage from "@/components/landing-page";
import MonsterBlock from "@/components/monster-block";
import { monsterSchemaType } from "@/types/monster";

const tempData : monsterSchemaType = {
  name: "Vampire Dragon",
  lore: "A fearsome creature born from the unholy union of a vampire and a dragon, possessing the deadly powers of both",
  appearance: "A massive dragon with dark, leathery wings and blood-red scales, its eyes glowing with a sinister crimson light",
  stats: {
    strength: 22,
    dexterity: 14,
    constitution: 20,
    intelligence: 16,
    wisdom: 18,
    charisma: 20
  },
  hitDiceAmount: 18,
  armorClass: {
    base: 18,
    type: "natural"
  },
  size: "huge",
  type: "undead",
  alignment: "chaotic evil",
  challengeRating: 15,
  speed: {
    walk: 40,
    fly: 80
  },
  savingThrows: {
    dexterity: true,
    constitution: true,
    wisdom: true,
    charisma: true
  },
  skills: {
    perception: true,
    stealth: true
  },
  senses: {
    blindsight: 60,
    darkvision: 120,
    truesight: 60
  },
  damageTakenModifiers: {
    nonMagicalBludgeoning: "resistance",
    nonMagicalPiercing: "resistance",
    nonMagicalSlashing: "resistance",
    magicalBludgeoning: "resistance",
    magicalSlashing: "resistance",
    magicalPiercing: "resistance",
    acid: "normal",
    cold: "normal",
    fire: "normal",
    force: "normal",
    lightning: "normal",
    necrotic: "immunity",
    poison: "immunity",
    psychic: "normal",
    radiant: "vulnerability",
    thunder: "normal"
  },
  conditionImmunities: {
    charmed: true,
    frightened: true,
    paralyzed: true,
    poisoned: true
  },
  languages: {
    draconic: true,
    common: true
  },
  traits: [
    {
      name: "Legendary Resistance",
      description: "If the vampire dragon fails a saving throw, it can choose to succeed instead three times per day."
    },
    {
      name: "Misty Escape",
      description: "When the vampire dragon drops to 0 hit points, it can transform into a cloud of mist instead of falling unconscious. It can move up to its speed without provoking opportunity attacks and reverts to its true form when it takes any action."
    },
    {
      name: "Regeneration",
      description: "The vampire dragon regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water."
    }
  ],
  actions: {
    targetedWeaponAttacks: [
      {
        name: "Bite",
        targetCount: 1,
        attackStat: "strength",
        targetType: "creature",
        ranges: {
          melee: 10
        },
        hit: {
          damage: {
            primary: {
              damageDice: {
                count: 2,
                sides: 10
              },
              damageType: "piercing",
              damageStat: "strength"
            }
          },
          affect: "The target must succeed on a DC 18 Constitution saving throw or be paralyzed for 1 minute."
        }
      },
      {
        name: "Claw",
        targetCount: 1,
        attackStat: "strength",
        targetType: "creature",
        ranges: {
          melee: 5
        },
        hit: {
          damage: {
            primary: {
              damageDice: {
                count: 2,
                sides: 8
              },
              damageType: "slashing",
              damageStat: "strength"
            }
          }
        }
      }
    ],
    specialActions: [
      {
        name: "Vampiric Drain",
        description: "The vampire dragon targets one creature it can see within 30 feet of it. The target must succeed on a DC 18 Constitution saving throw or take 21 (6d6) necrotic damage and the vampire dragon regains hit points equal to the damage dealt."
      },
      {
        name: "Shadow Breath",
        description: "The vampire dragon exhales a blast of shadows in a 60-foot cone. Each creature in that area must make a DC 18 Dexterity saving throw, taking 45 (10d8) necrotic damage on a failed save, or half as much damage on a successful one."
      }
    ]
  }
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-stretch pb-28 px-4 sm:px-6">
      <LandingPage/>
      <MonsterBlock {...tempData}/>
    </main>
  );
}
