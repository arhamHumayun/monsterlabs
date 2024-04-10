"use client"

import { creatureSchemaType } from "@/types/creature"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button";

export function CreatureLink(
  { creature, id } : { id: number, creature: creatureSchemaType }
) {

  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(`/creature/${id}`)}
      className="rounded"
      variant='outline'
    >
      {creature.name}
    </Button>
  )
}