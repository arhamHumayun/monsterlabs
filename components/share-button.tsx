"use client"

import { doToast } from "@/lib/utils";
import { Button } from "./ui/button";

export default function ShareButton({
  id,
  type,
  textOverride,
}: {
  id: number;
  type: 'creature' | 'item';
  textOverride?: string;
}) {
 return (
  <Button
  variant="default"
  className="mb-4"
  onClick={() => {
    navigator.clipboard.writeText(
      `${window.location.origin}/${type}/view/${id}`
    );
    doToast('Link copied.');
  }}
>
  {textOverride || 'Share'}
</Button>
 )
}