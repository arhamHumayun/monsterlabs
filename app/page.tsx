import LandingPage from "@/components/landing-page";
import MonsterBlock from "@/components/monster-block";
import { monsterSchemaType } from "@/types/monster";

const tempData : monsterSchemaType = {
  name: "Vampire Dragon",
  description: "A terrifying creature that combines the cunning and power of a dragon with the dark and supernatural abilities of a vampire. Its scales shimmer with an eerie crimson hue, and its eyes glow with an unholy light.",
  stats: {
    strength: 25,
    dexterity: 14,
    constitution: 22,
    intelligence: 20,
    wisdom: 18,
    charisma: 18
  },
  hitDiceAmount: 18,
  armorClass: {
    base: 19,
    type: "natural"
  },
  size: "huge",
  type: "dragon",
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
    tremorsense: 0,
    truesight: 60
  },
  damageTakenModifiers: {
    nonMagicalBludgeoning: "resistance",
    nonMagicalSlashing: "resistance",
    nonMagicalPiercing: "resistance",
    magicalBludgeoning: "normal",
    magicalSlashing: "normal",
    magicalPiercing: "normal",
    acid: "normal",
    cold: "normal",
    fire: "normal",
    force: "normal",
    lightning: "normal",
    necrotic: "resistance",
    poison: "immunity",
    psychic: "normal",
    radiant: "normal",
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
      name: "Legendary Resistance (3/day)",
      description: "If the vampire dragon fails a saving throw, it can choose to succeed instead."
    },
    {
      name: "Misty Escape",
      description: "When it drops to 0 hit points, the vampire dragon can turn into mist and move up to 60 feet without provoking opportunity attacks. It reverts to its true form if it takes radiant damage."
    },
    {
      name: "Vampire Weaknesses",
      description: "The vampire dragon has the vampire weaknesses of sunlight hypersensitivity, running water, and the need to be invited into a residence."
    }
  ],
  actions: {
    targetedWeaponAttacks: [
      {
        name: "Bite",
        attackType: "weapon",
        targetType: "creature",
        ranges: {
          melee: 10
        },
        hit: {
          damage: {
            primary: {
              attackStat: "strength",
              damageDice: {
                count: 2,
                sides: 10
              },
              damageType: "piercing"
            }
          },
          conditions: [
            {
              name: "charmed",
              description: "The target must succeed on a DC 18 Wisdom saving throw or be charmed by the vampire dragon."
            }
          ]
        }
      },
      {
        name: "Claw",
        attackType: "weapon",
        targetType: "creature",
        ranges: {
          melee: 5
        },
        hit: {
          damage: {
            primary: {
              attackStat: "strength",
              damageDice: {
                count: 2,
                sides: 6
              },
              damageType: "slashing"
            }
          }
        }
      }
    ],
    specialActions: [
      {
        name: "Blood Drain",
        description: "The vampire dragon targets one creature it can see within 5 feet of it that has blood and is incapacitated. The target must make a DC 18 Constitution saving throw against this magic. On a failed save, the target takes 14 (4d6) necrotic damage, and the vampire dragon regains hit points equal to the necrotic damage dealt."
      },
      {
        name: "Charm",
        description: "The vampire dragon targets one humanoid it can see within 30 feet of it. If the target can see the vampire dragon, the target must succeed on a DC 18 Wisdom saving throw against this magic or be charmed by the vampire dragon. The charmed target regards the vampire dragon as a trusted friend to be heeded and protected. Although the target isn't under the vampire dragon's control, it takes the vampire dragon's requests or actions in the most favorable way it can."
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
