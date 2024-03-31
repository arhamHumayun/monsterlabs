import { creatureSchema, creatureSchemaType } from "@/types/creature";
import OpenAI from "openai";
import { ChatCompletionTool } from "openai/resources/index.mjs";
import zodToJsonSchema from "zod-to-json-schema";

const openai = new OpenAI();

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'edge';

const systemPrompt = `
You use the generate_creature function in order to generate creatures that the user requests.
The user provides a prompt that describes the creature they want to generate.
Pay close attention to the schema and strongly adhere to it.
Never include the units in the response, only the numbers.

Remember to keep in mind the following:
- First thing about what the overall theme of the creature is, and then think about what kind of abilities and stats it should have. Its abilities and stats should reflect its theme.
- The creature's stats and abilities should be balanced according to its challenge rating.
- The creature should have a multi-attack or a special attack that is unique to the creature if it's challenge rating is 3 or higher.
- The more powerful a creature is, the more attacks and abilities it should have.
- The creature should follow rules and guidelines for creature creation as described in the Dungeon Master's Guide and the Monster Manual for DnD 5e.
- Put AoE attacks such as breath attacks under saving throw attacks.
- Only put actions under special actions if they are not attacks.
- Never describe the action cost in a name of an action.
`;
export async function POST(request: Request) {

  const body = request.json();

  const { prompt } = await body;

  console.log("Received prompt: ", prompt);
  const responseBody = await routeLogicGPT(prompt, 0);

  return new Response(JSON.stringify(responseBody, null, 2), {
    headers: {
      "content-type": "application/json"
    }
  });
}

async function routeLogicGPT(prompt: string, attempts: number = 0) : Promise<creatureSchemaType | { error: string }> {
  const tools:  Array<ChatCompletionTool> = [
    {
      type: "function",
      function: {
        name: "generate_creature",
        description: "Generate a creature with parameters that adhere to this schema. Always fill in required fields in the schema.",
        parameters: zodToJsonSchema(creatureSchema)
      }
    }
  ];

  const completion = await openai.chat.completions.create({
    messages: [
      { "role": "system", "content": systemPrompt },
      { "role": "user", "content": prompt },
    ],
    model: "gpt-3.5-turbo", // Options are gpt-3.5-turbo and gpt-4-turbo-preview
    stream: false,
    tools,
    tool_choice: {
      type: 'function',
      function: {
        name: 'generate_creature'
      }
    },
    temperature: 0.3,
  });

  try {
    console.log("attempt at parsing: ", attempts);
    let parsedMonster = creatureSchema.parse(JSON.parse(completion.choices[0].message.tool_calls![0].function.arguments));

    console.log("successfully parsed creature: ", parsedMonster);

    return parsedMonster
  } catch (error) {
    console.error(error);
    if (attempts < 3) {
      return routeLogicGPT(prompt, attempts + 1);
    } else {
      return {
        error: "We were unable to generate a creature. Please try again."
      }
    }
  }
}
