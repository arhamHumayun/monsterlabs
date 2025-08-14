'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { handleCheckout } from '../actions';
import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@supabase/supabase-js';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Plans() {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const [isAnnual, setIsAnnual] = useState(true);

  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID;
  const ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID;

  useEffect(() => {
    const fetchUserId = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data && data.user && !error) {
        setUserId(data.user.id);
      }

      if (!data || !data.user || error || data.user.is_anonymous === true) {
        setUserId(null);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (profileData && !profileError) {
        const { role } = profileData;

        if (role) {
          setRole(profileData.role);
        }
      }
    };

    fetchUserId();
  });

  if (!MONTHLY_PRICE_ID || !ANNUAL_PRICE_ID) {
    console.error('Missing price IDs', {
      MONTHLY_PRICE_ID,
      ANNUAL_PRICE_ID,
    });
    return null;
  }

  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl mt-6">Plans</h1>
        <h2 className="text-sm text-muted-foreground">
          Start using for free, then upgrade to the Pro plan for unlimited
          access to all features! 20% off when you pay annually.
        </h2>
        {userId === null ? (
          <h2 className="text-sm mt-2">Please log in to view your current plan.</h2>
        ) : role !== null ? (
          <h2 className="text-sm mt-2">
            You are currently on the {role} plan.
          </h2>
        ) : (
          <Skeleton className="h-4 w-48 mt-3" />
        )}
      </div>
      <div className="mt-6 flex flex-col space-y-4">
        <div className="flex flex-row space-x-2 justify-center">
          <Tabs defaultValue="annual">
            <TabsList>
              <TabsTrigger value="monthly" onClick={() => setIsAnnual(false)}>
                Monthly
              </TabsTrigger>
              <TabsTrigger value="annual" onClick={() => setIsAnnual(true)}>
                Annual
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="border-emerald-900 bg-emerald-300 px-1 rounded-lg text-emerald-800 text-sm place-self-center">
            20% off
          </div>
        </div>

        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <p className="text-lg mb-2">Free Plan</p>
                <p>
                  $0 <span className="text-sm">/month</span>
                </p>
              </CardTitle>
              <CardDescription>
                Access to most features with generous limits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm">
                <li>Generate 10 creatures and items per month.</li>
                <li>3 image generations per month.</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <p className="text-lg mb-2">Pro Plan</p>
                <p>
                  ${isAnnual ? 4 : 5}{' '}
                  <span className="text-sm align-bottom">/month</span>
                </p>
              </CardTitle>
              <CardDescription>
                Nearly unlimited access to all features. Extra features
                included!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm">
                <li>Unlimited creatures and items.</li>
                <li>Unlimited generations.</li>
                <li>300 images per month. That{`'`}s 10 images a day!</li>
                <li>Update your creatures and items via AI.</li>
                <li>Early access to new features.</li>
                <li>Priority support.</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="default"
                className="w-fit px-4"
                disabled={!userId || role === 'pro'}
                onClick={async () => {
                  if (!userId) {
                    return;
                  }

                  const { sessionUrl, error } = await handleCheckout(
                    isAnnual ? ANNUAL_PRICE_ID : MONTHLY_PRICE_ID,
                    userId
                  );

                  if (!sessionUrl || error) {
                    console.error('Error creating checkout session:', error);
                    return;
                  }

                  if (!sessionUrl) {
                    console.error('No URL returned from checkout session');
                    return;
                  }

                  router.push(sessionUrl);
                }}
              >
                {role === 'pro' ? 'Already Pro!' : 'Upgrade to Pro'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <h1
        className="text-xl mt-8 font-semibold"
      >
        Frequently Asked Questions:
      </h1>
      <Accordion
        className="mt-4 self-center"
        type="single"
        collapsible
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Can you cancel your subscription?</AccordionTrigger>
          <AccordionContent>
            Yes. You can cancel your subscription at any time.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            What extra features do subscribers get?
          </AccordionTrigger>
          <AccordionContent>
            Subscribers get access to all current and upcoming features, including
            unlimited total creatures and items, unlimited generations, and 300 image generations
            per month. This includes the ability to update your creatures and
            items via AI, early access to new features, and priority support.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            What features are coming soon?
          </AccordionTrigger>
          <AccordionContent>
            We are working on a way to export your creations in pdf and image formats. In addition to popular community requests.
            Stay tuned!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            How can I keep up with new features?
          </AccordionTrigger>
          <AccordionContent>
            Join our discord or subreddit to stay up to date with new features and updates.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
