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
import { DaddyExtendedData } from '@/custom-types';
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
    <Link href={`/daddies/${daddy._id}/allowance/${daddy.allowance}`}>
      Allowance Link
    </Link>
  );
}

export function AddAllowancePlanButton({
  daddy,
  allowance,
  children = 'New Allowance Payment',
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
