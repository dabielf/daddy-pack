'use client';

import animations from '@/constants/animations';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';

import Tiptap from '@/components/blocks/tiptap';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { TimePicker } from '@/components/ui/time-picker';
import { cn, dateTimeDate } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, formatRelative } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  MessageSquareMore,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Markdown from 'react-markdown';
import { z } from 'zod';
import Link from 'next/link';

export default function ContactPage({
  params,
}: {
  params: { id: Id<'contacts'> };
}) {
  const [edit, setEdit] = useState(false);
  const contactData = useQuery(api.contacts.getContact, {
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
      date: dateTimeDate(contactData?.contact?.date),
      notes: contactData?.contact?.notes || '',
    },
  });

  function formatDate(date: number) {
    return (
      // formatDistance(new Date(date), new Date(), {
      //   addSuffix: true,
      // }) +
      // ' - ' +
      formatRelative(new Date(date), new Date())
    );
  }

  function goBack(daddyId: string) {
    router.push(`/daddies/${daddyId}`);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const contactId = updateContact({
      contact: params.id,
      date: new Date(values.date).valueOf(),
      notes: values.notes,
    });
    setEdit(false);
  }

  if (!contactData) return null;

  const { daddy, contact } = contactData;
  if (!contact || !daddy) return null;

  return (
    <div className="flex w-full h-full flex-col gap-4">
      {/* <div
        onClick={() => goBack(daddy?._id || '')}
        className="text-slate-700 cursor-pointer flex flex-row gap-1 items-center"
      >
        <ChevronLeft size={24} />
        Back
      </div> */}
      <Breadcrumb>
        <BreadcrumbList className="md:text-xl font-semibold text-foreground">
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/daddies"
              className="hover:underline decoration-primary"
            >
              Daddies
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/daddies/${daddy._id}`}
              className="hover:underline decoration-primary"
            >
              {daddy.name}
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
          <CardTitle className="flex justify-between items-center">
            <div className="flex flex-row items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold flex flex-row gap-2 items-center">
                  <MessageSquareMore size={20} />
                  Contact with{' '}
                  <Link
                    href={`/daddies/${contact.daddy}`}
                    className="hover:underline decoration-primary"
                  >
                    {daddy ? daddy.name : 'REDACTED'}
                  </Link>
                  <span className="text-slate-600 font-medium">
                    {formatDate(contact.date)}
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex flex-row gap-2"></div>
          </CardTitle>
        </CardHeader>
      </Card>
      <Button
        onClick={() => setEdit(editStatus => !editStatus)}
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
              <Separator className="bg-primary/50 mb-4" />
              <Markdown>
                {contact.notes || 'No notes about this contact yet'}
              </Markdown>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
