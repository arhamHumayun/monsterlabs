import { chunkedMonsterParts, chunkedMonsterSchema, } from "@/types/creature";
import OpenAI from "openai";
import zodToJsonSchema from "zod-to-json-schema";

const openai = new OpenAI();

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'edge';

const systemPrompt = `
You use the generate_creature function in order to generate creatures that the user requests.
The user provides a prompt that describes the creature they want to generate.
Pay close attention to the schema and strongly adhere to it.
Never include the units in the response, only the numbers.
`;

interface ToolDefinition {
  name: string;
  description: string;
  parameters: any;
}

const creatureGenFunctions: Record<chunkedMonsterParts, ToolDefinition> = {
  base: {
    name: "generate_creature_base",
    description: "Generate a creature's base stats.",
    parameters: zodToJsonSchema(chunkedMonsterSchema.base)
  },
  info: {
    name: "generate_creature_info",
    description: "Generate a creature's info.",
    parameters: zodToJsonSchema(chunkedMonsterSchema.info)
  },
  actions: {
    name: "generate_creature_actions",
    description: "Generate the creature's actions. Always include some actions, never leave this empty.",
    parameters: zodToJsonSchema(chunkedMonsterSchema.actions)
  },
  legendary: {
    name: "generate_creature_legendary_actions",
    description: "Generate the creature's legendary actions.",
    parameters: zodToJsonSchema(chunkedMonsterSchema.legendary)
  },
  reactions: {
    name: "generate_creature_reactions",
    description: "Generate the creature's reactions.",
    parameters: zodToJsonSchema(chunkedMonsterSchema.reactions)
  }
}

// first generate base, then info, then actions

export async function POST(request: Request) {

  const body = request.json();

  const { prompt } = await body;

  console.log("Received prompt: ", prompt);
  const baseJson = await routeLogicGPT(prompt, 0, 'base');
  const infoJson = await routeLogicGPT(prompt, 0, 'info');
  const actionsJson = await routeLogicGPT(prompt, 0, 'actions', { ...baseJson, ...infoJson });

  const responseBody = {
    ...baseJson,
    ...infoJson,
    actions: actionsJson
  }
  
  console.log("Generated creature: ", responseBody);

  return new Response(JSON.stringify(responseBody, null, 2), {
    headers: {
      "content-type": "application/json"
    }
  });
}

async function routeLogicGPT(prompt: string, attempts: number = 0, gen: chunkedMonsterParts, extraInfo?: any) {

  const completion = await openai.chat.completions.create({
    messages: [
      { "role": "system", "content": systemPrompt },
      { "role": "system", "content": `This is the creature you are making actions for, make sure you don't use the same name for actions that are already used: ${extraInfo}` },
      { "role": "user", "content": prompt },
    ],
    model: "gpt-3.5-turbo", // Options are gpt-3.5-turbo and gpt-4-turbo-preview
    functions: [creatureGenFunctions[gen]],
    temperature: 0.2,
    function_call: {
      name: creatureGenFunctions[gen].name,
    }
  });

  try {
    console.log("attempt at parsing: ", attempts);

    const baseResponse = JSON.parse(completion.choices[0].message.function_call?.arguments!);

    console.log("got creature response: ", baseResponse);

    let parsedMonster = chunkedMonsterSchema[gen].parse(baseResponse);

    console.log("successfully parsed creature: ", parsedMonster);

    return parsedMonster
  } catch (error) {
    console.error(error);

    if (attempts < 3) {
      return routeLogicGPT(prompt, attempts + 1, gen, extraInfo);
    } else {
      return {
        error: "We were unable to generate a creature. Please try again."
      }
    }
  }
}
