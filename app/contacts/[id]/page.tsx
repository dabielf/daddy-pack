"use client";

import animations from "@/constants/animations";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

import Tiptap from "@/components/blocks/tiptap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

import { dateTimeDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistance, format } from "date-fns";
import { motion } from "framer-motion";
import { MessageSquareMore } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Markdown from "react-markdown";
import { z } from "zod";
import Link from "next/link";

export default function ContactPage({
  params,
}: {
  params: { id: Id<"contacts"> };
}) {
  const [edit, setEdit] = useState(false);
  const contact = useQuery(api.contacts.getContact, {
    contact: params.id,
  });
  const updateContact = useMutation(api.contacts.updateContact);
  const router = useRouter();
  const formSchema = z.object({
    date: z.string(),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      date: dateTimeDate(contact?.date),
      notes: contact?.notes || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const contactId = updateContact({
      contact: params.id,
      date: new Date(values.date).valueOf(),
      notes: values.notes,
    });
    setEdit(false);
  }

  if (!contact) return null;

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {/* <div
        onClick={() => goBack(daddy?._id || '')}
        className="text-slate-700 cursor-pointer flex flex-row gap-1 items-center"
      >
        <ChevronLeft size={24} />
        Back
      </div> */}
      <Breadcrumb>
        <BreadcrumbList className="font-semibold text-foreground md:text-xl">
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/daddies"
              className="decoration-primary hover:underline"
            >
              Daddies
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/daddies/${contact.daddy}`}
              className="decoration-primary hover:underline"
            >
              {contact.daddyName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex flex-row items-center">
              <MessageSquareMore size={18} className="mr-1" />
              Contact
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex flex-row items-center gap-4">
              <div className="place-items-baseline">
                <h1 className="flex flex-row items-center gap-2 text-2xl font-semibold">
                  <MessageSquareMore size={20} />
                  <div>
                    Contact with{" "}
                    <Link
                      href={`/daddies/${contact.daddy}`}
                      className="decoration-primary hover:underline"
                    >
                      {contact.daddyName}
                    </Link>
                    <span className="ml-2 mr-1 font-light">
                      {formatDistance(contact.date, new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="text-xs font-light md:text-sm">
                      ( {format(contact.date, "Pp")} )
                    </span>
                  </div>
                </h1>
              </div>
            </div>

            <div className="flex flex-row gap-2"></div>
          </CardTitle>
        </CardHeader>
      </Card>
      <Button
        onClick={() => setEdit((editStatus) => !editStatus)}
        disabled={edit}
      >
        EDIT
      </Button>

      {edit && (
        <motion.div {...animations.appearUp}>
          <Card>
            <CardContent className="pt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
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
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mr-6">Notes</FormLabel>
                        <FormControl>
                          <Tiptap
                            content={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-4 flex flex-row justify-end gap-2">
                    <Button variant="secondary" onClick={() => setEdit(false)}>
                      CANCEL
                    </Button>
                    <Button disabled={!form.formState.isDirty} type="submit">
                      SAVE
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      )}
      {!edit && (
        <motion.div {...animations.appearUp}>
          <Card>
            <CardContent className="pt-4">
              <h2 className="text-lg font-bold">Notes</h2>
              <Separator className="mb-4 bg-primary/50" />
              <Markdown>
                {contact.notes || "No notes about this contact yet"}
              </Markdown>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
