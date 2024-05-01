'use client';

import Tiptap from '@/components/blocks/tiptap';
import { AddToCalendarButton } from '@/components/blocks/addToCalendarButton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { TimePicker } from '@/components/ui/time-picker';
import animations from '@/constants/animations';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { cn, getErrorMessage } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'convex/react';
import { format, formatDistance } from 'date-fns';
import { motion } from 'framer-motion';
import {
  CalendarFold,
  Calendar as CalendarIcon,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Markdown from 'react-markdown';
import { toast } from 'sonner';
import { z } from 'zod';
import { staggerUp as stagger } from '@/constants/animations';
import { DateStatusSelector } from '@/components/blocks/dateStatusSelector';

const formSchema = z.object({
  date: z.date(),
  location: z.string().optional(),
  dateDuration: z.string().optional(),
  comfortLevel: z.string().optional(),
  funLevel: z.string().optional(),
  notes: z.string().optional(),
  dateRating: z.string().optional(),
  expectedGiftAmount: z.string().optional(),
  giftAmount: z.string().optional(),
  status: z.string().optional(),
});

function DisplayForm({ dateData }: { dateData: Doc<'dates'>; edit: boolean }) {
  return (
    <Card className="p-6 grid md:grid-cols-2 gap-6">
      <motion.div
        className="grow flex flex-col gap-6"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <motion.div className="space-y-1" variants={stagger}>
          <p className="font-bold text-lg">Date</p>
          <Separator className="bg-primary/50" />
          <p className="pt-2">{format(dateData.date, 'MM/dd/yyyy')}</p>
        </motion.div>
        <motion.div className="space-y-1" variants={stagger}>
          <p className="font-bold text-lg">Location</p>
          <Separator className="bg-primary/50" />
          <p className="pt-2">{dateData.location || 'N/A'}</p>
        </motion.div>
        <motion.div className="space-y-1" variants={stagger}>
          <p className="font-bold text-lg">Duration (hours)</p>
          <Separator className="bg-primary/50" />
          <p className="pt-2">{dateData.dateDuration || 'N/A'}</p>
        </motion.div>
        <motion.div className="space-y-1" variants={stagger}>
          <p className="font-bold text-lg">Notes</p>
          <Separator className="bg-primary/50" />
          <Markdown className="pt-2">{dateData.notes || 'N/A'}</Markdown>
        </motion.div>
      </motion.div>
      <motion.div
        className="grow flex flex-col gap-6"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <motion.div className="space-y-1" variants={stagger}>
          <p className="font-bold text-lg">Comfort Rating</p>
          <Separator className="bg-primary/50" />
          <p className="pt-2">
            {dateData.comfortLevel ? `${dateData.comfortLevel} / 5` : 'N/A'}
          </p>
        </motion.div>
        <motion.div className="space-y-1" variants={stagger}>
          <p className="font-bold text-lg">Fun Rating</p>
          <Separator className="bg-primary/50" />
          <p className="pt-2">
            {dateData.funLevel ? `${dateData.funLevel} / 5` : 'N/A'}
          </p>
        </motion.div>
        <motion.div className="space-y-1" variants={stagger}>
          <p className="font-bold text-lg">General Date Rating</p>
          <Separator className="bg-primary/50" />
          <p className="pt-2">
            {dateData.dateRating ? `${dateData.dateRating} / 5` : 'N/A'}
          </p>
        </motion.div>
        <motion.div className="space-y-1" variants={stagger}>
          <p className="font-bold text-lg">Expected Gift Amount</p>
          <Separator className="bg-primary/50" />
          <p className="pt-2">
            {dateData.expectedGiftAmount
              ? `$${dateData.expectedGiftAmount}`
              : 'N/A'}
          </p>
        </motion.div>
        <motion.div className="space-y-1" variants={stagger}>
          <p className="font-bold text-lg">Received Gift Amount</p>
          <Separator className="bg-primary/50" />
          <p className="text-lg">
            {dateData.giftAmount ? `$${dateData.giftAmount}` : 'N/A'}
          </p>
        </motion.div>
      </motion.div>
    </Card>
  );
}

function EditForm({
  dateData,
  setEdit,
}: {
  dateData: Doc<'dates'>;
  setEdit: (edit: boolean) => void;
}) {
  const updateDate = useMutation(api.dates.updateDate);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      ...dateData,
      date: new Date(dateData.date),
      dateDuration: dateData.dateDuration?.toString() || '',
      comfortLevel: dateData.comfortLevel?.toString() || '',
      funLevel: dateData.funLevel?.toString() || '',
      dateRating: dateData.dateRating?.toString() || '',
      expectedGiftAmount: dateData.expectedGiftAmount?.toString() || '',
      giftAmount: dateData.giftAmount?.toString() || '',
    },
  });

  enum Status {
    scheduled = 'scheduled',
    completed = 'completed',
    canceled = 'canceled',
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const status = dateData.status ? dateData.status : 'scheduled';
    const formattedValues = {
      ...values,
      date: values.date.valueOf(),
      dateDuration: Number(values.dateDuration || '0'),
      comfortLevel: Number(values.comfortLevel || '0'),
      funLevel: Number(values.funLevel || '0'),
      dateRating: Number(values.dateRating || '0'),
      expectedGiftAmount: Number(values.expectedGiftAmount || '0'),
      giftAmount: Number(values.giftAmount || '0'),
      status: (Number(values.giftAmount || '0') > 0
        ? 'completed'
        : status) as Status,
    };

    try {
      const dateId = updateDate({ dateId: dateData._id, ...formattedValues });
      setEdit(false);
      form.reset();
      toast.success(`Date with ${dateData.daddyName} updated !`);
      return dateId;
    } catch (error) {
      toast.error(`Uh oh ! Something went wrong: ${getErrorMessage(error)}`);
    }
  }

  return (
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
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <FormLabel className="mr-6">Pick a date</FormLabel>
                        <FormControl className="w-max">
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-[280px] justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, 'PPP HH:mm:ss')
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                        </FormControl>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                          <div className="p-3 border-t border-border">
                            <TimePicker
                              setDate={field.onChange}
                              date={field.value}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
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
                        <Input placeholder="location..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div variants={stagger}>
                <FormField
                  control={form.control}
                  name="dateDuration"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>Duration (hours)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="How long was the date..."
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
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="grow flex flex-col">
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
                  name="comfortLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comfort Rating (min: 0, max: 5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={5}
                          placeholder="Comfort rating..."
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
                  name="funLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fun Rating (min: 0, max: 5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={5}
                          placeholder="Fun rating..."
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
                  name="dateRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        General Date Rating (min: 0, max: 5)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={5}
                          placeholder="General Date rating..."
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
                  name="expectedGiftAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Gift Amount (in USD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Expected gift..."
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
                  name="giftAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Received Gift Amount (in USD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Received gift..."
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
  );
}

