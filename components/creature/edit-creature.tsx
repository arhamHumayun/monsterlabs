'use client';

import { creatureSchema } from '@/types/creature';
import CreatureBlock from './creature-block';
import { Button } from '../ui/button';
import React from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { User } from '@supabase/supabase-js';
import { usePreviousState } from '@/lib/hooks';
import { updateCreature as updateCreatureToDB } from '@/app/actions';
import { doToast } from '@/lib/utils';
import { creaturesDocument } from '@/types/db/creature';
import Link from 'next/link';
import ShareButton from '../share-button';
import UpdateCreaturePromptForm from './update-creature-text-box';
import ManuallyEditCreatureModal from './manually-edit-creature-modal';
import GenerateImageDialog from '../generate-image-dialog';

export function EditCreature({
  creature,
  user,
}: {
  creature: creaturesDocument;
  user: User | null;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [creatureObject, setCreatureObject, goPreviousVersion, goNextVersion] =
    usePreviousState(creature);

  const [currentImageUrl, setCurrentImageUrl] = React.useState<string | null>(
    creature.main_image_url
  );

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  if (!user) {
    router.push('/sign-in');
    return;
  }

  if (creatureObject.user_id !== user.id) {
    router.push('/your-creations');
    return;
  }

  async function deleteCreature() {
    await supabase.from('creatures').delete().eq('id', creatureObject.id);
    router.push('/your-creations');
  }

  const creatureData = creatureSchema.parse({
    name: creatureObject.name,
    hitDiceAmount: creatureObject.hit_dice_amount,
    lore: creatureObject.lore,
    appearance: creatureObject.appearance,
    pronoun: creatureObject.pronoun,
    type: creatureObject.type,
    isUnique: creatureObject.is_unique,
    challengeRating: creatureObject.challenge_rating / 100,
    alignment: creatureObject.alignment,
    size: creatureObject.size,
    ...creatureObject.json,
  });

  return (
    <div>
      {UpdateCreaturePromptForm({
        creatureObject,
        setCreatureObject,
        isLoading,
        setIsLoading,
      })}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <Button
          variant="secondary"
          disabled={isLoading}
          onClick={() => goPreviousVersion()}
        >
          Undo
        </Button>
        <Button
          variant="secondary"
          disabled={isLoading}
          onClick={() => goNextVersion()}
        >
          Redo
        </Button>
        <Button
          variant="default"
          className="col-span-2"
          disabled={isLoading || isSaving}
          onClick={async () => {
            setIsSaving(true);
            await updateCreatureToDB(creatureObject);
            setIsSaving(false);
            doToast('Creature saved.');
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {ManuallyEditCreatureModal({
          creatureObject,
          setCreatureObject,
          isLoading,
          setIsLoading,
        })}
        {GenerateImageDialog({
          type: 'creature',
          name: creatureObject.name,
          thingId: creature.id,
          setCurrentImageUrl,
          additionalDescription: creatureObject.appearance,
        })}
      </div>
      <CreatureBlock
        creature={creatureData}
        currentImageUrl={currentImageUrl}
        onlyBlock={true}
      />
      <div className="flex flex-row flex-wrap gap-4 my-4">
        <ShareButton
          id={creature.id}
          type={'creature'}
          textOverride="Share this creature!"
        />
        <Button asChild>
          <Link href="/">Create another</Link>
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="destructive">Delete Creature</Button>
          </PopoverTrigger>
          <PopoverContent className="rounded mt-1">
            <p className="text-sm">
              Are you sure you want to delete this creature? This action cannot
              be undone.
            </p>
            <Button
              variant="destructive"
              className='mt-2'
              onClick={deleteCreature}
            >
              Delete Creature
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
