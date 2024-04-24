'use client';

import { DeleteDaddyButton } from '@/components/blocks/daddiesList';
import EventLog from '@/components/blocks/eventLog';
import { Plus } from 'lucide-react';
import { NewDateButton } from '@/components/blocks/newDateDialog';
import { NewContactButton } from '@/components/blocks/newContactDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import animations from '@/constants/animations';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getErrorMessage } from '@/lib/utils';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  profileLink: z.string().optional(),
  contactInfo: z.string().optional(),
  location: z.string().optional(),
  messagingApp: z.string().optional(),
  notes: z.string().optional(),
  earningsEstimate: z.string().optional(),
  vibeRating: z.string(),
});

function DisplayForm({
  daddyData,
}: {
  daddyData: Doc<'daddies'>;
  edit: boolean;
}) {
  return (
    <motion.div {...animations.appearUp}>
      <Card className="p-6 flex flex-row gap-6">
        <div className="grow flex flex-col gap-6">
          <div className="space-y-1">
            <p>Name / Nickname</p>
            <p className="text-lg">{daddyData.name}</p>
          </div>
          <div className="space-y-1">
            <p>Profile Link</p>
            <p className="text-lg">{daddyData.profileLink || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p>Contact Info</p>
            <p className="text-lg">{daddyData.contactInfo || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p>Location</p>
            <p className="text-lg">{daddyData.location || 'N/A'}</p>
          </div>
        </div>
        <div className="grow flex flex-col gap-6">
          <div className="space-y-1">
            <p>Messaging App</p>
            <p className="text-lg">{daddyData.messagingApp || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p>Notes</p>
            <p className="text-lg">{daddyData.notes || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p>Earnings Estimate / Agreement per Date</p>
            <p className="text-lg">{`$${daddyData.earningsEstimate}`}</p>
          </div>
          <div className="space-y-1">
            <p>Vibe Rating</p>
            <p className="text-lg">{`${daddyData.vibeRating} / 5`}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function EditForm({
  daddyData,
  setEdit,
}: {
  daddyData: Doc<'daddies'>;
  edit: boolean;
  setEdit: (edit: boolean) => void;
}) {
  const updateDaddy = useMutation(api.daddies.updateDaddy);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      ...daddyData,
      vibeRating: daddyData.vibeRating.toString(),
      earningsEstimate: daddyData.earningsEstimate?.toString() || '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const formattedValues = {
      ...values,
      earningsEstimate: Number(values.earningsEstimate || '0'),
      vibeRating: Number(values.vibeRating),
    };

    try {
      const daddyId = updateDaddy({ daddy: daddyData._id, ...formattedValues });
      setEdit(false);
      form.reset();
      toast.success(`${values.name} updated !`);
      return daddyId;
    } catch (error) {
      toast.error(`Uh oh ! Something went wrong: ${getErrorMessage(error)}`);
    }
  }

  return (
    <motion.div {...animations.appearUp}>
      <Card className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-row gap-6">
              <div className="grow flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>Daddy&apos;s Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name or nickname..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profileLink"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>Profile Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Link to Daddy's profile..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                control={form.control}
                name="imgUrl"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Link to Daddy's image..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>Contact Info</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact info..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Location..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grow flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="messagingApp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Messaging App</FormLabel>
                      <FormControl>
                        <Input placeholder="Messaging app..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="earningsEstimate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Earnings Estimate / Agreement per Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Earnings estimate..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vibeRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vibe Rating (min: 1, max: 5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          placeholder="Vibe rating..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row items-end justify-end gap-2 grow">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEdit(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={!form.formState.isDirty}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}

function DaddyDisplayOrEditForm({
  daddyData,
  edit,
  setEdit,
}: {
  daddyData: Doc<'daddies'>;
  edit: boolean;
  setEdit: (edit: boolean) => void;
}) {
  return edit ? (
    <EditForm daddyData={daddyData} edit={edit} setEdit={setEdit} />
  ) : (
    <DisplayForm daddyData={daddyData} edit={edit} />
  );
}

export default function DaddyPage({
  params,
}: {
  params: { id: Id<'daddies'> };
}) {
  const daddyData = useQuery(api.daddies.getDaddy, {
    daddy: params.id,
  });
  const router = useRouter();
  const [edit, setEdit] = useState(false);

  function goBack() {
    router.back();
  }

  if (!daddyData) return null;

  const { daddy, contacts, dates } = daddyData;
  if (!daddy) return null;
  return (
    <div className="flex w-full h-full flex-col">
      <div
        onClick={goBack}
        className="text-md text-slate-700 cursor-pointer flex flex-row gap-1 items-center mb-4"
      >
        <ChevronLeft size={24} />
        Back
      </div>
      <div className="flex flex-col md:grid md:grid-cols-3 xl:grid-cols-4 h-full gap-6">
        <div className="md:col-span-2 xl:col-span-3 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex flex-row items-center gap-4">
                  <Avatar className="hidden h-12 w-12 sm:flex">
                    <AvatarImage src={daddy.imgUrl || ''} alt="Avatar" />
                    <AvatarFallback>{daddy.name.split('')[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">{daddy?.name}</h1>
                    <p>
                      {dates.length || 0} Dates - {contacts.length || 0}{' '}
                      Contacts
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  {!edit && (
                    <NewDateButton daddyId={daddy._id}>
                      <Plus size={16} className="mr-1" /> Date
                    </NewDateButton>
                  )}
                  {!edit && (
                    <NewContactButton daddyId={daddy._id}>
                      <Plus size={16} className="mr-1" /> Contact
                    </NewContactButton>
                  )}

                  <Button
                    onClick={() => setEdit(editStatus => !editStatus)}
                    disabled={edit}
                    size="sm"
                  >
                    EDIT
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
          <DaddyDisplayOrEditForm
            daddyData={daddy}
            edit={edit}
            setEdit={setEdit}
          />
        </div>

        <div className="h-full flex flex-col md:justify-between gap-6">
          <EventLog contacts={contacts} dates={dates} />
          <Card className="border-destructive shadow-md">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <DeleteDaddyButton daddy={daddy._id} name={daddy.name} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
