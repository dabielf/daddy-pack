"use client";

import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRef } from "react";

import { useDrawers } from "@/providers/convex-client-provider";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { Id } from "@/convex/_generated/dataModel";
import { getErrorMessage, dateTimeDate } from "@/lib/utils";
import { toast } from "sonner";
import { useConvexData } from "@/providers/convexDataContext";

const formSchema = z.object({
  daddy: z.string(),
  daddyName: z.string(),
  date: z.string(),
  confirmed: z.boolean().default(false),
});

export function NewDateButton({
  daddyId,
  children = "Add a New Date",
}: {
  daddyId?: Id<"daddies">;
  children?: React.ReactNode;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      daddy: daddyId || "",
      daddyName: "",
      date: dateTimeDate(),
    },
  });

  const dialogRef = useRef<HTMLDivElement>(null);

  const createDate = useMutation(api.dates.createDate);
  const { daddies } = useConvexData();
  const [drawers, setDrawers] = useDrawers();

  function getDaddyName(daddyId: string) {
    const daddy = daddies?.find((daddy) => daddy._id === daddyId);
    return daddy?.name || "No Name";
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      const dateId = await createDate({
        daddy: values.daddy as Id<"daddies">,
        daddyName: getDaddyName(values.daddy),
        date: new Date(values.date).valueOf(),
        status: values.confirmed ? "confirmed" : "tentative",
      });
      form.reset();
      toast.success(`New Date Created with ${getDaddyName(values.daddy)} 🎉`);
      return dateId;
    } catch (error) {
      toast.error(`Uh oh ! Something went wrong: ${getErrorMessage(error)}`);
    }
  }

  function toggleDateDrawer() {
    setDrawers((prev) => ({
      ...prev,
      dateOpen: !prev.dateOpen,
    }));
  }

  return (
    <Dialog open={drawers.dateOpen} onOpenChange={toggleDateDrawer}>
      <DialogTrigger asChild>
        <Button className="w-fill" size={daddyId ? "sm" : "default"}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" ref={dialogRef}>
        <DialogHeader>
          <DialogTitle>
            Add a new Date {daddyId ? `with ${getDaddyName(daddyId)}` : ""}
          </DialogTitle>
          <DialogDescription>
            Click create when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                          ? daddies.map((daddy) => (
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
            <FormField
              control={form.control}
              name="confirmed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-start gap-4">
                  <FormLabel className="mt-2">Date confirmed ?</FormLabel>
                  <FormControl className="space-y-0">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit" className="mt-3">
                  Create
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
