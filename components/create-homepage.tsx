import { createSupabaseAppServerClient } from '@/lib/supabase/server-client';
import { CreateCreatureForm } from './creature/create-creature-form';
import { Button } from './ui/button';
import Link from 'next/link';
import { IconBrandReddit, IconBrandDiscord } from '@tabler/icons-react';
import CreateThingBox from './create-thing-box';

export default async function CreateHomepage() {
  // 3. Fetch the number of creatures.
  const supabase = await createSupabaseAppServerClient();
  const { count, error } = await supabase
    .from('creatures')
    .select('*', { count: 'estimated' });

  if (error || !count) {
    console.error('Failed to get count of creatures:', error);
    return null;
  }

  // 4. Fetch the number of items.
  const { count: itemCount, error: itemError } = await supabase
    .from('items')
    .select('*', { count: 'estimated' });

  if (itemError || !itemCount) {
      console.error('Failed to get count of items:', error);
      return null;
    }


  return (
    <div className="flex flex-col items-center justify-center py-[12vh]">
      <h1 className="mb-3 text-4xl font-medium duration-1000 ease-in-out animate-in fade-in slide-in-from-bottom-3">
        Monster Lab
      </h1>
      <p className="text-base text-center italic text-gray-400 duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4 max-w-md">
        Let your imagination run wild! Create your own creatures and items fully compatible with DnD 5e.
      </p>
      <div className="mt-4 space-y-4 duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4">
        <CreateThingBox creatureCount={count} itemCount={itemCount} />
      </div>
      <div className="duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4 pt-8 py-4 grid grid-cols-2 gap-4 font-semibold">
        <p className="col-span-2 text-center">
          Join the discussion and keep up to date!
        </p>
        <Button asChild>
          <Link href="https://discord.gg/WCauKARg">
            <IconBrandDiscord size={20} className="mr-1" />
            Discord
          </Link>
        </Button>
        <Button asChild>
          <Link href="https://www.reddit.com/r/monsterlabs/">
            <IconBrandReddit size={20} className="mr-1" />
            Reddit
          </Link>
        </Button>
      </div>
    </div>
  );
}
