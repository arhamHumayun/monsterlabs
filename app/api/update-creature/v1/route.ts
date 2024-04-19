import { chunkedMonsterSchema, creatureSchema, creatureSchemaType } from "@/types/creature";
import OpenAI from "openai";
import { ChatCompletionTool } from "openai/resources/index.mjs";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const openai = new OpenAI();

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'edge';

const systemPrompt = `
You use the update_creature function in order to update creatures that the user requests.
The user provides a prompt that describes the creature they want to update.
Do not remove any existing information unless the user explicitly asks for it.
If you are overwriting a list of items, make sure to keep the old items if they are not replaced or asked to be removed.`;

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
          name: "generate_creature_base",
          description: "Generate a creature's base stats. When generating a creature, always include the base stats.",
          parameters: zodToJsonSchema(chunkedMonsterSchema.base)
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
          name: "generate_creature_actions",
          description: "Generate a creature's actions. When generating a creature, always include some actions.",
          parameters: zodToJsonSchema(chunkedMonsterSchema.actions)
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
    }
  ];

  const completion = await openai.chat.completions.create({
    messages: [
      { "role": "system", "content": systemPrompt},
      { "role": "system", "content": "This is the current creature: " + JSON.stringify(creature)},
      { "role": "user", "content": prompt }, 
    ],
    model: "gpt-3.5-turbo", // Options are gpt-3.5-turbo and gpt-4-turbo-preview
    tools,
    temperature: 0.3,
  });

  try {
    const allToolCalls = completion.choices[0].message.tool_calls!;

    allToolCalls.forEach((toolCall) => {
      const toolName = toolCall.function.name;
      let args = JSON.parse(toolCall.function.arguments);

      console.log("Tool name: ", toolName);
      console.log("Creature: ", creature);
      console.log("Args: ", args);

      switch (toolName) {
        case "generate_creature_base":
          creature = { ...creature, ...args};
          break;
        case "generate_creature_spells":
          creature.spellcasting = args;
          break;
        case "generate_creature_actions":
          creature.actions = args;
          break;
        case "generate_creature_legendary":
          creature.legendary = args;
          break;
        case "generate_creature_reactions":
          creature.reactions = args.reactions;
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