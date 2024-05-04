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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { Id } from "@/convex/_generated/dataModel";
import { cn, getErrorMessage, dateTimeDate } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import Tiptap from "./tiptap";
import { useConvexData } from "@/providers/convexDataContext";

const formSchema = z.object({
  daddy: z.string(),
  date: z.string(),
  notes: z.string().optional(),
});

export function NewContactButton({
  daddyId,
  children = "Add a New Contact",
}: {
  daddyId?: Id<"daddies">;
  children?: React.ReactNode;
  contactId?: Id<"contacts">;
}) {
  // 1. Define your form.
  const contactForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      daddy: daddyId || "",
      date: dateTimeDate(),
      notes: "",
    },
  });

  const createContact = useMutation(api.contacts.createContact);
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
      const contactId = await createContact({
        daddy: values.daddy as Id<"daddies">,
        date: new Date(values.date).valueOf(),
        notes: values.notes,
      });
      contactForm.reset();
      toast.success(
        `New Contact Created with ${getDaddyName(values.daddy)} 🎉`,
      );
      return contactId;
    } catch (error) {
      toast.error(`Uh oh ! Something went wrong: ${getErrorMessage(error)}`);
    }
  }

  function toggleContactDrawer() {
    setDrawers((prev) => ({
      ...prev,
      contactOpen: !prev.contactOpen,
    }));
  }

  return (
    <Dialog open={drawers.contactOpen} onOpenChange={toggleContactDrawer}>
      <DialogTrigger asChild>
        <Button className="w-fill" size={daddyId ? "sm" : "default"}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a new Contact</DialogTitle>
            <DialogDescription>
              Click create when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Form {...contactForm}>
            <form
              id="contact-form"
              onSubmit={contactForm.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {!daddyId ? (
                <FormField
                  control={contactForm.control}
                  name="daddy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daddy I got in touch with:</FormLabel>
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
                control={contactForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mr-6">When was that? </FormLabel>
                    <FormControl className="w-max">
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={contactForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Tiptap content={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit" form="contact-form">
                    Create
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
