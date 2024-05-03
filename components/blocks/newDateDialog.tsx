'use client';

import { api } from '@/convex/_generated/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'convex/react';
import { formatRFC3339 } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRef } from 'react';

import { useDrawers } from '@/providers/convex-client-provider';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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

import { Id } from '@/convex/_generated/dataModel';
import { getErrorMessage, dateTimeDate } from '@/lib/utils';
import { toast } from 'sonner';

const formSchema = z.object({
  daddy: z.string(),
  daddyName: z.string(),
  date: z.string(),
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
      date: dateTimeDate(),
    },
  });

  const dialogRef = useRef<HTMLDivElement>(null);

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
        date: new Date(values.date).valueOf(),
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
      <DialogContent className="sm:max-w-[425px]" ref={dialogRef}>
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
                  <FormLabel className="mr-6">Pick a date: </FormLabel>
                  <FormControl className="w-max">
                    <Input type="datetime-local" {...field} />
                  </FormControl>
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
    </Dialog>
  );
}
