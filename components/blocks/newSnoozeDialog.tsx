"use client";

import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConvex, useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useDrawers } from "@/providers/convex-client-provider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { cn, getErrorMessage, dateTimeDate } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import Tiptap from "./tiptap";
import { useConvexData } from "@/providers/convexDataContext";
import { useState } from "react";
import { SnoozeIcon } from "./snoozeIcon";

const formSchema = z.object({
  numDays: z.coerce.number().min(0).max(120),
  status: z.enum(["create", "edit"]),
});

export function NewSnoozeButton({
  daddy,
  children = (
    <span>
      <SnoozeIcon className="block text-primary-foreground" size={20} /> SNOOZE
    </span>
  ),
}: {
  daddy?: Doc<"daddies">;
  children?: React.ReactNode;
}) {
  // 1. Define your form.
  const contactForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numDays: 0,
      status: "create",
    },
  });

  const snoozeDaddy = useMutation(api.daddies.snoozeDaddy);
  const unsnoozeDaddy = useMutation(api.daddies.unsnoozeDaddy);
  // const { daddies } = useConvexData();
  const [open, setOpen] = useState(false);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (!daddy) return null;
    try {
      await snoozeDaddy({
        daddy: daddy._id,
        numDays: Number(values.numDays),
      });
      contactForm.reset();
      setOpen(false);
      if (values.status == "create") {
        toast.success(`${daddy.name} was successfully snoozed 🎉`);
      } else {
        toast.success(`${daddy.name} snooze was successfully edited 🎉`);
      }
    } catch (error) {
      toast.error(`Uh oh ! Something went wrong: ${getErrorMessage(error)}`);
    }
  }

  if (!daddy) return null;

  // SNOOZED WITH NO DURATION
  if (daddy.snooze && !daddy.unsnoozeScheduled) {
    return (
      <Button
        className="w-fill"
        size={daddy ? "sm" : "default"}
        onClick={() => unsnoozeDaddy({ daddy: daddy._id })}
      >
        <SnoozeIcon className="mr-1 block fill-primary-foreground" size={14} />{" "}
        UNSNOOZE
      </Button>
    );
  }

  // SNOOZED WITH SCHEDULED UNSNOOZE
  if (daddy.snooze && daddy.unsnoozeDate) {
    return (
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogTrigger asChild>
          <Button className="w-fill" size={daddy ? "sm" : "default"}>
            <SnoozeIcon
              className="mr-1 block fill-primary-foreground"
              size={14}
            />{" "}
            EDIT SNOOZE STATUS
          </Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {daddy.name} snoozed until{" "}
                {format(new Date(daddy.unsnoozeDate), "PPp")}
              </DialogTitle>
              <DialogDescription>
                You can unsnooze or just change the number of days
              </DialogDescription>
            </DialogHeader>
            <Form {...contactForm}>
              <form
                id="contact-form"
                onSubmit={contactForm.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={contactForm.control}
                  name="numDays"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center">
                      <FormLabel className="mr-6">
                        How many days from today?{" "}
                      </FormLabel>
                      <FormControl className="w-max">
                        <Input className="grow" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        className="grow"
                        type="hidden"
                        {...field}
                        value="edit"
                      />
                    </FormItem>
                  )}
                />
                <DialogFooter className="flex-row gap-4">
                  {/* <DialogClose asChild> */}
                  <Button
                    className="grow"
                    onClick={(e) => {
                      e.preventDefault();
                      unsnoozeDaddy({ daddy: daddy._id });
                      setOpen(false);
                    }}
                  >
                    UNSNOOZE
                  </Button>
                  <Button className="grow" type="submit" form="contact-form">
                    EDIT
                  </Button>
                  {/* </DialogClose> */}
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button className="w-fill" size={daddy ? "sm" : "default"}>
          <SnoozeIcon
            className="mr-1 block fill-primary-foreground"
            size={14}
          />{" "}
          SNOOZE
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Snoozes {daddy.name}</DialogTitle>
            <DialogDescription>
              Choose hom many days before unsnooze (or leave at 0 to snooze
              until you choose to unsnooze)
            </DialogDescription>
          </DialogHeader>
          <Form {...contactForm}>
            <form
              id="contact-form"
              onSubmit={contactForm.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={contactForm.control}
                name="numDays"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-baseline">
                    <FormLabel className="mr-6">For how many days? </FormLabel>
                    <FormControl className="w-max">
                      <Input className="grow" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                {/* <DialogClose asChild> */}
                <Button type="submit" form="contact-form">
                  Snooze
                </Button>
                {/* </DialogClose> */}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
