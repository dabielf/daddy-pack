'use client';

import { api } from '@/convex/_generated/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useDrawers } from '@/providers/convex-client-provider';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TimePicker } from '@/components/ui/time-picker';
import { Id } from '@/convex/_generated/dataModel';
import { cn, getErrorMessage } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  daddy: z.string(),
  daddyName: z.string(),
  date: z.date(),
});

export function NewDateButton({
  daddyId,
  children = 'Add a New Date',
}: {
  daddyId?: Id<'daddies'>;
  children?: React.ReactNode;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      daddy: daddyId || '',
      daddyName: '',
      date: new Date(),
    },
  });

  const createDate = useMutation(api.dates.createDate);
  const daddies = useQuery(api.daddies.getDaddies);
  const [drawers, setDrawers] = useDrawers();

  function getDaddyName(daddyId: string) {
    const daddy = daddies?.find(daddy => daddy._id === daddyId);
    return daddy?.name || 'No Name';
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      const dateId = await createDate({
        daddy: values.daddy as Id<'daddies'>,
        daddyName: getDaddyName(values.daddy),
        date: values.date.valueOf(),
      });
      form.reset();
      toast.success(`New Date Created with ${getDaddyName(values.daddy)} 🎉`);
      return dateId;
    } catch (error) {
      toast.error(`Uh oh ! Something went wrong: ${getErrorMessage(error)}`);
    }
  }

  function toggleDateDrawer() {
    setDrawers(prev => ({
      ...prev,
      dateOpen: !prev.dateOpen,
    }));
  }

  return (
    <Dialog open={drawers.dateOpen} onOpenChange={toggleDateDrawer}>
      <DialogTrigger asChild>
        <Button className="w-fill" size={daddyId ? 'sm' : 'default'}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Add a new Date {daddyId ? `with ${getDaddyName(daddyId)}` : ''}
            </DialogTitle>
            <DialogDescription>
              Click create when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {!daddyId ? (
                <FormField
                  control={form.control}
                  name="daddy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daddy I got the date with:</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a Daddy" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {daddies?.length
                            ? daddies.map(daddy => (
                                <SelectItem key={daddy._id} value={daddy._id}>
                                  {daddy.name}
                                </SelectItem>
                              ))
                            : null}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
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
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Create</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
