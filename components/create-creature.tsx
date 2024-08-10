import { createSupabaseAppServerClient } from "@/lib/supabase/server-client";
import { LandingForm } from "./landing-form";

export default async function CreateCreature() {

  // 3. Fetch the number of creatures.
  const supabase = await createSupabaseAppServerClient();
  const { count, error } = await supabase
    .from('creatures')
    .select('*', { count: 'estimated' })

  if (error || !count) {
    console.error('Failed to get count of creatures:', error);
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center py-[12vh]">
      <h1 className="mb-3 text-4xl font-medium duration-1000 ease-in-out animate-in fade-in slide-in-from-bottom-3">
        Monster Lab
      </h1>
      <p className="mb-6 text-base text-center italic text-gray-400 duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4 max-w-lg">
        Describe your creature and we will generate a stat block for DnD 5e. Your creation could be a monster, a hero, or anything else you can imagine.
      </p>
      <p className="mb-6 text-base text-center text-gray-200 duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4 max-w-lg">
        {count} creatures created so far!
      </p>
      <div className="w-full max-w-md space-y-4 duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4" >
        <LandingForm/>
      </div>

    </div>
  );
}
