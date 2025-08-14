'use server';

import { redirect } from 'next/navigation'
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client'
import { creaturesDocument } from '@/types/db/creature';
import { itemsDocument } from '@/types/db/item';
import Stripe from 'stripe';
import Replicate from "replicate";

import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';

export async function logInToGoogle() {
  const supabase = await createSupabaseAppServerClient();
  const mainUrl = process.env.NEXT_PUBLIC_VERCEL_URL || location.origin;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${mainUrl}/auth/callback`,
    },
  });

  if (error) {
    console.error('error', error);
  }
  
  if (data) {
    console.log('data', data);
  }

  return redirect('/')
}

export async function logOut(): Promise<void> {
  const supabase = await createSupabaseAppServerClient();
  await supabase.auth.signOut();
  return redirect('/')
}

export async function updateCreature(creature: creaturesDocument): Promise<{ data: creaturesDocument | null }> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('creatures')
    .update(creature)
    .eq('id', creature.id)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Failed to update creature:', error);
    return {
      data: null
    }
  }

  return {
    data,
  };
}

export async function updateItem(item: itemsDocument): Promise<{ data: itemsDocument | null }> {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('items')
    .update(item)
    .eq('id', item.id)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Failed to update item:', error);
    return {
      data: null
    }
  }

  return {
    data,
  };
}

export async function handleCheckout(priceId: string, userId: string): Promise<{ sessionUrl?: string, error?: string }> {
  const { stripe, error } = await getStripe();
  if (error || !stripe) {
    return {
      error
    };
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId
    },
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/plans`,
    cancel_url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/plans`,
  });

  if (!session) {
    return {
      error: 'Failed to create checkout session'
    };
  }

  if (!session.url) {
    return {
      error: 'No session URL provided'
    };
  }

  return {
    sessionUrl: session.url,
  };
}

export async function handleUnsubscribe(subscriptionId: string) : Promise<{ error?: string, success: boolean }> {
  const { stripe, error } = await getStripe();
  if (error || !stripe) {
    return {
      success: false,
      error
    };
  }

  const cancelled = await stripe.subscriptions.cancel(subscriptionId);

  if (!cancelled) {
    return {
      success: false,
      error: 'Failed to cancel subscription'
    };
  }

  return {
    success: true
  };
}

export async function getStripe(): Promise<{
  stripe?: Stripe;
  error?: string;
}> {
  const { STRIPE_SECRET_KEY } = process.env;
  if (!STRIPE_SECRET_KEY) {
    console.error('Stripe secret key not set');
    return {
      error: 'Stripe secret key not set',
    };
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  if (!stripe) {
    console.error('Stripe not initialized');
    return {
      error: 'Stripe not initialized',
    };
  }

  return { stripe };
}

export async function generateImageFromReplicate(prompt: string, user_id: string): Promise<string> {
  const replicate = new Replicate();
  const supabase = await createSupabaseAppServerClient();

  const input = {
    prompt: prompt,
    num_outputs: 1,
    aspect_ratio: "1:1",
    output_format: "webp",
    output_quality: 90
  };

  const output = await replicate.run("black-forest-labs/flux-schnell", {
    input,
  }) as [string];

  const url = output[0];
  const imageName = url.split('/')[4];

  const fileBody = await downloadFileBody(url);

  const result = await supabase.storage.from('images').upload(`${user_id}/${imageName}`, fileBody, {
    contentType: 'image/webp',
  });

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${result.data?.fullPath}`

  return imageUrl;
}

/**
 * Downloads a file from the provided URL and returns the file body as a buffer.
 * @param fileUrl - The URL of the file to download.
 * @returns A promise that resolves with the file content as a Buffer.
 */
function downloadFileBody(fileUrl: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(fileUrl);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    protocol.get(fileUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${fileUrl}' (${response.statusCode})`));
        return;
      }

      const data: Uint8Array[] = [];

      // Collect chunks of data
      response.on('data', (chunk) => {
        data.push(chunk);
      });

      // On end, resolve with the concatenated buffer
      response.on('end', () => {
        resolve(Buffer.concat(data));
      });

      response.on('error', (error) => {
        reject(error);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}
