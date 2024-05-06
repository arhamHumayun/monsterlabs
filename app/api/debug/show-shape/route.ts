import { creatureSchema } from "@/types/creature";
import zodToJsonSchema from "zod-to-json-schema";

export async function GET() {
  console.log("GET request to /api/debug/show-shape");

  const jsonSchema = zodToJsonSchema(creatureSchema);

  return new Response(JSON.stringify(jsonSchema, null, 2), {
    headers: {
      "content-type": "application/json"
    }
  });
}