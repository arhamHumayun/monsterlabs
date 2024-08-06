import { chunkedMonsterSchema, creatureSchema, creatureSchemaType } from "@/types/creature";
import OpenAI from "openai";
import { ChatCompletionTool } from "openai/resources/index.mjs";
import zodToJsonSchema from "zod-to-json-schema";

export const maxDuration = 60; // This function can run for a maximum of 5 seconds
const openai = new OpenAI();

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

const systemPrompt = `
Use your tools in order to generate creatures that the user requests.
The user provides a prompt that describes the creature they want to generate.
Pay close attention to the schema of your tools and strongly adhere to it.
Never include the units in the response, only the numbers.
Use all of the tools provided to generate the creature.
Use multiple tools at the same time to generate different parts of the creature.
Always use the generate_creature_base, and generate_creature_traits tools.
You should always use some of the other tools but choose the ones that are relevant to the creature.

Remember to keep in mind the following:
- First thing about what the overall theme of the creature is, and then think about what kind of abilities and stats it should have. Its abilities and stats should reflect its theme.
- The creature should have a multi-attack or a special attack that is unique to the creature if it's challenge rating is 3 or higher.
- The more powerful a creature is, the more attacks and abilities it should have.
- The creature should follow rules and guidelines for creature creation as described in the Dungeon Master's Guide and the Monster Manual for DnD 5e.
- Put AoE attacks such as breath attacks under saving throw attacks.
- Only put actions under special actions if they are not attacks.
- Never describe the action cost in a name of an action.
- Always generate some actions, and traits. If the creature has any special abilities, generate those as well.
- If the creature is legendary, generate legendary actions.
- If the creature has any reactions, generate those as well.
- If the creature has any spells, generate those as well.
`;

export async function POST(request: Request) {
  const body = request.json();

  const { prompt } = await body;

  const responseBody = await routeLogic(prompt, 0);

  return new Response(JSON.stringify(responseBody, null, 2), {
    headers: {
      "content-type": "application/json"
    }
  });
}

async function routeLogic(prompt: string, attempts: number = 0) {
  const tools: Array<ChatCompletionTool> = [
    {
      type: "function",
      function: {
          name: "generate_creature_base",
          description: "Generate a creature's base stats. When generating a creature, always include the base stats.",
          parameters: zodToJsonSchema(chunkedMonsterSchema.base)
      }
    },
    {
      type: "function",
      function: {
          name: "generate_creature_traits",
          description: "Generate a creature's traits if they have any.",
          parameters: zodToJsonSchema(chunkedMonsterSchema.traits)
      }
    },
    {
      type: "function",
      function: {
          name: "generate_creature_spells",
          description: "Generate a creature's spells if they can cast spells.",
          parameters: zodToJsonSchema(chunkedMonsterSchema.spellcasting)
      }
    },
    {
      type: "function",
      function: {
          name: "generate_creature_multiattack",
          description: "Generate a creature's multiattack string.",
          parameters: zodToJsonSchema(chunkedMonsterSchema.multiAttack)
      }
    },
    {
      type: "function",
      function: {
          name: "generate_creature_weapon_attacks",
          description: `
          Generate a creature's targeted weapon attacks if they have any.
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
          name: "generate_creature_saving_throw_attacks",
          description: `
            Generate a creature's saving throw attacks if they have any. 
            These are attacks that require a saving throw from the target.
            Use this function for breath weapons, gaze attacks, shout attacks, area of affect attacks and other similar attacks.
          `,
          parameters: zodToJsonSchema(chunkedMonsterSchema.savingThrowAttacks)
      }
    },
    {
      type: "function",
      function: {
          name: "generate_creature_special_actions",
          description: "Generate a creature's special actions if they have any. These are actions that are not standard attacks.",
          parameters: zodToJsonSchema(chunkedMonsterSchema.specialActions)
      }
    },
    {
      type: "function",
      function: {
          name: "generate_creature_legendary",
          description: "Generate a creature's legendary actions and information if they are legendary.",
          parameters: zodToJsonSchema(chunkedMonsterSchema.legendary)
      }
    },
    {
      type: "function",
      function: {
          name: "generate_creature_reactions",
          description: "Generate a creature's reactions if they have any.",
          parameters: zodToJsonSchema(chunkedMonsterSchema.reactions)
      }
    },
  ];

  const completion = await openai.chat.completions.create({
    messages: [
      { "role": "system", "content": systemPrompt},
      { "role": "user", "content": prompt }, 
    ],
    model: "gpt-3.5-turbo", // Options are gpt-3.5-turbo and gpt-4-turbo-preview
    tools,
    temperature: 0.5,
  });

  let creature : Partial<creatureSchemaType> = {
    pronoun: "it",
  }

  try {
    const allToolCalls = completion.choices[0].message.tool_calls!;

    allToolCalls.forEach((toolCall) => {
      const toolName = toolCall.function.name;
      let args = JSON.parse(toolCall.function.arguments);

      console.log("toolName: ", toolName);
      console.log("args: ", args);

      switch (toolName) {
        case "generate_creature_base":
          creature = { ...creature, ...args};
          break;
        case "generate_creature_traits":
          creature.traits = args.traits
          break;
        case "generate_creature_spells":
          creature.spellcasting = args
          break;
        case "generate_creature_multiattack":
          creature.actions!.multiAttack = args.multiAttack;
          break;
        case "generate_creature_weapon_attacks":
          creature.actions!.targetedWeaponAttacks = args.targetedWeaponAttacks
          break;
        case "generate_creature_saving_throw_attacks":
          creature.actions!.savingThrowAttacks = args.savingThrowAttacks
          break;
        case "generate_creature_special_actions":
          creature.actions!.specialActions = args.specialActions
          break;
        case "generate_creature_legendary":
          creature.legendary = args.legendary;
          break;
        case "generate_creature_reactions":
          creature.reactions = args.reactions
          break;
      }
    });

    let parsedMonster = creatureSchema.parse(creature);
    return parsedMonster

  } catch (error) {
    console.error(error);
    if (attempts < 0) {
      return routeLogic(prompt, attempts + 1);
    } else {
      return {
        error: "We were unable to generate a creature. Please try again."
      }
    }
  }
}