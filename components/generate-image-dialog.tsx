'use client';

import {
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useEffect, useRef, useState } from 'react';
import { generateImageFromReplicate } from '@/app/actions';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Separator } from './ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner';
import LimitReachInnerToast from './limit-reach-inner-toast';
import { useRouter } from 'next/navigation';
import { getOneMonthAgoDate } from '@/lib/utils';

const formSchema = z.object({
  prompt: z.string(),
});

export default function GenerateImageDialog({
  type,
  name,
  thingId,
  setCurrentImageUrl,
  additionalDescription,
}: {
  type: 'creature' | 'item';
  name: string;
  thingId: number;
  setCurrentImageUrl: (url: string) => void;
  additionalDescription?: string;
}) {
  const thingTable = `${type}s`;
  const imageTable = `${type}_images`;
  const imageTableId = `${type}_id` as 'creature_id' | 'item_id';

  const prefill = `${
    type === 'creature' ? 'Fantasy creature' : 'Magic item'
  } ${name}. Digital illustration in the fantasy art style. ${additionalDescription ?? ''}`;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(prefill);
  const [isLoading, setIsLoading] = useState(false);
  const [thingImageUrls, setThingImageUrls] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const router = useRouter();

  const supabase = createSupabaseBrowserClient();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase
        .from(imageTable)
        .select('url')
        .eq(imageTableId, thingId);

      if (error) {
        console.error('Failed to fetch images:', error);
      }

      const urls = data?.map((image : { 
        url: string;
      }) => image.url as string) ?? [];

      if (data) {
        setThingImageUrls(urls);
      }
    }

    fetchImages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to auto
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scroll height
    }
  }, [value]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: prefill,
    },
  });

  async function onFormSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data) {
      console.error('Failed to get user:', error);
      return;
    }

    const user_id = data.user.id;

    if (data.user.is_anonymous) {
      toast('You must be signed in to generate images.');
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user_id)
      .single();

    if (profileError) {
      console.error('Failed to get user profile:', profileError);
      return;
    }

    if (!profileData) {
      console.error('No user profile found.');
      return;
    }

    const role = profileData.role as string;

    // Check if user is over limit
    const { count } = await supabase
      .from('events')
      .select('id', { count: 'exact' })
      .eq('user_id', user_id)
      .eq('event_type', `image_created`)
      .gte('created_at', getOneMonthAgoDate().toISOString());

    const maxAllowedPerMonth = role === 'free' ? 3 : 300;

    if (count && count >= maxAllowedPerMonth) {
      toast(
        LimitReachInnerToast({
          text: `You have reached the limit of ${maxAllowedPerMonth} image generations this month. Please upgrade to continue!`,
          router,
        })
      );
      return;
    }

    setIsLoading(true);

    // Call API to generate image
    const url = await generateImageFromReplicate(values.prompt, user_id);

    setCurrentImageUrl(url);

    await Promise.all([
      supabase
        .from(thingTable)
        .update({
          main_image_url: url,
          updated_at: new Date(),
        })
        .eq('id', thingId),
      supabase.from(imageTable).insert([
        {
          [imageTableId]: thingId,
          created_at: new Date(),
          user_id,
          url,
        },
      ]),
    ]);

    setThingImageUrls((prev) => [...prev, url]);

    setIsLoading(false);

    // close dialog
    setOpen(false);
  }

  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4 w-full">
          Generate a picture!
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded'>
        <DialogHeader>
          <DialogTitle>Generate a picture for your {type}</DialogTitle>
          <DialogDescription>
            This will generate a picture for your {type} based on the name and
            description you provided. Edit the prompt below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl
                    className='h-max'
                  >
                    <textarea
                      ref={textareaRef}
                      placeholder="Enter your prompt here..."
                      className="resize-none overflow-auto w-full text-start text-sm p-2 border rounded-lg custom-scrollbar h-32"
                      value={value}
                      defaultValue={prefill}
                      onChange={(e) => {
                        handleChange(e);
                        field.onChange(e); // Ensure form control updates
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" aria-disabled={isLoading}>
              Submit{' '}
              {isLoading ? <Loader2 className="ml-2 animate-spin" /> : null}
            </Button>
          </form>
        </Form>

        {thingImageUrls.length > 1 ? (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">
              Previously generated images
            </h2>
            <Separator className="mb-2" />
            <div className="grid grid-cols-3 gap-2">
              {thingImageUrls.map((url, i) => (
                <Popover key={i}>
                  <PopoverTrigger asChild>
                    <Image
                      src={url}
                      width={1024}
                      height={1024}
                      alt={`Generated image ${i}`}
                      className="rounded-lg w-full h-auto hover:border-2 hover:border-blue-500"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit">
                    <div className="flex flex-row gap-2">
                      <Button
                        onClick={async () => {
                          await supabase
                            .from(thingTable)
                            .update({
                              main_image_url: url,
                              updated_at: new Date(),
                            })
                            .eq('id', thingId);
                          setCurrentImageUrl(url);
                          toast('Set as main image.');
                        }}
                      >
                        Set as main image
                      </Button>
                      <Button
                        variant={'secondary'}
                        onClick={() => {
                          window.open(url, '_blank');
                        }}
                      >
                        View full size
                      </Button>
                      <Button
                        variant={'destructive'}
                        onClick={async () => {
                          await supabase
                            .from(imageTable)
                            .delete()
                            .eq('url', url);
                          setThingImageUrls((prev) =>
                            prev.filter((prevUrl) => prevUrl !== url)
                          );
                          toast('Deleted image.');
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
