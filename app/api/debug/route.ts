import { getCreatureById } from "@/app/actions";

export async function GET() {
  console.log("GET request to /api/debug");

  const result = await getCreatureById(73);

  console.log(`result`, result);

  return new Response(JSON.stringify(result, null, 2), {
    headers: {
      "content-type": "application/json"
    }
  });
}