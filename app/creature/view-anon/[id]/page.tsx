import CreatureBlock from '@/components/creature/creature-block';
import { LoginButton } from '@/components/login-button';
import ShareButton from '@/components/share-button';
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client';
import { creatureSchema } from '@/types/creature';
import { creaturesDocument } from '@/types/db/creature';

export default async function ViewAnonMonster({
  params,
}: {
  params: { id: number };
}) {
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
    <div>
      <ShareButton id={id} type={'creature'} textOverride="Share this creature!" />
      <CreatureBlock creature={creatureData} />
      <div className="grid grid-cols-1 gap-4 mt-4 mb-2 place-items-center">
        <h1 className="text-gray-200 text-center">
          Sign in with Google to save and edit your creatures. This creature
          will be saved when you sign in. Otherwise you {`won't`} be able to edit it later.
        </h1>
        <div className="flex justify-center">
          <ShareButton id={id} type={'creature'} textOverride="Share this creature!" />
          <LoginButton message="Sign in with Google." />
        </div>
      </div>
    </div>
  );
}
