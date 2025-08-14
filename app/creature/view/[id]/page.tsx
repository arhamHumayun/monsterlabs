import CreatureBlock from "@/components/creature/creature-block";
import ShareButton from "@/components/share-button";
import { createSupabaseAppServerClient } from "@/lib/supabase/server-client";
import { creatureSchema } from "@/types/creature";
import { creaturesDocument } from "@/types/db/creature";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'View Creature',
  description: 'View a creature',
};

export default async function ViewMonster(
  { params }: { params: { id: number } }
) {

  const { id } = params;  

  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('creatures')
    .select(`*`)
    .eq('id', id)
    .single();

  if (error || !data || data.length === 0) {
    console.error('Failed to get creature by id:', error);
    return (
      <div>
        <h1>Creature not found</h1>
      </div>
    );
  }

  const creature = data as creaturesDocument;

  const creatureData = creatureSchema.parse({
    name: creature.name,
    lore: creature.lore,
    appearance: creature.appearance,
    pronoun: creature.pronoun,
    type: creature.type,
    isUnique: creature.is_unique,
    challengeRating: creature.challenge_rating / 100,
    alignment: creature.alignment,
    size: creature.size,
    hitDiceAmount: creature.hit_dice_amount,
    ...creature.json,
  });

  return (
    <div className="mb-4">
      <ShareButton id={id} type={'creature'} textOverride="Share this creature!" />
      <CreatureBlock creature={creatureData} currentImageUrl={creature.main_image_url} />
    </div>
  )
}
