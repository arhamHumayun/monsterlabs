"use client"

import { creatureSchemaType } from "@/types/creature"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button";

export function CreatureLink(
  { creature, id, type } : { id: number, creature: creatureSchemaType, type: 'edit' | 'view' }
) {

  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(`/creature/${type}/${id}`)}
      className="rounded flex flex-col text-balance h-min p-6"
      variant='outline'
    >
      {creature.name}
    </Button>
  )
}