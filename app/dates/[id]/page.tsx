'use client';

import { DeleteDaddyButton } from '@/components/blocks/daddiesList';
import EventLog from '@/components/blocks/eventLog';
import { NewDateButton } from '@/components/blocks/newDateDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, getErrorMessage } from '@/lib/utils';
import { format, formatDistance } from 'date-fns';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import animations from '@/constants/animations';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import { CalendarFold, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { TimePicker } from '@/components/ui/time-picker';
import { toast } from 'sonner';

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
    <motion.div {...animations.appearUp}>
      <Card className="p-6 flex flex-row gap-6">
        <div className="grow flex flex-col gap-6">
          <div className="space-y-1">
            <p>Date</p>
            <p className="text-lg">{format(dateData.date, 'MM/dd/yyyy')}</p>
          </div>
          <div className="space-y-1">
            <p>Location</p>
            <p className="text-lg">{dateData.location || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p>Duration</p>
            <p className="text-lg">{dateData.dateDuration || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p>Notes</p>
            <p className="text-lg">{dateData.notes || 'N/A'}</p>
          </div>
        </div>
        <div className="grow flex flex-col gap-6">
          <div className="space-y-1">
            <p>Comfort Rating</p>
            <p className="text-lg">
              {dateData.comfortLevel ? `${dateData.comfortLevel} / 5` : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p>Fun Rating</p>
            <p className="text-lg">
              {dateData.funLevel ? `${dateData.funLevel} / 5` : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p>General Date Rating</p>
            <p className="text-lg">
              {dateData.dateRating ? `${dateData.dateRating} / 5` : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p>Expected Gift Amount</p>
            <p className="text-lg">
              {dateData.expectedGiftAmount
                ? `$${dateData.expectedGiftAmount}`
                : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p>Received Gift Amount</p>
            <p className="text-lg">
              {dateData.giftAmount ? `$${dateData.giftAmount}` : 'N/A'}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
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
    cancelled = 'cancelled',
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
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
        : 'scheduled') as Status | undefined,
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
    <motion.div {...animations.appearUp}>
      <Card className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-2  gap-6">
              <div className="grow flex flex-col gap-6">
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
                <FormField
                  control={form.control}
                  name="dateDuration"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>Duration</FormLabel>
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
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="grow flex flex-col">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          className="grow"
                          placeholder="Notes..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grow flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="comfortLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comfort Rating (min: 1, max: 5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          placeholder="Comfort rating..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="funLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fun Rating (min: 1, max: 5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          placeholder="Fun rating..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        General Date Rating (min: 1, max: 5)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          placeholder="General Date rating..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expectedGiftAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Gift Amount (in USD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Expected gift..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="giftAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Received Gift Amount (in USD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Received gift..."
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
  const updateDate = useMutation(api.dates.updateDate);
  const router = useRouter();
  const [edit, setEdit] = useState(false);

  function onCancelDate(dateId: Id<'dates'>) {
    try {
      updateDate({ dateId, date: dateData?.date.date, status: 'cancelled' });

      toast.success('Date has been cancelled.');
    } catch (error) {
      toast.error('Error cancelling date');
    }
  }

  function goBack() {
    router.back();
  }

  if (!dateData) return null;

  const { date, daddy } = dateData;
  if (!date) return null;
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
        <div className="md:col-span-3 xl:col-span-4 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex flex-row items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold flex flex-row gap-2 items-center">
                      <CalendarFold size={20} /> Date with {daddy?.name}{' '}
                      {formatDistance(date.date, new Date(), {
                        addSuffix: true,
                      })}
                    </h1>
                    {/* <p>
                      {dates.length || 0} Dates - {contacts.length || 0}{' '}
                      Contacts
                    </p> */}
                  </div>
                </div>
                <div className="flex flex-row gap-4">
                  {date.status !== 'cancelled' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">CANCEL DATE</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Do you really want to cancel this date ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This date will be marked as cancelled and will not
                            be part of your data anymore.
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
                  )}
                  <Button
                    onClick={() => setEdit(editStatus => !editStatus)}
                    disabled={edit}
                  >
                    EDIT
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
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
