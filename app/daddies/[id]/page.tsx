'use client';

import {
  ArchiveDaddyButton,
  DeleteDaddyButton,
} from '@/components/blocks/daddiesList';
import { AddAllowancePlanButton } from '@/components/blocks/newAllowancePlanDialog';
import EventLog from '@/components/blocks/eventLog';
import { NewContactButton } from '@/components/blocks/newContactDialog';
import { NewDateButton } from '@/components/blocks/newDateDialog';
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
import {
  ActionMenu,
  ActionTrigger,
  ActionItems,
  ActionItem,
} from '@/components/animations/actionMenu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import animations, { staggerUp } from '@/constants/animations';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Markdown from 'react-markdown';
import { z } from 'zod';

import Tiptap from '@/components/blocks/tiptap';
import { Separator } from '@/components/ui/separator';
import { getErrorMessage } from '@/lib/utils';
import { toast } from 'sonner';
import { staggerUp as stagger } from '@/constants/animations';

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
  giftingMethod: z.string().optional(),
  vibeRating: z.string(),
});

function DisplayForm({
  daddyData,
}: {
  daddyData: Doc<'daddies'>;
  edit: boolean;
}) {
  return (
    <motion.div>
      <Card className="p-6 grid md:grid-cols-2 gap-6">
        <motion.div
          className="grow flex flex-col gap-6"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={stagger}>
            <div className="space-y-1">
              <p className="font-bold text-lg">Name / Nickname</p>
              <Separator className="bg-primary/50" />
              <p className="pt-2">{daddyData.name}</p>
            </div>
          </motion.div>
          <motion.div variants={stagger}>
            <div className="space-y-1">
              <p className="font-bold text-lg">Profile Link</p>
              <Separator className="bg-primary/50" />

              {daddyData.profileLink ? (
                <a
                  className="block pt-2 underline"
                  href={daddyData.profileLink}
                >
                  {daddyData.profileLink}
                </a>
              ) : (
                <p className="pt-2">N/A</p>
              )}
            </div>
          </motion.div>
          <motion.div variants={stagger}>
            <div className="space-y-1">
              <p className="font-bold text-lg">Gifting Method</p>
              <Separator className="bg-primary/50" />
              <p className="pt-2">{daddyData.giftingMethod || 'N/A'}</p>
            </div>
          </motion.div>
          <motion.div variants={stagger}>
            <div className="space-y-1">
              <p className="font-bold text-lg">Contact Info</p>
              <Separator className="bg-primary/50" />
              <p className="pt-2">{daddyData.contactInfo || 'N/A'}</p>
            </div>
          </motion.div>
          <motion.div variants={stagger}>
            <div className="space-y-1">
              <p className="font-bold text-lg">Location</p>
              <Separator className="bg-primary/50" />
              <p className="pt-2">{daddyData.location || 'N/A'}</p>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          className="grow flex flex-col gap-6"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={stagger}>
            <div className="space-y-1">
              <p className="font-bold text-lg">Messaging App</p>
              <Separator className="bg-primary/50" />
              <p className="pt-2">{daddyData.messagingApp || 'N/A'}</p>
            </div>
          </motion.div>
          <motion.div variants={stagger}>
            <div className="space-y-1">
              <p className="font-bold text-lg">Notes</p>
              <Separator className="bg-primary/50" />
              <Markdown className="pt-2">
                {daddyData.notes || 'No notes about this daddy yet'}
              </Markdown>
            </div>
          </motion.div>
          <motion.div variants={stagger}>
            <div className="space-y-1">
              <p className="font-bold text-lg">
                Earnings Estimate / Agreement per Date
              </p>
              <Separator className="bg-primary/50" />
              <p className="pt-2">
                {daddyData.earningsEstimate
                  ? `$${daddyData.earningsEstimate}`
                  : 'N/A'}
              </p>
            </div>
          </motion.div>
          <motion.div variants={stagger}>
            <div className="space-y-1">
              <p className="font-bold text-lg">Vibe Rating</p>
              <Separator className="bg-primary/50" />
              <p className="pt-2">{`${daddyData.vibeRating} / 5`}</p>
            </div>
          </motion.div>
        </motion.div>
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
    <motion.div>
      <Card className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                className="grow flex flex-col gap-6"
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={stagger}>
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
                </motion.div>
                <motion.div variants={stagger}>
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
                </motion.div>
                <motion.div variants={stagger}>
                  <FormField
                    control={form.control}
                    name="giftingMethod"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormLabel>Gifting Method</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <motion.div variants={stagger}>
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
                </motion.div>
                <motion.div variants={stagger}>
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
                </motion.div>
              </motion.div>
              <motion.div
                className="grow flex flex-col gap-6"
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={stagger}>
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
                </motion.div>
                <motion.div variants={stagger}>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Tiptap
                            content={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <motion.div variants={stagger}>
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
                </motion.div>
                <motion.div variants={stagger}>
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
                </motion.div>
              </motion.div>
            </div>
            <div className="flex flex-row items-end justify-end gap-2 grow">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEdit(false)}
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={!form.formState.isDirty}
              >
                SAVE
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

  function allowanceQueryParams() {
    if (daddyData?.daddy?.allowance) {
      return { allowance: daddyData.daddy.allowance };
    }
    return 'skip';
  }

  const allowanceData = useQuery(
    api.allowances.getAllowance,
    allowanceQueryParams(),
  );

  function goBack() {
    router.push('/daddies');
  }

  if (!daddyData) return null;

  const { daddy, contacts, dates } = daddyData;
  if (!daddy) return null;

  console.log({ daddy });
  return (
    <div className="flex w-full h-full flex-col">
      {/* <div
        onClick={goBack}
        className="text-md text-slate-700 cursor-pointer flex flex-row gap-1 items-center mb-4 w-fit"
      >
        <ChevronLeft size={24} />
        Back
      </div> */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList className="md:text-xl font-semibold text-foreground">
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/daddies"
              className="hover:underline decoration-primary"
            >
              Daddies
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{daddy.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col md:grid md:grid-cols-3 xl:grid-cols-4 h-full gap-6">
        <div className="md:col-span-2 xl:col-span-3 flex flex-col gap-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex flex-row items-center gap-4">
                  <Avatar className="hidden h-10 w-10 sm:flex">
                    <AvatarImage src={daddy.imgUrl || ''} alt="Avatar" />
                    <AvatarFallback>{daddy.name.split('')[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    {/* <h1 className="text-2xl font-semibold">{daddy?.name}</h1> */}
                    <p className="text-xl font-semibold">
                      {dates.length || 0} Dates - {contacts.length || 0}{' '}
                      Contacts
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <ActionMenu>
                    <ActionTrigger>ACTIONS</ActionTrigger>
                    <ActionItems>
                      <ActionItem>
                        <Button
                          onClick={() => setEdit(editStatus => !editStatus)}
                          disabled={edit}
                          size="sm"
                        >
                          <Pencil size={14} className="mr-2" />
                          EDIT INFO
                        </Button>
                      </ActionItem>
                      <ActionItem>
                        <NewDateButton daddyId={daddy._id}>
                          <Plus size={16} className="mr-1" /> ADD DATE
                        </NewDateButton>
                      </ActionItem>
                      <ActionItem>
                        <NewContactButton daddyId={daddy._id}>
                          <Plus size={16} className="mr-1" /> ADD CONTACT
                        </NewContactButton>
                      </ActionItem>
                    </ActionItems>
                  </ActionMenu>

                  {/* {!edit && (
                    <NewDateButton daddyId={daddy._id}>
                      <Plus size={16} className="mr-1" /> ADD DATE
                    </NewDateButton>
                  )} */}
                  {/* {!edit && (
                    <NewContactButton daddyId={daddy._id}>
                      <Plus size={16} className="mr-1" /> ADD CONTACT
                    </NewContactButton>
                  )} */}

                  {/* <Button
                    onClick={() => setEdit(editStatus => !editStatus)}
                    disabled={edit}
                    size="sm"
                  >
                    EDIT
                  </Button> */}
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

        <div className="h-full flex flex-col md:justify-between gap-2">
          <AddAllowancePlanButton daddy={daddy} allowance={allowanceData}>
            <Plus size={16} className="mr-1" /> START ALLOWANCE PLAN
          </AddAllowancePlanButton>
          <EventLog contacts={contacts} dates={dates} />
          <Card className="border-destructive shadow-md">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <ArchiveDaddyButton daddy={daddy._id} name={daddy.name} />
              <DeleteDaddyButton daddy={daddy._id} name={daddy.name} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
