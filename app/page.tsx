import CreateThingBox from '@/components/create-thing-box';
import { Button } from '@/components/ui/button';
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client';
import { IconBrandDiscord, IconBrandReddit } from '@tabler/icons-react';
import Link from 'next/link';

export default async function Home() {
  const [count, itemCount] = await Promise.all([
    getCreatureCountByUserId(),
    getItemCountByUserId(),
  ]);

  if (count === null || itemCount === null) {
    console.error('Failed to fetch creatures or items');
    return;
  }

  return (
    <div className="flex flex-col items-center justify-center pt-[10vh] pb-[4vh]">
      <h1 className="mb-3 text-4xl font-medium duration-1000 ease-in-out animate-in fade-in slide-in-from-bottom-3">
        Monster Labs
      </h1>
      <p className="text-base text-center italic text-muted-foreground duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4 max-w-md">
        Let your imagination run wild! Create your own creatures and items
        tailor-made for Dungeons and Dragons.
      </p>
      <p className="text-base text-center italic text-muted-foreground duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4 max-w-md mt-4">
        <span className="font-semibold">{count}</span> creatures and{' '}
        <span className="font-semibold">{itemCount}</span> items created so far!
      </p>
      <div className="mt-4 space-y-4 duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4">
        <CreateThingBox />
      </div>
      <div className="duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4 mt-8 p-4 font-semibold">
        <p className="text-center">
          Join the discussion and keep up to date with the latest news!
        </p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button asChild>
            <Link href="https://discord.gg/mG8w6YzhWA">
              <IconBrandDiscord size={20} className="mr-1" />
              <p>Discord</p>
            </Link>
          </Button>
          <Button asChild>
            <Link href="https://www.reddit.com/r/monsterlabs/">
              <IconBrandReddit size={20} className="mr-1" />
              <p>Reddit</p>
            </Link>
          </Button>
        </div>
      </div>

      <Link
        href="https://www.producthunt.com/posts/monster-labs?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-monster&#0045;labs"
        target="_blank"
        className='mt-2'
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=489452&theme=dark"
          alt="Monster&#0032;Labs - Instantly&#0032;create&#0032;D&#0038;D&#0032;creatures&#0032;and&#0032;items&#0032;from&#0032;your&#0032;ideas&#0033; | Product Hunt"
          className='w-[250px] h-[54px]'
          width="250"
          height="54"
        />
      </Link>

      <Button variant="link" className='mt-2' asChild>
        <Link href={'/plans'}>View Plans</Link>
      </Button>
    </div>
  );
}

async function getCreatureCountByUserId() {
  const supabase = await createSupabaseAppServerClient();
  const { count, error } = await supabase
    .from('creatures')
    .select('id', { count: 'estimated' });

  if (error) {
    console.error('Failed to fetch creatures:', error);
    return null;
  }

  return count;
}

async function getItemCountByUserId() {
  const supabase = await createSupabaseAppServerClient();
  const { count, error } = await supabase
    .from('items')
    .select('id', { count: 'estimated' });

  if (error) {
    console.error('Failed to fetch items:', error);
    return null;
  }

  return count;
}
