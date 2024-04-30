import { LoginButton } from '@/components/login-button';
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client'
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
    <div className="flex flex-col py-10">
      <h1 className='text-2xl font-semibold text-center mb-5'>
        Create an account to start creating!
      </h1>
      <LoginButton />
    </div>
  )
}