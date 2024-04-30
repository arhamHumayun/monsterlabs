'use client';

import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';

export default function ProPage() {
  const redirectToCheckout = async () => {
    try {
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
      );

      if (!stripe) throw new Error('Stripe failed to initialize.');

      const checkoutResponse = await fetch('/api/checkout/session', {
        method: 'POST',
      });

      const { id } = await checkoutResponse.json();
      const stripeError = await stripe.redirectToCheckout({ sessionId: id });

      if (stripeError) {
        console.error(stripeError);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl">
      <p className="text-center">
        With Pro you can create unlimited creatures and access premium features.
        Such as image generation, access to GPT-4 for creature generation and
        more to come!
      </p>
      <Button className="mx-auto mt-4" onClick={redirectToCheckout}>
        Get a pro account
      </Button>
    </div>
  );
}
