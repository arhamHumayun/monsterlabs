import {
  creaturesDocument,
  pronounsList,
  creatureSizeList,
  creatureDocumentSchema,
  editCreatureDocumentSchema,
  creatureTypesList
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
  DialogClose
} from '../ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { ScrollArea } from '../ui/scroll-area';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { updateCreature } from '@/app/actions';

const creatureFormSchema = editCreatureDocumentSchema;

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
      updated_at: new Date(),
    };

    const { data } = await updateCreature(updatedCreature);

    if (!data) {
      console.error('Failed to update creature');
      setIsLoading(false);
      return;
    }

    setCreatureObject(updatedCreature);

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
                        defaultValue={field.value}
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
                        defaultValue={field.value}
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
                        defaultValue={field.value}
                        placeholder="Appearance"
                        className="col-span-4"
                        {...field}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={creatureForm.control}
                  name="pronoun"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel className="text-right">Pronoun</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="col-span-4">
                            <SelectValue
                              placeholder={field.value}
                              id="pronoun"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pronounsList.map((pronoun) => (
                            <SelectItem key={pronoun} value={pronoun}>
                              {pronoun}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={creatureForm.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel htmlFor='size' className="text-right">Size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="col-span-4">
                            <SelectValue
                              placeholder={field.value}
                              id="size"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            creatureSizeList.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={creatureForm.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel htmlFor='type' className="text-right">Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="col-span-4">
                            <SelectValue
                              placeholder={field.value}
                              id="type"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            creatureTypesList.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={creatureForm.control}
                  name="hit_dice_amount"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel htmlFor="hit_dice_amount" className="text-right">
                        Hit Dice
                      </FormLabel>
                      <Input
                        id="hit_dice_amount"
                        type="number"
                        defaultValue={field.value}
                        placeholder="Amount of Hit Dice"
                        className="col-span-4"
                        {...register('hit_dice_amount', { valueAsNumber: true })}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={creatureForm.control}
                  name="is_unique"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel
                        htmlFor="is_unique"
                        className="text-right"
                      >
                        Unique
                      </FormLabel>
                      <Checkbox
                        id="is_unique"
                        checked={field.value ? field.value : false}
                        onCheckedChange={field.onChange}
                      />
                    </FormItem>
                  )}
                />``
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
