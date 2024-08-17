"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateThingBox() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  
  useEffect(() => {
    const initializeUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // If no user is signed in, sign in anonymously
        await supabase.auth.signInAnonymously();
      } else {
        setUser(user);
      }

      console.log('user:', user);

      // Initialize action count from localStorage
      const storedCount = localStorage.getItem('create_item_action_count');
      setActionCount(storedCount ? parseInt(storedCount, 10) : 0);
    };

    initializeUser();
  }, []);

  
}