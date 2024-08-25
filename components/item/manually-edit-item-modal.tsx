import {
  itemTypesList,
  itemRarityList,
  itemsDocumentSchema,
  itemsDocument,
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
  const itemForm = useForm<z.infer<typeof itemsDocumentSchema>>({
    resolver: zodResolver(itemsDocumentSchema),
    defaultValues: itemObject,
  });

  async function onSubmitManualEdit(
    values: z.infer<typeof itemsDocumentSchema>
  ) {
    setIsLoading(true);

    const { data } = await updateItemToDB(values);

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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Make changes to your item here. Click save when {`you're`} done.
          </DialogDescription>
        </DialogHeader>
        <Form {...itemForm} aria-busy={isLoading}>
          <form onSubmit={itemForm.handleSubmit(onSubmitManualEdit)}>
            <fieldset disabled={isLoading}>
              <FormField
                control={itemForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="name" className="text-right">
                      Name
                    </FormLabel>
                    <Input
                      id="name"
                      defaultValue={itemObject.name}
                      placeholder="Item Name"
                      className="col-span-3"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3">
                          <SelectValue
                            placeholder={itemObject.type}
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
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subtype" className="text-right">
                      Subtype
                    </Label>
                    <Input
                      id="subtype"
                      defaultValue={itemObject.subtype}
                      placeholder="Subtype"
                      className="col-span-3"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
                name="weight"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="weight" className="text-right">
                      Weight
                    </FormLabel>
                    <Input
                      id="weight"
                      defaultValue={itemObject.weight}
                      placeholder="Weight"
                      className="col-span-3"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="description" className="text-right">
                      Description
                    </FormLabel>
                    <Input
                      id="description"
                      defaultValue={itemObject.description}
                      placeholder="Description"
                      className="col-span-3"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
                name="cost_amount"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="cost" className="text-right">
                      Cost
                    </FormLabel>
                    <Input
                      id="cost"
                      defaultValue={itemObject.cost_amount}
                      placeholder="Cost"
                      className="col-span-3"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
                name="rarity"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="rarity" className="text-right">
                      Rarity
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue
                          placeholder={itemObject.rarity}
                          id="rarity"
                        />
                      </SelectTrigger>
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
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel
                      htmlFor="requiresAttunement"
                      className="text-right"
                    >
                      Requires Attunement
                    </FormLabel>
                    <Checkbox
                      id="requiresAttunement"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
                name="requires_attunement_types"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel
                      htmlFor="requiresAttunementTypes"
                      className="text-right"
                    >
                      Attunement Restrictions
                    </FormLabel>
                    <div className="col-span-3">
                      {itemObject.requires_attunement_types.map(
                        (attunementRestriction) => (
                          <div 
                          key={attunementRestriction} 
                          className='flex items-center gap-2 mb-2'
                          >
                            <Input
                              defaultValue={attunementRestriction}
                              placeholder="Add attunement restrictions"
                              // {...field}
                            />
                            <Button variant="destructive"
                            className='p-2'
                              onClick={() => {
                                const newAttunementRestrictions = itemObject.requires_attunement_types.filter(
                                  (restriction) =>
                                    restriction !== attunementRestriction
                                );
                                setItemObject((prevState) => ({
                                  ...prevState,
                                  requires_attunement_types: newAttunementRestrictions,
                                }));
                              }}
                            ><X/></Button>
                          </div>
                        )
                      )}
                    </div>
                  </FormItem>
                )}
              />
            </fieldset>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
