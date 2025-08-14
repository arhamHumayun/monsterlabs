import { LoginButton } from '@/components/login-button';
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client'
import { redirect } from 'next/navigation'

export default async function SignIn() {
  const supabase = await createSupabaseAppServerClient();
  const { data } = await supabase.auth.getUser();

  const user = data?.user;
  // redirect to home if user is already logged in
  if (user && !user.is_anonymous) {
    redirect('/')
  }

  return (
    <div className="flex flex-col py-10">
      <LoginButton />
    </div>
  )
}