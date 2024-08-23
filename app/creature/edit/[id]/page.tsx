import { EditCreature } from '@/components/creature/edit-creature';
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client';
import { creaturesDocument } from '@/types/db/creature';

export default async function EditMonster({
  params,
}: {
  params: { id: number };
}) {
  const { id } = params;

  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('creatures')
    .select(`*`)
    .eq('id', id)
    .limit(1)
    .single();

  if (error || !data || data.length === 0) {
    console.error('Failed to get creature by id:', error);
    return (
      <div>
      <h1>Creature not found</h1>
    </div>
    );
  }

  const { 
    data: getUserData,
  } = await supabase.auth.getUser()
  const userId = getUserData.user?.id;

  const creature = data as creaturesDocument;

  if (!userId || creature.user_id !== userId) {
    return (
      <div>
        <h1>You do not have access to edit this creature</h1>
      </div>
    );
  }

  return (
    <div>
      <EditCreature creature={creature} user={getUserData.user} />
    </div>
  );
}
