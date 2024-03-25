"use server";

import { createServerClient, CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseAppServerClient(serverComponent = false) {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          if (serverComponent) {
            return
          }
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          if (serverComponent) {
            return
          }
          cookieStore.delete({ name, ...options })
        },
      },
    }
  );
}

export async function getUser() {
  const supabase = await createSupabaseAppServerClient();
  const session = await supabase.auth.getSession();
  const user = session.data.session?.user;

  return user;
}