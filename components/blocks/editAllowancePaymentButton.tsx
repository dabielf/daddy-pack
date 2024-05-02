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
import { Input } from '@/components/ui/input';
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
import { Doc, Id } from '@/convex/_generated/dataModel';
import { cn, getErrorMessage } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const formSchema = z.object({
  date: z.date(),
  amount: z.coerce.number().int().positive(),
  paymentMethod: z.string().optional(),
});

export function EditAllowancePaymentButton({
  allowance,
  allowancePaymentId,
  daddy,
  children = 'Edit',
}: {
  allowance: Doc<'allowances'>;
  allowancePaymentId: Id<'allowancePayments'>;
  daddy?: Doc<'daddies'>;
  children?: React.ReactNode;
}) {
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   values: {
  //     date: new Date(allowancePaymentData?.date || Date.now()),
  //     amount: allowancePaymentData?.amount || 0,
  //     paymentMethod: allowancePaymentData?.paymentMethod || '',
  //   },
  // });

  // if (allowancePayment) {
  //   form.setValue('date', new Date(allowancePayment.date));
  //   form.setValue('amount', allowancePayment.amount);
  //   form.setValue('paymentMethod', allowancePayment.paymentMethod);
  // }

  const updateAllowancePayment = useMutation(
    api.allowances.updateAllowancePayment,
  );

  // const createAllowancePayment = useMutation(
  //   api.allowances.createAllowancePayment,
  // );

  if (!daddy || !allowance) return null;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      await updateAllowancePayment({
        allowancePayment: allowancePaymentId,
        date: values.date.valueOf(),
        amount: values.amount,
        paymentMethod: values.paymentMethod,
      });
      form.reset();
      toast.success(`Allowance Payment Updated 🎉`);
      return allowancePaymentId;
    } catch (error) {
      toast.error(`Uh oh ! Something went wrong: ${getErrorMessage(error)}`);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fill">{children}</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Gifting from {daddy.name}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <Popover>
                      <FormLabel className="mr-6">
                        When was the gift made ?
                      </FormLabel>
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How much was the gift ? </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Ex: 1250..."
                        {...field}
                        onChange={event => field.onChange(event.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How was the gift made ? (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Cash, Venmo..."
                        {...field}
                        onChange={event => field.onChange(event.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Edit Gifting</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
