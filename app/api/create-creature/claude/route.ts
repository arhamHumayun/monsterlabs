import { creatureSchema } from '@/types/creature';
import Anthropic from '@anthropic-ai/sdk';
import zodToJsonSchema from 'zod-to-json-schema';

export const maxDuration = 60; // This function can run for a maximum of 5 seconds

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const system = `
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

  const requestBody = JSON.stringify({
    model: "claude-3-haiku-20240307",
    max_tokens: 4096,
    system,
    tools: [{
      name: "generate_creature",
      description: "Generate a creature with parameters that adhere to this schema. Always fill in required fields in the schema.",
      input_schema: zodToJsonSchema(creatureSchema),
    }],
    messages: [{
      role: "user", content: prompt
    }]
  })

  const completion = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': `${process.env.ANTHROPIC_API_KEY}`,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'tools-2024-04-04'
    },
    body: requestBody
  })

  const jsonResponse = await completion.json();

  console.log("Anthropic response: ", jsonResponse);

  const creatureInput = (jsonResponse.content as any[]).find((obj: any) => obj.type === "tool_use").input;

  console.log("Creature input: ", creatureInput);

  return new Response(JSON.stringify(creatureInput), {
    headers: {
      "content-type": "application/json"
    }
  });
}