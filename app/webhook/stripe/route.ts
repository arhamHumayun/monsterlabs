import { createSupabaseSupaService } from "@/lib/supabase/server-client";
import { NextRequest, NextResponse } from "next/server";
import stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();

  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

  if (!endpointSecret) {
    return new NextResponse('Stripe endpoint secret not set', {
      status: 400,
    });
  }

  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return new NextResponse('No stripe signature', { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Error', err);
    return new NextResponse('Webhook Error', { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      const { metadata, subscription, customer } = session;

      if (!metadata) {
        return new NextResponse('No metadata provided', {
          status: 400,
        });
      }

      const userId = metadata['userId'];

      if (!userId || typeof userId !== 'string' || userId.length === 0) {
        return new NextResponse('No user_id provided', {
          status: 400,
        });
      }

      // Handle the checkout session
      const supabase = await createSupabaseSupaService();

      await supabase.from('profiles').update({
        stripe_customer_id: customer?.toString(),
        subscription_status: 'active',
        subscription_id: subscription,
        role: 'pro'
      }).eq('user_id', userId);

      break;

    default:
      break;
  }

  return new NextResponse('OK', { status: 200 });
}
