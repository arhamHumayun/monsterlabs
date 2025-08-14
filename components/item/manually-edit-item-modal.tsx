import {
  itemTypesList,
  itemRarityList,
  itemsDocument,
  editItemDocumentSchema,
} from '@/types/db/item';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { updateItem as updateItemToDB } from '@/app/actions';
import { X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const itemFormSchema = editItemDocumentSchema;

export default function ManuallyEditItemModal({
  itemObject,
  setItemObject,
  isLoading,
  setIsLoading,
}: {
  itemObject: itemsDocument;
  setItemObject: (
    newState: itemsDocument | ((prevState: itemsDocument) => itemsDocument)
  ) => void;
  isLoading: boolean;
  setIsLoading: (newState: boolean) => void;
}) {
  const itemForm = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: itemObject,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = itemForm;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'paragraphs',
    shouldUnregister: true,
  });

  async function onSubmitManualEdit(values: z.infer<typeof itemFormSchema>) {
    setIsLoading(true);

    const updatedItem = {
      ...itemObject,
      ...values,
      updated_at: new Date(),
    };

    const { data } = await updateItemToDB(updatedItem);

    if (data) {
      setItemObject(data);
      toast('Item updated.');
    } else {
      console.error('Failed to fetch item data');
    }

    setIsLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4 w-full">
          Edit Item Manually
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px]">
        <ScrollArea className="h-96">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Make changes to your item here. Click save when {`you're`} done.
            </DialogDescription>
          </DialogHeader>
          <Form {...itemForm} aria-busy={isLoading}>
            <form onSubmit={handleSubmit(onSubmitManualEdit)} className="pr-6">
              <fieldset disabled={isLoading}>
                <FormField
                  control={itemForm.control}
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
                  control={itemForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel className="text-right">Type</FormLabel>
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
                          {itemTypesList.map((type) => (
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
                  control={itemForm.control}
                  name="subtype"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <Label htmlFor="subtype" className="text-right">
                        Subtype
                      </Label>
                      <Input
                        id="subtype"
                        defaultValue={
                          field.value ? field.value : ''
                        }
                        placeholder="Subtype"
                        className="col-span-4"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={itemForm.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel htmlFor="weight" className="text-right">
                        Weight
                      </FormLabel>
                      <Input
                        id="weight"
                        type="number"
                        defaultValue={field.value}
                        placeholder="Weight"
                        className="col-span-4"
                        {...register('weight', { valueAsNumber: true })}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={itemForm.control}
                  name="cost_amount"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel htmlFor="cost" className="text-right">
                        Cost
                      </FormLabel>
                      <Input
                        id="cost"
                        type="number"
                        defaultValue={field.value}
                        placeholder="Cost in GP"
                        className="col-span-4"
                        {...register('cost_amount', { valueAsNumber: true })}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={itemForm.control}
                  name="rarity"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel htmlFor="rarity" className="text-right">
                        Rarity
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="col-span-4">
                            <SelectValue
                              placeholder={field.value}
                              id="rarity"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {itemRarityList.map((rarity) => (
                            <SelectItem key={rarity} value={rarity}>
                              {rarity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={itemForm.control}
                  name="requires_attunement"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel
                        htmlFor="requires_attunement"
                        className="text-right"
                      >
                        Requires Attunement
                      </FormLabel>
                      <Checkbox
                        id="requires_attunement"
                        checked={field.value ? field.value : false}
                        onCheckedChange={field.onChange}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={itemForm.control}
                  name="requires_attunement_specific"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel
                        htmlFor="requires_attunement_specific"
                        className="text-right"
                      >
                        Attunement Restrictions
                      </FormLabel>
                      <Input
                        id="requires_attunement_specific"
                        defaultValue={
                          field.value
                            ? field.value
                            : ''
                        }
                        placeholder="requires attunement by a ..."
                        className="col-span-4"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={itemForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                      <FormLabel htmlFor="description" className="text-right">
                        Description
                      </FormLabel>
                      <Input
                        id="description"
                        defaultValue={field.value}
                        placeholder="Description"
                        className="col-span-4"
                      />
                    </FormItem>
                  )}
                />
                {fields.map((paragraph, index) => (
                  <FormField
                    control={itemForm.control}
                    name={`paragraphs.${index}`}
                    key={index}
                    render={({ field }) => (
                      <div className="border p-4 rounded my-2">
                        <FormItem className="grid grid-cols-6 items-center gap-4">
                          <FormLabel
                            htmlFor={`paragraphs.${index}.title`}
                            className="text-right"
                          >
                            Heading
                          </FormLabel>
                          <Input
                            type="text"
                            defaultValue={paragraph.title}
                            placeholder="Title"
                            className="col-span-5"
                            {...register(`paragraphs.${index}.title` as const)}
                          />
                        </FormItem>
                        <FormItem className="grid grid-cols-6 items-center gap-4">
                          <FormLabel
                            htmlFor={`paragraphs.${index}.content`}
                            className="text-right"
                          >
                            Content
                          </FormLabel>
                          <Input
                            type="text"
                            defaultValue={paragraph.content}
                            placeholder="Content"
                            className="col-span-5"
                            {...register(
                              `paragraphs.${index}.content` as const
                            )}
                          />
                          <Button
                            variant="outline"
                            onClick={() => remove(index)}
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
                  onClick={() => append({ title: '', content: '' })}
                >
                  Add Section +
                </div>
              </fieldset>
              <DialogFooter>
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
