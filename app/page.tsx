import LandingPage from "@/components/landing-page";
import MonsterBlock from "@/components/monster-block";
import { monsterSchema, monsterSchemaType } from "@/types/monster";

const tempData : monsterSchemaType = {
  name: "Dwarf King's Guard",
  isUnique: true,
  lore: "The elite protectors of the Dwarf King, sworn to defend the royal family and the kingdom with unwavering loyalty and unmatched skill.",
  appearance: "Clad in intricately crafted armor adorned with the royal crest, the Dwarf King's Guard stand tall and proud, wielding mighty warhammers and shields.",
  stats: {
    strength: 18,
    dexterity: 12,
    constitution: 16,
    intelligence: 10,
    wisdom: 14,
    charisma: 10
  },
  hitDiceAmount: 8,
  armorClass: {
    base: 18,
    type: "armor",
    hasShield: true
  },
  size: "medium",
  type: "humanoid",
  alignment: "lawful good",
  challengeRating: 5,
  speed: {
    walk: 30
  },
  savingThrows: {
    strength: true,
    constitution: true
  },
  skills: {
    athletics: true,
    perception: true
  },
  senses: {
    darkvision: 60
  },
  damageTakenModifiers: {
    nonMagicalBludgeoning: "resistance",
    nonMagicalSlashing: "resistance",
    nonMagicalPiercing: "resistance"
  },
  conditionImmunities: {
    charmed: false,
    frightened: false
  },
  languages: {
    common: true,
    dwarvish: true
  },
  traits: [
    {
      name: "Dwarven Resilience",
      description: "The Dwarf King's Guard has advantage on saving throws against poison and resistance against poison damage."
    },
    {
      name: "Royal Protector",
      description: "The Guard can use its reaction to impose disadvantage on an attack against a creature within 5 feet of it."
    }
  ],
  actions: {
    multiAttack: "The Dwarf King's Guard makes two warhammer attacks.",
    targetedWeaponAttacks: [
      {
        name: "Warhammer",
        attackType: "weapon",
        targetCount: 1,
        attackStat: "strength",
        targetType: "creature",
        range: {
          melee: 5
        },
        hit: {
          damage: {
            primary: {
              damageDice: {
                count: 1,
                sides: 8
              },
              damageType: "bludgeoning"
            }
          }
        }
      },
      {
        name: "Shield Bash",
        attackType: "weapon",
        targetCount: 1,
        attackStat: "strength",
        targetType: "creature",
        range: {
          melee: 5
        },
        hit: {
          damage: {
            primary: {
              damageDice: {
                count: 1,
                sides: 6
              },
              damageType: "bludgeoning"
            }
          },
          affect: "The target must succeed on a DC 14 Strength saving throw or be knocked prone."
        }
      },
      {
        name: "Dwarven Battle Cry",
        attackType: "innate",
        targetCount: 5,
        attackStat: "charisma",
        targetType: "target",
        range: {
          ranged: 30
        },
        hit: {
          damage: {
            primary: {
              damageDice: {
                count: 2,
                sides: 6
              },
              damageType: "thunder"
            }
          },
          affect: "Each target must succeed on a DC 14 Constitution saving throw or be deafened for 1 minute."
        }
      }
    ]
  },
  reactions: [
    {
      name: "Shield Block",
      description: "When a creature the Guard can see attacks a target other than the Guard that is within 5 feet of it, the Guard can use its reaction to impose disadvantage on the attack roll."
    }
  ]
}

export default function Home() {

  const actualData = monsterSchema.parse(tempData);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-stretch pb-28 px-4 sm:px-6">
      <LandingPage/>
      <MonsterBlock {...actualData}/>
    </main>
  );
}
