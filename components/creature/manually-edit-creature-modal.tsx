import {
  creaturesDocument,
  pronounsList,
  creatureSizeList,
  editCreatureDocumentSchema,
  creatureTypesList,
  creatureAlignmentList,
} from '@/types/db/creature';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { ScrollArea } from '../ui/scroll-area';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { updateCreature } from '@/app/actions';
import { statsList } from '@/types/creature';
import { X } from 'lucide-react';
import { Separator } from '../ui/separator';

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
    defaultValues: {
      ...creatureObject,
      challenge_rating: creatureObject.challenge_rating / 100,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = creatureForm;

  const {
    fields: traitFields,
    append: traitAppend,
    remove: traitRemove,
  } = useFieldArray({
    control,
    name: 'json.traits',
    shouldUnregister: true,
  });

  const {
    fields: reactionFields,
    append: reactionAppend,
    remove: reactionRemove,
  } = useFieldArray({
    control,
    name: 'json.reactions',
    shouldUnregister: true,
  });

  async function onSubmitManualEdit(
    values: z.infer<typeof creatureFormSchema>
  ) {
    setIsLoading(true);

    const updatedCreature: creaturesDocument = {
      ...creatureObject,
      ...values,
      updated_at: new Date(),
      challenge_rating: values.challenge_rating * 100,
    };

    const { data } = await updateCreature(updatedCreature);

    if (data) {
      setCreatureObject(data);
      toast('Creature updated.');
    } else {
      console.error('Failed to update creature.');
    }

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
                      <FormLabel htmlFor="size" className="text-right">
                        Size
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="col-span-4">
                            <SelectValue placeholder={field.value} id="size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {creatureSizeList.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
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
                  name="type"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel htmlFor="type" className="text-right">
                        Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="col-span-4">
                            <SelectValue placeholder={field.value} id="type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {creatureTypesList.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
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
                  name="alignment"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel htmlFor="alignment" className="text-right">
                        Alignment
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="col-span-4">
                            <SelectValue
                              placeholder={field.value}
                              id="alignment"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {creatureAlignmentList.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
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
                  name="hit_dice_amount"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel
                        htmlFor="hit_dice_amount"
                        className="text-right"
                      >
                        Hit Dice
                      </FormLabel>
                      <Input
                        id="hit_dice_amount"
                        type="number"
                        defaultValue={field.value}
                        placeholder="Amount of Hit Dice"
                        className="col-span-4"
                        {...register('hit_dice_amount', {
                          valueAsNumber: true,
                        })}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={creatureForm.control}
                  name="challenge_rating"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel
                        htmlFor="challenge_rating"
                        className="text-right"
                      >
                        Challenge Rating
                      </FormLabel>
                      <Input
                        id="challenge_rating"
                        type="number"
                        defaultValue={field.value}
                        placeholder="Challenge Rating"
                        className="col-span-4"
                        {...register('challenge_rating', {
                          valueAsNumber: true,
                        })}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={creatureForm.control}
                  name="json.actions.multiAttack"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel htmlFor="appearance" className="text-right">
                        Multiattack
                      </FormLabel>
                      <Input
                        id="json.actions.multiAttack"
                        defaultValue={field.value}
                        placeholder="Multiattack sentence"
                        className="col-span-4"
                        {...field}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={creatureForm.control}
                  name="json.stats"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4 mb-2">
                      <FormLabel htmlFor="json" className="text-right">
                        Stats
                      </FormLabel>
                      <div className="grid grid-cols-3 col-span-4 w-max">
                        {statsList.map((stat) => (
                          <div key={stat} className="pr-4 flex flex-row">
                            <FormLabel
                              htmlFor={stat}
                              className="basis-1/5 pr-2 text-center"
                            >
                              {stat.slice(0, 3).toUpperCase()}
                            </FormLabel>
                            <Input
                              id={stat}
                              type="number"
                              defaultValue={field.value[stat]}
                              placeholder={stat}
                              className="max-w-20"
                              {...register(`json.stats.${stat}`, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={creatureForm.control}
                  name="is_unique"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel htmlFor="is_unique" className="text-right">
                        Unique
                      </FormLabel>
                      <Checkbox
                        id="is_unique"
                        checked={field.value ? field.value : false}
                        onCheckedChange={field.onChange}
                      />
                    </FormItem>
                  )}
                />
                <Separator className="my-4" />
                <h1 className="text-xl font-semibold mt-4">Traits:</h1>
                {traitFields.map((trait, index) => (
                  <FormField
                    control={creatureForm.control}
                    name={`json.traits.${index}`}
                    key={index}
                    render={({ field }) => (
                      <div className="border p-4 rounded my-2">
                        <FormItem className="grid grid-cols-6 items-center gap-4">
                          <FormLabel
                            htmlFor={`json.traits.${index}.name`}
                            className="text-right"
                          >
                            Name
                          </FormLabel>
                          <Input
                            type="text"
                            defaultValue={trait.name}
                            placeholder="Title"
                            className="col-span-5"
                            {...register(`json.traits.${index}.name` as const)}
                          />
                        </FormItem>
                        <FormItem className="grid grid-cols-6 items-center gap-4">
                          <FormLabel
                            htmlFor={`paragraphs.${index}.content`}
                            className="text-right"
                          >
                            Description
                          </FormLabel>
                          <Input
                            type="text"
                            defaultValue={trait.description}
                            placeholder="Content"
                            className="col-span-5"
                            {...register(
                              `json.traits.${index}.description` as const
                            )}
                          />
                          <Button
                            variant="outline"
                            onClick={() => traitRemove(index)}
                            className="col-span-6"
                          >
                            <X />
                          </Button>
                        </FormItem>
                      </div>
                    )}
                  />
                ))}
                <div
                  className="w-full mb-2 rounded-lg border p-2 cursor-pointer font-semibold text-sm text-center"
                  onClick={() => traitAppend({ name: '', description: '' })}
                >
                  Add Trait +
                </div>
                <Separator className="my-4" />
                <h1 className="text-xl font-semibold mt-4">Reactions:</h1>
                {reactionFields.map((reaction, index) => (
                  <FormField
                    control={creatureForm.control}
                    name={`json.reactions.${index}`}
                    key={index}
                    render={({ field }) => (
                      <div className="border p-4 rounded my-2">
                        <FormItem className="grid grid-cols-6 items-center gap-4">
                          <FormLabel
                            htmlFor={`json.reactions.${index}.name`}
                            className="text-right"
                          >
                            Name
                          </FormLabel>
                          <Input
                            type="text"
                            defaultValue={reaction.name}
                            placeholder="Title"
                            className="col-span-5"
                            {...register(`json.reactions.${index}.name` as const)}
                          />
                        </FormItem>
                        <FormItem className="grid grid-cols-6 items-center gap-4">
                          <FormLabel
                            htmlFor={`paragraphs.${index}.content`}
                            className="text-right"
                          >
                            Description
                          </FormLabel>
                          <Input
                            type="text"
                            defaultValue={reaction.description}
                            placeholder="Content"
                            className="col-span-5"
                            {...register(
                              `json.reactions.${index}.description` as const
                            )}
                          />
                          <Button
                            variant="outline"
                            onClick={() => reactionRemove(index)}
                            className="col-span-6"
                          >
                            <X />
                          </Button>
                        </FormItem>
                      </div>
                    )}
                  />
                ))}
                <div
                  className="w-full mb-2 rounded-lg border p-2 cursor-pointer font-semibold text-sm text-center"
                  onClick={() => reactionAppend({ name: '', description: '' })}
                >
                  Add Reaction +
                </div>
                {errors && (
                  <FormMessage>
                    {Object.values(errors).map((error) => (
                      <p key={error.message}>{error.message}</p>
                    ))}
                  </FormMessage>
                )}
              </fieldset>
              <DialogFooter className="pt-2">
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
