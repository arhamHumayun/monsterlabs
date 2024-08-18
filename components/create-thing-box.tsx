"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { CreateCreatureForm } from "./creature/create-creature-form";
import { CreateItemForm } from "./item/creature-item-form";

export default function CreateThingBox() {

  const [user, setUser] = useState<User | null>(null);
  const [actionCount, setActionCount] = useState(0);
  const [showLimitAlert, setShowLimitAlert] = useState(false);

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
      const storedCount = localStorage.getItem('action_count');
      setActionCount(storedCount ? parseInt(storedCount, 10) : 0);
    };

    initializeUser();
  }, []);

  return (
    <div
      className="grid grid-cols-2 gap-8"
    >
      <CreateCreatureForm 
        user={user}
        actionCount={actionCount}
        setActionCount={setActionCount}
        showLimitAlert={showLimitAlert}
        setShowLimitAlert={setShowLimitAlert}
      />
      <CreateItemForm
        user={user}
        actionCount={actionCount}
        setActionCount={setActionCount}
        showLimitAlert={showLimitAlert}
        setShowLimitAlert={setShowLimitAlert}
      />
    </div>
  );
  
}