function DateDisplayOrEditForm({
  dateData,
  edit,
  setEdit,
}: {
  dateData: Doc<'dates'>;
  edit: boolean;
  setEdit: (edit: boolean) => void;
}) {
  return edit ? (
    <EditForm dateData={dateData} setEdit={setEdit} />
  ) : (
    <DisplayForm dateData={dateData} edit={edit} />
  );
}

export default function DaddyPage({ params }: { params: { id: Id<'dates'> } }) {
  const dateData = useQuery(api.dates.getDate, {
    date: params.id,
  });

  const cancelDate = useMutation(api.dates.cancelDate);
  const router = useRouter();
  const [edit, setEdit] = useState(false);

  function onCancelDate(dateId: Id<'dates'>) {
    try {
      cancelDate({ dateId });

      toast.success('Date has been canceled.');
    } catch (error) {
      toast.error('Error cancelling date');
    }
  }

  function goBack(daddyId: string) {
    router.push(`/daddies/${daddyId}`);
  }

  if (!dateData) return null;

  const { date, daddy } = dateData;
  if (!date || !daddy) return null;
  return (
    <div className="flex w-full h-full flex-col">
      {/* <div
        onClick={() => goBack(daddy?._id || '')}
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
            <BreadcrumbLink
              href={`/daddies/${daddy._id}`}
              className="hover:underline decoration-primary"
            >
              {daddy.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex flex-row items-center">
              <CalendarFold size={18} className="mr-1" />
              Date
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col md:grid md:grid-cols-3 xl:grid-cols-4 h-full gap-6">
        <div className="md:col-span-3 xl:col-span-4 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex flex-row items-center gap-4">
                  <h1 className="text-xl font-semibold flex flex-row gap-2 items-center">
                    <CalendarFold size={20} />
                    <span className="font-medium">
                      {formatDistance(date.date, new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                    <AddToCalendarButton date={date} />
                  </h1>
                  {/* <p>
                      {dates.length || 0} Dates - {contacts.length || 0}{' '}
                      Contacts
                    </p> */}
                </div>
                <div className="flex flex-row gap-4">
                  {/* {date.status !== 'canceled' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button disabled={edit} variant="outline">
                          CANCEL DATE
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Do you really want to cancel this date ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This date will be marked as canceled and will not be
                            part of your data anymore.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abort</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button
                              onClick={() => onCancelDate(date._id)}
                              disabled={edit}
                            >
                              Yes. Cancel!
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )} */}

                  <DateStatusSelector date={date} />
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
          <Button
            onClick={() => setEdit(editStatus => !editStatus)}
            disabled={edit}
          >
            EDIT
          </Button>
          <DateDisplayOrEditForm
            dateData={date}
            edit={edit}
            setEdit={setEdit}
          />
        </div>
      </div>
    </div>
  );
}
