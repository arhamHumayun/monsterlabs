import { Separator } from '@/components/ui/separator';
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOutButton } from '@/components/logout-button';
import Link from 'next/link';
import { getCreaturesByUserId } from '../actions';
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

  const creatures = await getCreaturesByUserId(userId);

  return (
    <div className="w-full max-w-5xl mx-auto flex min-h-screen flex-col px-4 sm:px-6 mb-4">
      <h1 className="text-lg font-semibold">Your creations</h1>
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
      <Separator className="my-4" />
      <LogOutButton />
    </div>
  );
}
