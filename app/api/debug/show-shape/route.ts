// import { creatureSchema } from "@/types/creature";
import { itemSchema } from "@/types/item";
import zodToJsonSchema from "zod-to-json-schema";

export async function GET() {
  console.log("GET request to /api/debug/show-shape");

  const jsonSchema = zodToJsonSchema(itemSchema);

  return new Response(JSON.stringify(jsonSchema, null, 2), {
    headers: {
      "content-type": "application/json"
    }
  });
}