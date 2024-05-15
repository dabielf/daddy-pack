import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { formatDistance, format } from "date-fns";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn, getErrorMessage, dateTimeDate } from "@/lib/utils";

import Link from "next/link";
import { Button } from "../ui/button";

const formSchema = z.object({
  date: z.string(),
  amount: z.coerce.number().int().positive(),
  paymentMethod: z.string().optional(),
});

function EditDialog({
  daddy,
  payment,
  setCurrentPayment,
}: {
  daddy?: Doc<"daddies">;
  payment?: Doc<"allowancePayments">;
  setCurrentPayment: (payment: Doc<"allowancePayments"> | null) => void;
}) {
  const updateAllowancePayment = useMutation(
    api.allowances.updateAllowancePayment,
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: dateTimeDate(),
      amount: 0,
      paymentMethod: "",
    },
  });

  useEffect(() => {
    if (!payment) return;
    form.reset({
      date: dateTimeDate(payment.date),
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
    });
  }, [payment, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (!payment || !daddy) return;
    try {
      await updateAllowancePayment({
        allowancePayment: payment._id,
        daddy: daddy._id,
        date: new Date(values.date).valueOf(),
        amount: values.amount,
        paymentMethod: values.paymentMethod,
      });
      form.reset();
      toast.success(`Allowance Gifting Updated 🎉`);
    } catch (error) {
      toast.error(`Uh oh ! Something went wrong: ${getErrorMessage(error)}`);
    }
    setCurrentPayment(null);
  }

  if (!daddy || !payment) return null;

  return (
    <Dialog defaultOpen onOpenChange={() => setCurrentPayment(null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Gifting from {daddy?.name || "Secret"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mr-6">
                    When was the gift made?{" "}
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
                      onChange={(event) => field.onChange(event.target.value)}
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
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Edit Gifting</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      {/* </DialogPortal> */}
    </Dialog>
  );
}

function DeleteDialog({
  daddy,
  toDeletePayment,
  setToDeletePayment,
}: {
  daddy?: Doc<"daddies">;
  toDeletePayment?: Doc<"allowancePayments">;
  setToDeletePayment: (payment: Doc<"allowancePayments"> | null) => void;
}) {
  const deleteAllowancePayment = useMutation(
    api.allowances.deleteAllowancePayment,
  );

  async function onDelete() {
    if (!toDeletePayment || !daddy) return;
    try {
      await deleteAllowancePayment({
        allowancePayment: toDeletePayment._id,
        daddy: daddy._id,
      });
      toast.success(`Allowance Gifting Deleted 🎉`);
    } catch (error) {
      toast.error(`Uh oh ! Something went wrong: ${getErrorMessage(error)}`);
    }
    setToDeletePayment(null);
  }

  if (!toDeletePayment || !daddy) return null;

  return (
    <Dialog defaultOpen onOpenChange={() => setToDeletePayment(null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Delete ${toDeletePayment.amount} Gift from {daddy?.name || "Secret"}
            ?
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone and will remove the gift amount from
            everywhere.
          </p>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setToDeletePayment(null)}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="mr-2"
            type="button"
          >
            Delete Gifting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AllowancePaymentsTable({
  daddy,
  allowance,
  payments,
}: {
  daddy: Doc<"daddies">;
  allowance: Doc<"allowances">;
  payments: Doc<"allowancePayments">[];
}) {
  const [currentPayment, setCurrentPayment] =
    useState<Doc<"allowancePayments"> | null>(null);
  const [toDeletePayment, setToDeletePayment] =
    useState<Doc<"allowancePayments"> | null>(null);
  return (
    <div>
      {currentPayment !== null && (
        <EditDialog
          daddy={daddy}
          payment={currentPayment}
          setCurrentPayment={setCurrentPayment}
        />
      )}
      {toDeletePayment !== null && (
        <DeleteDialog
          daddy={daddy}
          toDeletePayment={toDeletePayment}
          setToDeletePayment={setToDeletePayment}
        />
      )}
      <Table className="mt-4">
        {/* <TableCaption>Your Recent Allowance Gifts.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Gifting Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment._id}>
              <TableCell className="font-medium">
                {format(payment.date, "MM/dd/yyyy")}
              </TableCell>

              <TableCell>{payment.paymentMethod}</TableCell>
              <TableCell className="text-right">${payment.amount}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => setCurrentPayment(payment)}
                >
                  Edit
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => setToDeletePayment(payment)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">
              ${allowance.totalGiftAmount}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
