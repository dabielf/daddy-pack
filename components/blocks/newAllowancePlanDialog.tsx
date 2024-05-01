'use client';

import { api } from '@/convex/_generated/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { addDays, format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Doc } from '@/convex/_generated/dataModel';
import { getErrorMessage } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  ChevronRight,
  CircleDollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const formSchema = z.object({
  intervalInDays: z.coerce.number().int().positive(),
  amount: z.coerce.number().int().positive(),
});

function AllowanceLink({
  daddy,
  allowanceData,
}: {
  daddy: Doc<'daddies'>;
  allowanceData?: Doc<'allowances'> | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          <h3 className="text-lg font-semibold">Allowance Plan: Active</h3>
          <Link
            href={`/daddies/${daddy._id}/allowance/${daddy.allowance}`}
            className="flex flex-row justify-end items-center hover:underline decoration-primary"
          >
            Manage Allowance <ChevronRight size={16} className="ml-2" />
          </Link>
        </CardTitle>
        <div className="grid grid-cols-2">
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs text-gray-500 flex flex-row items-center">
              <CircleDollarSign size={16} className="mr-2" />$
              {allowanceData?.amount} every {allowanceData?.intervalInDays} days
            </span>
            <span className="text-xs text-gray-500 flex flex-row items-center">
              <CircleDollarSign size={16} className="mr-2" />$
              {allowanceData?.totalGiftAmount} total over{' '}
              {allowanceData?.numberOfPayments} allowances
            </span>
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs text-gray-500 flex flex-row items-center">
              <CalendarIcon size={16} className="mr-2" /> Last payment:
              {allowanceData?.lastPaymentDate
                ? ` ${format(
                    new Date(allowanceData.lastPaymentDate),
                    'MMM do, yyyy',
                  )}`
                : 'Payments not started yet'}
            </span>
            <span className="text-xs text-gray-500 flex flex-row items-center">
              <CalendarIcon size={16} className="mr-2" />
              Next payment:
              {allowanceData?.lastPaymentDate
                ? ` ${format(
                    addDays(
                      new Date(allowanceData.lastPaymentDate),
                      allowanceData.intervalInDays,
                    ),
                    'MMM do, yyyy',
                  )}`
                : 'Payments not started yet'}
            </span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export function CencelAllowancePlanButton({
  daddy,
  allowance,
  children = 'New Allowance Payment',
}: {
  daddy: Doc<'daddies'>;
  allowance?: Doc<'allowances'> | null;
  children?: React.ReactNode;
}) {
  return <Button>{children}</Button>;
}

export function AddAllowancePlanButton({
  daddy,
  allowance,
  children = 'Start Allowance Plan',
}: {
  daddy: Doc<'daddies'>;
  allowance?: Doc<'allowances'> | null;
  children?: React.ReactNode;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      intervalInDays: 14,
      amount: 0,
    },
  });

  const createAllowancePlan = useMutation(api.allowances.createAllowance);

  if (!daddy) return null;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      const allowanceId = await createAllowancePlan({
        daddy: daddy._id,
        intervalInDays: values.intervalInDays,
        amount: values.amount,
      });
      form.reset();
      toast.success(`New Allowance Plan started with ${daddy.name} 🎉`);
      return allowanceId;
    } catch (error) {
      toast.error(`Uh oh ! Something went wrong: ${getErrorMessage(error)}`);
    }
  }

  if (daddy.allowance) {
    return <AllowanceLink daddy={daddy} allowanceData={allowance} />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fill">{children}</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Start an Allowance Plan with {daddy.name}</DialogTitle>
            <DialogDescription>
              You can start and stop this plan anytime.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="intervalInDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gifted every X days:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Ex: every 14 days..."
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>For X amount:</FormLabel>
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

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Start Plan</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
