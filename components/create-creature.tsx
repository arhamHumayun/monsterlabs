import { createSupabaseAppServerClient } from '@/lib/supabase/server-client';
import { LandingForm } from './landing-form';
import { Button } from './ui/button';
import Link from 'next/link';

export default async function CreateCreature() {
  // 3. Fetch the number of creatures.
  const supabase = await createSupabaseAppServerClient();
  const { count, error } = await supabase
    .from('creatures')
    .select('*', { count: 'estimated' });

  if (error || !count) {
    console.error('Failed to get count of creatures:', error);
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center py-[12vh]">
      <h1 className="mb-3 text-4xl font-medium duration-1000 ease-in-out animate-in fade-in slide-in-from-bottom-3">
        Monster Lab
      </h1>
      <p className="text-base text-center italic text-gray-400 duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4 max-w-lg">
        Describe your creature and we will generate a stat block for DnD 5e.
        Your creation could be a monster, a hero, or anything else you can
        imagine.
      </p>
      <div className="mt-4 w-full max-w-xl space-y-4 duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4">
        <LandingForm />
      </div>
      <div className='grid grid-cols-1 gap-3 my-4 duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4 max-w-lg place-items-center'>
        <p className=" text-gray-200 pl">
          <span className='font-semibold' >{count}</span> creatures created so far!
        </p>
        <Button asChild variant={'outline'}>
          <Link href="/browse">View existing creatures</Link>
        </Button>
      </div>
    </div>
  );
}
