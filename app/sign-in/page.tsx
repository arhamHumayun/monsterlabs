import { createSupabaseAppServerClient } from '@/lib/supabase/server-client'
import { LoginButton } from '@/components/login-button'
import { redirect } from 'next/navigation'

export default async function SignIn() {
  const supabase = await createSupabaseAppServerClient();
  const session = (await supabase.auth.getSession()).data.session;
  // redirect to home if user is already logged in
  if (session?.user) {
    console.log('User is already logged in', session.user);
    redirect('/')
  }

  return (
    <div className="flex py-20">
      <LoginButton />
    </div>
  )
}
