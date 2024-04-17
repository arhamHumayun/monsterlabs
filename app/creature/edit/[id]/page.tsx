import { getCreatureById, getUser } from '@/app/actions';
import { EditCreature } from '@/components/edit-creature';

export default async function EditMonster({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const creature = await getCreatureById(id);

  if (!creature) {
    return (
      <div>
        <h1>Creature not found</h1>
      </div>
    );
  }

  const user = await getUser();
  const userId = user?.id;

  if (!userId || creature.user_id !== userId) {
    return (
      <div>
        <h1>You do not have access to edit this creature</h1>
      </div>
    );
  }

  return (
    <div>
      <EditCreature creature={creature.json} creatureId={id} />
    </div>
  );
}
