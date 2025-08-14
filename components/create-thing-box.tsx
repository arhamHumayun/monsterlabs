'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { CreateCreatureForm } from './creature/create-creature-form';
import { CreateItemForm } from './item/create-item-form';
import { Button } from './ui/button';

export default function CreateThingBox() {
  const [user, setUser] = useState<User | null>(null);
  const [actionCount, setActionCount] = useState(0);
  const [showThing, setShowThing] = useState<'creature' | 'item'>('creature');

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const initializeUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // If no user is signed in, sign in anonymously
        const result = await supabase.auth.signInAnonymously();
        setUser(result.data.user);
      } else {
        setUser(user);
      }

      // Initialize action count from localStorage
      const storedCount = localStorage.getItem('action_count');
      setActionCount(storedCount ? parseInt(storedCount, 10) : 0);
    };

    initializeUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchButton = (
    <Button
      variant="secondary"
      className="mt-4 w-fit"
      onClick={() =>
        setShowThing(showThing === 'creature' ? 'item' : 'creature')
      }
    >
      I want to create a {showThing === 'creature' ? 'magic item' : 'creature'} instead
    </Button>
  );

  return (
    <div className="w-screen px-4 max-w-xl">
      {showThing === 'creature' ? (
        <CreateCreatureForm
          user={user}
          setUser={setUser}
          actionCount={actionCount}
          setActionCount={setActionCount}
        />
      ) : showThing === 'item' ? (
        <CreateItemForm
          user={user}
          setUser={setUser}
          actionCount={actionCount}
          setActionCount={setActionCount}
        />
      ) : null}
      <div className="flex flex-row justify-center">{switchButton}</div>
    </div>
  );
}
