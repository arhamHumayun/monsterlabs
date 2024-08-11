"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button";

export function CreatureLink(
  { creatureName, id, type } : { id: number, creatureName: string, type: 'edit' | 'view' | 'view' }
) {

  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(`/creature/${type}/${id}`)}
      className="rounded flex flex-col text-balance h-14"
      variant='outline'
    >
      <p className="text-clip overflow-hidden ...">{creatureName}</p>
    </Button>
  )
}