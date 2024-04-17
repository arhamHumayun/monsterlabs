import { creatureSchema, creatureSchemaType } from "@/types/creature";
import OpenAI from "openai";
import zodToJsonSchema from "zod-to-json-schema";

const openai = new OpenAI();

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'edge';

const systemPrompt = `
You use the update_creature function in order to update creatures that the user requests.
The user provides a prompt that describes the creature they want to update.
Rewrite the creature with the changes the user asks for. Always fill in required fields in the schema.
Ensure you remove duplicate actions and actions that asked to be removed.
If there are multiple actions with the same name, remove the old one.
Keep everything else the same.
`;

const creatureSchemaUpdate =  creatureSchema;

export async function POST(request: Request) {

  const body = request.json();

  const { prompt, creature } = await body;

  console.log("Received prompt: ", prompt);
  console.log("Received creature: ", creature);

  const responseBody = await routeLogic(prompt, creature, 0);

  return new Response(JSON.stringify(responseBody, null, 2), {
    headers: {
      "content-type": "application/json"
    }
  });
}

async function routeLogic(prompt: string, creature: creatureSchemaType, attempts: number = 0) {
  const tools = [
    {
      name: "update_creature",
      description: "Generate a creature with parameters that adhere to this schema that matches the updates the user asks for. Always fill in required fields in the schema.",
      parameters: zodToJsonSchema(creatureSchemaUpdate)
    }
  ];

  const completion = await openai.chat.completions.create({
    messages: [
      { "role": "system", "content": systemPrompt},
      { "role": "system", "content": "This is the current creature: " + JSON.stringify(creature)},
      { "role": "user", "content": prompt }, 
    ],
    model: "gpt-3.5-turbo", // Options are gpt-3.5-turbo and gpt-4-turbo-preview
    functions: tools,
    temperature: 0.3,
    function_call: {
      name: "update_creature",
    }
  });

  try {
    console.log("attempt at parsing: ", attempts);
    let parsedCreature = creatureSchemaUpdate.parse(JSON.parse(completion.choices[0].message.function_call?.arguments!));

    console.log("successfully parsed creature: ", parsedCreature);

    return parsedCreature
  } catch (error) {
    console.error(error);
    if (attempts < 3) {
      return routeLogic(prompt, creature, attempts + 1);
    } else {
      return {
        error: "We were unable to generate a creature. Please try again."
      }
    }
  }
}