import CancelSubscriptionButton from '@/components/cancel-subscription-button';
import { LogOutButton } from '@/components/logout-button';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client';
import { FullProfileDocument, ProfileDocument } from '@/types/db/profile';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const supabase = await createSupabaseAppServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  const currentUser = userData?.user;

  if (userError || !currentUser) {
    console.error('Failed to get user:', userError);
    return redirect('/sign-in');
  }

  const userId = currentUser.id;

  if (!userId) {
    redirect('/sign-in');
  }

  const [creaturesCount, itemCount] = await Promise.all([
    getCreatureCountByUserId(userId),
    getItemCountByUserId(userId),
  ]);

  if (creaturesCount === null || itemCount === null) {
    console.error('Failed to fetch creatures or items');
    return redirect('/sign-in');
  }

  const profile = await getProfileFromUserId(userId);

  if (!profile) {
    console.error('Failed to fetch profile');
    return redirect('/sign-in');
  }

  const entryStyling = 'grid grid-cols-6';
  const titleStyling = 'font-semibold mr-2 text-right';
  const valueStyling = 'col-span-5';

  const profileCreatedAt = new Date(profile.created_at);

  const showUpgradeToPro = profile.role === 'free';

  return (
    <div>
      {showUpgradeToPro && (
        <Button
          variant="default"
          className="w-full mb-4"
          asChild
        >
          <Link href="/plans">
            Click here to upgrade to Pro for unlimited use!
          </Link>
        </Button>
      )}

      <div className="flex flex-col gap-1">
          <div className={entryStyling}>
            <div className={titleStyling}>Email</div>
            <div className={valueStyling}>{profile?.email}</div>
          </div>

          <div className={entryStyling}>
            <div className={titleStyling}>User ID</div>
            <div className={valueStyling}>{profile?.user_id}</div>
          </div>

          <div className={entryStyling}>
            <div className={titleStyling}>Account Created On</div>
            <div className={valueStyling}>{profileCreatedAt.toDateString()}</div>
          </div>

          <div className={entryStyling}>
            <div className={titleStyling}>Account Type</div>
            <div className={valueStyling}>{profile?.role}</div>
          </div>
          
          <div className={entryStyling}>
            <div className={titleStyling}>Total Creatures</div>
            <div className={valueStyling}>{creaturesCount}</div>
          </div>

          <div className={entryStyling}>
            <div className={titleStyling}>Total Items</div>
            <div className={valueStyling}>{itemCount}</div>
          </div>

      </div>

      <Separator className="my-2" />
      <div className='flex flex-row justify-between'>
      <LogOutButton />
      {
        profile.subscription_id && profile.role === 'pro' ? (
          <CancelSubscriptionButton userId={userId} subscriptionId={profile.subscription_id} />
        ) : null
      }
      </div>
    </div>
  );
}

async function getCreatureCountByUserId(userId: string) {
  const supabase = await createSupabaseAppServerClient();
  const { count, error } = await supabase
    .from('creatures')
    .select('id', { count: 'exact' })
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to fetch creatures:', error);
    return null;
  }

  return count;
}

async function getItemCountByUserId(userId: string) {
  const supabase = await createSupabaseAppServerClient();
  const { count, error } = await supabase
    .from('items')
    .select('id', { count: 'exact' })
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to fetch items:', error);
    return null;
  }

  return count;
}

async function getProfileFromUserId(
  userId: string
): Promise<FullProfileDocument | null> {
  const supabase = await createSupabaseAppServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('Failed to get user');
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    console.error('Failed to fetch profile:', error);
    return null;
  }

  const profile = data as ProfileDocument;

  const fullProfile: FullProfileDocument = {
    ...profile,
    created_at: user.created_at,
    email: user.email!,
  };

  return fullProfile;
}
