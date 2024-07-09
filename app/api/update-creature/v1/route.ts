import { chunkedMonsterSchema, creatureSchema, creatureSchemaType } from "@/types/creature";
import OpenAI from "openai";
import { ChatCompletionTool } from "openai/resources/index.mjs";
import zodToJsonSchema from "zod-to-json-schema";

const openai = new OpenAI();

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

const systemPrompt = `
You use the update_creature function in order to update creatures that the user requests.
The user provides a prompt that describes the creature they want to update.
Do not remove any existing information unless the user explicitly asks for it.
If you are overwriting a list of items, make sure to keep the old items if they are not replaced or asked to be removed.
Pay close attention to the schema and strongly adhere to it.
Don't stick to only keeping the same information, but also add new information if it is requested such as new attack types.
If the user asks for a new attack, make sure to choose the proper attack type from the attack schema.
`;

export async function POST(request: Request) {
  const body = request.json();

  const { prompt, creature } = await body;

  const responseBody = await routeLogic(prompt, creature, 0);

  return new Response(JSON.stringify(responseBody, null, 2), {
    headers: {
      "content-type": "application/json"
    }
  });
}

async function routeLogic(prompt: string, creature: creatureSchemaType, attempts: number = 0) {
  const tools: Array<ChatCompletionTool> = [
    {
      type: "function",
      function: {
        name: "regenerate_creature_base",
        description: "Regenerate a creature's base stats. When generating a creature, always include the base stats.",
        parameters: zodToJsonSchema(chunkedMonsterSchema.base)
      }
    },
    {
      type: "function",
      function: {
        name: "regenerate_creature_traits",
        description: "Regenerate a creature's traits if they have any.",
        parameters: zodToJsonSchema(chunkedMonsterSchema.traits)
      }
    },
    {
      type: "function",
      function: {
        name: "regenerate_creature_spells",
        description: "Regenerate a creature's spells if they can cast spells.",
        parameters: zodToJsonSchema(chunkedMonsterSchema.spellcasting)
      }
    },
    {
      type: "function",
      function: {
        name: "regenerate_creature_multiattack",
        description: "Regenerate a creature's multiattack string.",
        parameters: zodToJsonSchema(chunkedMonsterSchema.multiAttack)
      }
    },
    {
      type: "function",
      function: {
        name: "regenerate_creature_weapon_attacks",
        description: `
          Regenerate a creature's targeted weapon attacks if they have any.
          Use this function for melee and ranged weapon or spell attacks.
          When calling this function make sure to account for the attacks the creature already has.
          Include the previous attacks in the function call, unless the user explicitly asks to remove or replace them.
          `,
        parameters: zodToJsonSchema(chunkedMonsterSchema.targetedWeaponAttacks)
      }
    },
    {
      type: "function",
      function: {
        name: "regenerate_creature_saving_throw_attacks",
        description: `
            Regenerate a creature's saving throw attacks if they have any. 
            These are attacks that require a saving throw from the target.
            Use this function for breath weapons, gaze attacks, shout attacks, area of affect attacks and other similar attacks.
          `,
        parameters: zodToJsonSchema(chunkedMonsterSchema.savingThrowAttacks)
      }
    },
    {
      type: "function",
      function: {
        name: "regenerate_creature_special_actions",
        description: "Regenerate a creature's special actions if they have any. These are actions that are not standard attacks.",
        parameters: zodToJsonSchema(chunkedMonsterSchema.specialActions)
      }
    },
    {
      type: "function",
      function: {
        name: "regenerate_creature_legendary",
        description: "Regenerate a creature's legendary actions and information if they are legendary.",
        parameters: zodToJsonSchema(chunkedMonsterSchema.legendary)
      }
    },
    {
      type: "function",
      function: {
        name: "regenerate_creature_reactions",
        description: "Regenerate a creature's reactions if they have any.",
        parameters: zodToJsonSchema(chunkedMonsterSchema.reactions)
      }
    },
  ];

  const completion = await openai.chat.completions.create({
    messages: [
      { "role": "system", "content": systemPrompt },
      { "role": "system", "content": "This is the current creature: " + JSON.stringify(creature) },
      { "role": "user", "content": prompt },
    ],
    model: "gpt-3.5-turbo", // Options are gpt-3.5-turbo and gpt-4o
    tools,
    temperature: 0.5,
  });

  try {
    const allToolCalls = completion.choices[0].message.tool_calls!;

    allToolCalls.forEach((toolCall) => {
      const toolName = toolCall.function.name;
      let args = JSON.parse(toolCall.function.arguments);

      switch (toolName) {
        case "regenerate_creature_base":
          creature = { ...creature, ...args };
          break;
        case "regenerate_creature_traits":
          creature.traits = args.traits;
          break;
        case "regenerate_creature_spells":
          creature.spellcasting = args
          break;
        case "regenerate_creature_multiattack":
          creature.actions!.multiAttack = args.multiAttack;
          break;
        case "regenerate_creature_weapon_attacks":
          if (!creature.actions) {
            creature.actions = {}
          }
          if (!creature.actions.targetedWeaponAttacks) {
            creature.actions.targetedWeaponAttacks = []
          }
          creature.actions.targetedWeaponAttacks = args.targetedWeaponAttacks;
          break;
        case "regenerate_creature_saving_throw_attacks":
          if (!creature.actions) {
            creature.actions = {}
          }
          if (!creature.actions.savingThrowAttacks) {
            creature.actions.savingThrowAttacks = []
          }
          creature.actions.savingThrowAttacks = args.savingThrowAttacks
          break;
        case "regenerate_creature_special_actions":
          if (!creature.actions) {
            creature.actions = {}
          }

          if (!creature.actions.specialActions) {
            creature.actions.specialActions = []
          }
          creature.actions.specialActions = args.specialActions
          break;
        case "regenerate_creature_legendary":
          creature.legendary = args.legendary;
          break;
        case "regenerate_creature_reactions":
          creature.reactions = args.reactions
          break;
      }
    });

    if (!creature.pronoun) {
      creature.pronoun = "it";
    }

    let parsedMonster = creatureSchema.parse(creature);
    return parsedMonster

  } catch (error) {
    console.error(error);
    if (attempts < 0) {
      return routeLogic(prompt, creature, attempts + 1);
    } else {
      return {
        error: "We were unable to generate a creature. Please try again."
      }
    }
  }
}