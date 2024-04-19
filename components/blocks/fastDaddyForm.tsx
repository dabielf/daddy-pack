"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  vibeRating: z.string(),
});

export function NewDaddyButton() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      vibeRating: "3",
    },
  });

  const user = useQuery(api.users.currentUser, {});

  const createDaddy = useMutation(api.daddies.createDaddy);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return null;
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values, typeof Number(values.vibeRating));
    try {
      const daddyId = createDaddy({
        user: user._id,
        name: values.name,
        vibeRating: Number(values.vibeRating),
      });
      form.reset();
      toast.success(
        `New Daddy Created: ${values.name}, Vibe Rating: ${Number(values.vibeRating)}`
      );
      return daddyId;
    } catch (error) {
      toast.error(`Uh oh ! Something went wrong: ${getErrorMessage(error)}`);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fill">Create New Daddy</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new Daddy</DialogTitle>
          <DialogDescription>
            Click create when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daddy&apos;s Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vibeRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vibe Rating</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Rate the vibe from 1 to 5" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Initial instinct, you can change this later ;)
                  </FormDescription>
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
