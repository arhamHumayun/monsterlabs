import { Separator } from '@/components/ui/separator';
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOutButton } from '@/components/logout-button';
import Link from 'next/link';
import { getCreaturesByUserId, getItemsByUserId } from '../actions';
import { ThingLink } from '@/components/thing-link';

export default async function Profile() {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase.auth.getUser()

  if (error || !data) {
    console.error('Failed to get user:', error);
    return redirect('/sign-in');
  }

  const user = data?.user;

  const userId = user.id;

  console.log('userId', userId);

  if (!userId) {
    redirect('/sign-in');
  }

  const getCreaturesPromise = getCreaturesByUserId(userId);
  const getItemsPromise = getItemsByUserId(userId);

  let [getCreaturesResult, getItemsResult] = await Promise.allSettled([getCreaturesPromise, getItemsPromise]);

  // Handle the results
  const creatures = getCreaturesResult.status === 'fulfilled' ? getCreaturesResult.value : [];
  const items = getItemsResult.status === 'fulfilled' ? getItemsResult.value : [];

  // Log any errors
  if (!creatures) {
    console.error('Failed to fetch creatures');
  }
  if (!items) {
    console.error('Failed to fetch items');
  }

  // Continue with the successful data
  console.log('Creatures:', creatures);
  console.log('Items:', items);


  return (
    <div className="w-full max-w-5xl mx-auto flex min-h-screen flex-col px-4 sm:px-6 mb-4">
      <h1 className="text-lg font-semibold">Your creatures</h1>
      <Separator className="mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {creatures && creatures.length > 0 ? (
          creatures.map((creature) => {
            return (
              <ThingLink
                key={creature.id}
                id={creature.id}
                name={creature.name}
                thingType='creature'
                type="edit"
              />
            );
          })
        ) : (
          <div>
            <p className="mb-4">You have no creatures.</p>
            <Button asChild>
              <Link href="/">Create</Link>
            </Button>
          </div>
        )}
      </div>
      <h1 className="text-lg font-semibold mt-4">Your items</h1>
      <Separator className="mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items && items.length > 0 ? (
          items.map((item) => {
            return (
              <ThingLink
                key={item.id}
                id={item.id}
                name={item.name}
                thingType='item'
                type="edit"
              />
            );
          })
        ) : (
          <div>
            <p className="mb-4">You have no items.</p>
            <Button asChild>
              <Link href="/">Create</Link>
            </Button>
          </div>
        )}
      </div>
      <Separator className="mb-4" />
      <LogOutButton />
    </div>
  );
}
