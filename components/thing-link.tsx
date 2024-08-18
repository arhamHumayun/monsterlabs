"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button";

export function ThingLink(
  { id, name, thingType, type } : { id: number, name: string, thingType: 'creature' | 'item', type: 'edit' | 'view' | 'view' }
) {

  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(`/${thingType}/${type}/${id}`)}
      className="rounded flex flex-col text-balance h-14"
      variant='outline'
    >
      <p className="text-clip overflow-hidden ...">{name}</p>
    </Button>
  )
}