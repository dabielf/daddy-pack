"use client";

import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useDrawers } from "@/providers/convex-client-provider";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
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
import { TimePicker } from "@/components/ui/time-picker";
import { Id } from "@/convex/_generated/dataModel";
import { cn, getErrorMessage } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useConvexData } from "@/providers/convexDataContext";

const formSchema = z.object({
  daddy: z.string(),
  daddyName: z.string(),
  date: z.date(),
});

export default function NewDate({
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
      date: new Date(),
    },
  });

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
    setDrawers((prev) => ({
      ...prev,
      dateOpen: !prev.dateOpen,
    }));
  }

  return (
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
                    <SelectTrigger className="bg-white">
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl className="w-max">
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3  text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP HH:mm:ss")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className="border-t border-border p-3">
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </div>
                </PopoverContent>
              </Popover>
              {/* <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Dimensions</h4>
                <p className="text-sm text-muted-foreground">
                  Set the dimensions for the layer.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    defaultValue="100%"
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="maxWidth">Max. width</Label>
                  <Input
                    id="maxWidth"
                    defaultValue="300px"
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    defaultValue="25px"
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="maxHeight">Max. height</Label>
                  <Input
                    id="maxHeight"
                    defaultValue="none"
                    className="col-span-2 h-8"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </form>
    </Form>
  );
}
