import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const doToast = (message: string) => {
  toast(message);
};

export function capitalizeFirstLetters(str: string[]): string[] {
  return str.map((s) => s.charAt(0).toUpperCase() + s.slice(1));
}
