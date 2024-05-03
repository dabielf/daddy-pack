'use client';

import { api } from '@/convex/_generated/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { Input } from '@/components/ui/input';
import { Doc } from '@/convex/_generated/dataModel';
import { dateTimeDate, getErrorMessage } from '@/lib/utils';
import { toast } from 'sonner';

const formSchema = z.object({
  date: z.string(),
  amount: z.coerce.number().int().positive(),
  paymentMethod: z.string().optional(),
});

export function AddAllowancePaymentButton({
  allowance,
  daddy,
  children = 'Add New Payment',
}: {
  allowance: Doc<'allowances'>;
  daddy?: Doc<'daddies'>;
  children?: React.ReactNode;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: dateTimeDate(),
      amount: allowance.amount,
      paymentMethod: '',
    },
  });

  const createAllowancePayment = useMutation(
    api.allowances.createAllowancePayment,
  );

  if (!daddy || !allowance) return null;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    try {
      if (!daddy) return null;
      const allowancePaymentId = await createAllowancePayment({
        allowance: allowance._id,
        daddy: daddy._id,
        date: new Date(values.date).valueOf(),
        amount: values.amount,
        paymentMethod: values.paymentMethod,
      });
      form.reset();
      toast.success(`New Allowance Payment Added 🎉`);
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
            <DialogTitle>New Gifting from {daddy.name}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mr-6">
                      When was the gift made?{' '}
                    </FormLabel>
                    <FormControl className="w-max">
                      <Input type="datetime-local" {...field} />
                    </FormControl>
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
                  <Button type="submit">Add Gifting</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
