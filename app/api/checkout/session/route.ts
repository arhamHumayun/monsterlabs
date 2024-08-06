import { NextRequest, NextResponse } from "next/server";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {

  // Create Checkout Sessions from body params.
  const originHeader = request.headers.get('origin')
  // const body = await request.json();

  // const { user } = body;


  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: 'price_1P6nVUDtQELfZgFX5q5IyHTQ',
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${originHeader}/?success=true`,
    cancel_url: `${originHeader}/?canceled=true`,
  });

  return NextResponse.json({ id: session.id });
}
