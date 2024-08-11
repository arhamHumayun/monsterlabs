import { createSupabaseAppServerClient } from '@/lib/supabase/server-client'
import { redirect } from 'next/navigation'

export default async function Debug() {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase.auth.getUser();

  const user = data?.user;
  // redirect to home if user is already logged in
  if (user && !user.is_anonymous) {
    return (
      <div>
        You is not anon
      </div>
    )
  } else if (user && user.is_anonymous) {
    return (
      <div>
        You is anon
      </div>
    )
  } else if (!user) {
    return (
      <div>
        You is not even a usa
      </div>
    )
  }

  return (
    <div>
      Hi
    </div>
  )
}