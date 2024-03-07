import { monsterSchema } from "@/types/monster";
import OpenAI from "openai";
import zodToJsonSchema from "zod-to-json-schema";

const openai = new OpenAI();

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'edge';

const systemPrompt = `
You use the generate monster tool in order to generate monsters that the user requests.
The user provides a prompt that describes the monster they want to generate.

Remember to keep in mind the following:
- First thing about what the overall theme of the monster is, and then think about what kind of abilities and stats it should have. Its abilities and stats should reflect its theme.
- The monster's stats and abilities should be balanced according to its challenge rating.
- The monster should have interesting and unique abilities.
- The monster should have a multi-attack or a special attack that is unique to the monster if it's challenge rating is 3 or higher.
- The more powerful a monster is, the more attacks and abilities it should have.
- The monster should follow rules and guidelines for monster creation as described in the Dungeon Master's Guide and the Monster Manual for DnD 5e.
- Come up with the idea first, then stats, then the attacks, then the other actions.
`;
export async function POST(request: Request) {

  const body = request.json();

  const { prompt } = await body;

  const tools = [
    {
      name: "generate_monster",
      description: "Generate a monster in json format according to the following prompt that has to adhere to this schema.",
      parameters: zodToJsonSchema(monsterSchema)
    }
  ];

  const completion = await openai.chat.completions.create({
    messages: [
      { "role": "system", "content": systemPrompt},
      { "role": "user", "content": prompt }, 
    ],
    model: "gpt-3.5-turbo",
    functions: tools,
    temperature: 0.5,
    function_call: {
      name: "generate_monster",
    }
  });

  console.log(completion);

  let responseBody = ""
  try {
    responseBody = JSON.stringify(JSON.parse(completion.choices[0].message.function_call?.arguments!), null, 2);
  } catch (e) {
    responseBody = completion.choices[0].message.function_call?.arguments!;
  }

  console.log(responseBody);

  return new Response(`${responseBody}`);
}
