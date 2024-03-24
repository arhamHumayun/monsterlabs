import { createSupabaseAppServerClient } from '@/lib/supabase/server-client'
import { LoginButton } from '@/components/login-button'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const supabase = await createSupabaseAppServerClient();
  const session = (await supabase.auth.getSession()).data.session;
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      <LoginButton />
    </div>
  )
}
