import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { Stripe, loadStripe } from '@stripe/stripe-js';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const doToast = (message: string) => {
  toast(message);
};

export function capitalizeFirstLetters(str: string[]): string[] {
  return str.map((s) => s.charAt(0).toUpperCase() + s.slice(1));
}

let stripePromise: Promise<Stripe | null>;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export function getOneMonthAgoDate() {
  let oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return oneMonthAgo;
}