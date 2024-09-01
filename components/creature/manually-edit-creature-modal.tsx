import {
  creaturesDocument,
  creatureSchemaTypeToCreatureDocument,
} from '@/types/db/creature';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { ScrollArea } from '../ui/scroll-area';
import { creatureSchema } from '@/types/creature';
import { Form, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { DialogClose } from '@radix-ui/react-dialog';

const creatureFormSchema = creatureSchema.partial();
export default function ManuallyEditCreatureModal({
  creatureObject,
  setCreatureObject,
  isLoading,
  setIsLoading,
}: {
  creatureObject: creaturesDocument;
  setCreatureObject: (
    newState:
      | creaturesDocument
      | ((prevState: creaturesDocument) => creaturesDocument)
  ) => void;
  isLoading: boolean;
  setIsLoading: (newState: boolean) => void;
}) {
  const creatureForm = useForm<z.infer<typeof creatureFormSchema>>({
    resolver: zodResolver(creatureFormSchema),
    defaultValues: creatureObject,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = creatureForm;

  async function onSubmitManualEdit(values: z.infer<typeof creatureFormSchema>) {
    setIsLoading(true);

    const updatedCreature = {
      ...creatureObject,
      ...values,
    };

    console.log('updatedCreature', updatedCreature);

    setIsLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4 w-full">
          Edit creature Manually
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px]">
        <ScrollArea className="h-96">
          <DialogHeader>
            <DialogTitle>Edit creature</DialogTitle>
            <DialogDescription>
              Make changes to your creature here. Click save when {`you're`}{' '}
              done.
            </DialogDescription>
          </DialogHeader>
          <Form {...creatureForm} aria-busy={isLoading}>
            <form onSubmit={handleSubmit(onSubmitManualEdit)} className="pr-6">
              <fieldset disabled={isLoading}>
                <FormField
                  control={creatureForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel htmlFor="name" className="text-right">
                        Name
                      </FormLabel>
                      <Input
                        id="name"
                        defaultValue={creatureObject.name}
                        placeholder="Item Name"
                        className="col-span-4"
                        {...field}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={creatureForm.control}
                  name="lore"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel htmlFor="lore" className="text-right">
                        Lore
                      </FormLabel>
                      <Input
                        id="lore"
                        defaultValue={creatureObject.lore}
                        placeholder="Lore"
                        className="col-span-4"
                        {...field}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={creatureForm.control}
                  name="appearance"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel htmlFor="appearance" className="text-right">
                        Appearance
                      </FormLabel>
                      <Input
                        id="appearance"
                        defaultValue={creatureObject.appearance}
                        placeholder="Appearance"
                        className="col-span-4"
                        {...field}
                      />
                    </FormItem>
                  )}
                />
              </fieldset>
              <DialogFooter className='pt-2'>
                <DialogClose asChild>
                  <Button type="submit">Save changes</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
