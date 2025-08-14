"use client"

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogContent, AlertDialogDescription, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel  } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { handleUnsubscribe } from "@/app/actions";

export default function CancelSubscriptionButton({
  userId,
  subscriptionId
}: {
  userId: string;
  subscriptionId: string;
}) {
  const supabase = createSupabaseBrowserClient();

  const handleUnsubscribeEvent = async () => {
    await supabase.from('profiles').update({ role: 'free', subscription_status: 'cancelled' }).eq('user_id', userId);

    const {
      success,
      error
    } = await handleUnsubscribe(subscriptionId);

    if (success) {
      window.location.reload();
    } else {
      console.error('Failed to unsubscribe:', error);
      alert(`Failed to unsubscribe ${JSON.stringify(error)}`);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='ghost'>Unsubscribe from Pro Plan</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
          Are you absolutely sure you want to unsubscribe from the pro plan? You{`'`}ll lose access to all the pro features and your account will be downgraded to the free plan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUnsubscribeEvent}>Unsubscribe</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
