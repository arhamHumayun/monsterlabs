import { monsterSchema } from "@/types/monster";
import OpenAI from "openai";
import zodToJsonSchema from "zod-to-json-schema";

const openai = new OpenAI();

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'edge';

const systemPrompt = `
You use the generate_monster function in order to generate monsters that the user requests.
The user provides a prompt that describes the monster they want to generate.

Remember to keep in mind the following:
- First thing about what the overall theme of the monster is, and then think about what kind of abilities and stats it should have. Its abilities and stats should reflect its theme.
- The monster's stats and abilities should be balanced according to its challenge rating.
- The monster should have a multi-attack or a special attack that is unique to the monster if it's challenge rating is 3 or higher.
- The more powerful a monster is, the more attacks and abilities it should have.
- The monster should follow rules and guidelines for monster creation as described in the Dungeon Master's Guide and the Monster Manual for DnD 5e.
- If a monster has a spell attack or an area of affect attack, it should fit in the schema. Make special actions only after targeted attacks and saving throw attacks. 
- Never describe the action cost in a name of an action.
- Always fill in required fields in the schema.
`;
export async function POST(request: Request) {

  const body = request.json();

  const { prompt } = await body;

  console.log("Received prompt: ", prompt);
  const responseBody = await routeLogic(prompt, 0);

  return new Response(JSON.stringify(responseBody, null, 2), {
    headers: {
      "content-type": "application/json"
    }
  });
}

async function routeLogic(prompt: string, attempts: number = 0) {
  const tools = [
    {
      name: "generate_monster",
      description: "Generate a monster with parameters that adhere to this schema. Always fill in required fields in the schema.",
      parameters: zodToJsonSchema(monsterSchema)
    }
  ];

  const completion = await openai.chat.completions.create({
    messages: [
      { "role": "system", "content": systemPrompt},
      { "role": "user", "content": prompt }, 
    ],
    model: "gpt-3.5-turbo", // Options are gpt-3.5-turbo and gpt-4-turbo-preview
    functions: tools,
    temperature: 0.2,
    function_call: {
      name: "generate_monster",
    }
  });

  try {
    console.log("attempt at parsing: ", attempts);
    let parsedMonster = monsterSchema.parse(JSON.parse(completion.choices[0].message.function_call?.arguments!));

    console.log("successfully parsed monster: ", parsedMonster);

    return parsedMonster
  } catch (error) {
    console.error(error);
    if (attempts < 3) {
      return routeLogic(prompt, attempts + 1);
    } else {
      return {
        error: "We were unable to generate a monster. Please try again."
      }
    }
  }
}