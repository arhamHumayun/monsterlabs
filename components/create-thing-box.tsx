'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { CreateCreatureForm } from './creature/create-creature-form';
import { CreateItemForm } from './item/create-item-form';
import { Button } from './ui/button';
import Link from 'next/link';

export default function CreateThingBox({
  creatureCount,
  itemCount,
}: {
  creatureCount: number;
  itemCount: number;
}) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[720px]">
      <div
        className='rounded-lg border-gray-500 items-center justify-center flex flex-col w-full'
      >
        <CreateCreatureForm
          user={user}
          actionCount={actionCount}
          setActionCount={setActionCount}
          showLimitAlert={showLimitAlert}
          setShowLimitAlert={setShowLimitAlert}
        />
        <p className="mt-1">
          <span className="font-semibold">{creatureCount}</span> creatures
          created!
        </p>
        <Button variant="outline" asChild>
          <Link href="/browse/creatures/1">View existing creatures</Link>
        </Button>
      </div>

      <div
                className='rounded-lg border-gray-500 items-center justify-center flex flex-col'
      >
        <CreateItemForm
          user={user}
          actionCount={actionCount}
          setActionCount={setActionCount}
          showLimitAlert={showLimitAlert}
          setShowLimitAlert={setShowLimitAlert}
        />
        <p className="mt-1">
          <span className="font-semibold">{itemCount}</span> items created!
        </p>
        <Button variant="outline" asChild>
          <Link href="/browse/items/1">View existing items</Link>
        </Button>
      </div>
    </div>
  );
}
