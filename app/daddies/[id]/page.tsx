"use client";

import {
  ArchiveDaddyButton,
  DeleteDaddyButton,
} from "@/components/blocks/daddiesList";
import {
  AddAllowancePlanButton,
  AllowanceLink,
} from "@/components/blocks/newAllowancePlanDialog";
import EventLog from "@/components/blocks/eventLog";
import { NewContactButton } from "@/components/blocks/newContactDialog";
import { NewDateButton } from "@/components/blocks/newDateDialog";
import { NewSnoozeButton } from "@/components/blocks/newSnoozeDialog";
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
import {
  ActionMenu,
  ActionTrigger,
  ActionItems,
  ActionItem,
} from "@/components/animations/actionMenu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Plus, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Markdown from "react-markdown";
import { z } from "zod";

import Tiptap from "@/components/blocks/tiptap";
import { Separator } from "@/components/ui/separator";
import { getErrorMessage, dateTimeDate, cn } from "@/lib/utils";
import { toast } from "sonner";
import { staggerUp as stagger } from "@/constants/animations";
import { DaddyWithInfos } from "@/custom-types";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  profileLink: z.string().optional(),
  contactInfo: z.string().optional(),
  location: z.string().optional(),
  birthdayDate: z.string().optional(),
  messagingApp: z.string().optional(),
  notes: z.string().optional(),
  earningsEstimate: z.string().optional(),
  giftingMethod: z.string().optional(),
  vibeRating: z.string(),
});

function DisplayForm({
  daddyData,
  edit,
  setEdit,
}: {
  daddyData: DaddyWithInfos;
  edit: boolean;
  setEdit: (edit: boolean) => void;
}) {
  return (
    <motion.div>
      <Card className="flex flex-col gap-4 border-none p-4 ">
        <Button
          onClick={() => setEdit(!edit)}
          disabled={edit}
          size="sm"
          variant="secondary"
          // className="w-fit place-self-end"
        >
          <Pencil size={14} className="mr-2" />
          EDIT INFOS
        </Button>
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            className="flex grow flex-col gap-4"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={stagger}>
              <div className="space-y-1">
                <p className="text-lg font-bold">Name / Nickname</p>
                <Separator className="bg-primary/50" />
                <p className="pt-2">{daddyData.name}</p>
              </div>
            </motion.div>
            <motion.div variants={stagger}>
              <div className="space-y-1">
                <p className="text-lg font-bold">Profile Link</p>
                <Separator className="bg-primary/50" />

                {daddyData.profileLink ? (
                  <a
                    className="block pt-2 underline"
                    href={daddyData.profileLink}
                  >
                    {daddyData.profileLink}
                  </a>
                ) : (
                  <p className="pt-2">N/A</p>
                )}
              </div>
            </motion.div>
            <motion.div variants={stagger}>
              <div className="space-y-1">
                <p className="text-lg font-bold">Gifting Method</p>
                <Separator className="bg-primary/50" />
                <p className="pt-2">{daddyData.giftingMethod || "N/A"}</p>
              </div>
            </motion.div>
            <motion.div variants={stagger}>
              <div className="space-y-1">
                <p className="text-lg font-bold">Contact Info</p>
                <Separator className="bg-primary/50" />
                <p className="pt-2">{daddyData.contactInfo || "N/A"}</p>
              </div>
            </motion.div>
            <motion.div variants={stagger}>
              <div className="space-y-1">
                <p className="text-lg font-bold">Location</p>
                <Separator className="bg-primary/50" />
                <p className="pt-2">{daddyData.location || "N/A"}</p>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex grow flex-col gap-4"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={stagger}>
              <div className="space-y-1">
                <p className="text-lg font-bold">Birthday Date</p>
                <Separator className="bg-primary/50" />
                <p className="pt-2">
                  {daddyData.birthdayDate
                    ? format(daddyData.birthdayDate, "MMMM do")
                    : "N/A"}
                </p>
              </div>
            </motion.div>
            <motion.div variants={stagger}>
              <div className="space-y-1">
                <p className="text-lg font-bold">Messaging App</p>
                <Separator className="bg-primary/50" />
                <p className="pt-2">{daddyData.messagingApp || "N/A"}</p>
              </div>
            </motion.div>
            <motion.div variants={stagger}>
              <div className="space-y-1">
                <p className="text-lg font-bold">Notes</p>
                <Separator className="bg-primary/50" />
                <Markdown className="pt-2">
                  {daddyData.notes || "No notes about this daddy yet"}
                </Markdown>
              </div>
            </motion.div>
            <motion.div variants={stagger}>
              <div className="space-y-1">
                <p className="text-lg font-bold">
                  Earnings Estimate / Agreement per Date
                </p>
                <Separator className="bg-primary/50" />
                <p className="pt-2">
                  {daddyData.earningsEstimate
                    ? `$${daddyData.earningsEstimate}`
                    : "N/A"}
                </p>
              </div>
            </motion.div>
            <motion.div variants={stagger}>
              <div className="space-y-1">
                <p className="text-lg font-bold">Vibe Rating</p>
                <Separator className="bg-primary/50" />
                <p className="pt-2">{`${daddyData.vibeRating} / 5`}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

function EditForm({
  daddyData,
  setEdit,
}: {
  daddyData: DaddyWithInfos;
  edit: boolean;
  setEdit: (edit: boolean) => void;
}) {
  const updateDaddy = useMutation(api.daddies.updateDaddy);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      ...daddyData,
      birthdayDate: daddyData.birthdayDate
        ? dateTimeDate(daddyData.birthdayDate)
        : "",
      vibeRating: daddyData.vibeRating.toString(),
      earningsEstimate: daddyData.earningsEstimate?.toString() || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const formattedValues = {
      ...values,
      birthdayDate: values.birthdayDate
        ? new Date(values.birthdayDate).valueOf()
        : undefined,
      earningsEstimate: Number(values.earningsEstimate || "0"),
      vibeRating: Number(values.vibeRating),
    };

    try {
      const daddyId = updateDaddy({ daddy: daddyData._id, ...formattedValues });
      setEdit(false);
      form.reset();
      toast.success(`${values.name} updated !`);
      return daddyId;
    } catch (error) {
      toast.error(`Uh oh ! Something went wrong: ${getErrorMessage(error)}`);
    }
  }

  return (
    <motion.div>
      <Card>
        <CardContent className="pt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="grid grow grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="grow"
                  onClick={() => setEdit(false)}
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  className="grow"
                  disabled={!form.formState.isDirty}
                >
                  SAVE
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <motion.div
                  className="flex grow flex-col gap-4"
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                >
                  <motion.div variants={stagger}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormLabel>Daddy&apos;s Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Name or nickname..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  <motion.div variants={stagger}>
                    <FormField
                      control={form.control}
                      name="profileLink"
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormLabel>Profile Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Link to Daddy's profile..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  <motion.div variants={stagger}>
                    <FormField
                      control={form.control}
                      name="giftingMethod"
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormLabel>Gifting Method</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  <motion.div variants={stagger}>
                    <FormField
                      control={form.control}
                      name="contactInfo"
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormLabel>Contact Info</FormLabel>
                          <FormControl>
                            <Input placeholder="Contact info..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  <motion.div variants={stagger}>
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Location..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </motion.div>
                <motion.div
                  className="flex grow flex-col gap-4"
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                >
                  <motion.div variants={stagger}>
                    <FormField
                      control={form.control}
                      name="birthdayDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mr-6">
                            Birthday Date:{" "}
                          </FormLabel>
                          <FormControl className="w-max">
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  <motion.div variants={stagger}>
                    <FormField
                      control={form.control}
                      name="messagingApp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Messaging App</FormLabel>
                          <FormControl>
                            <Input placeholder="Messaging app..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  <motion.div variants={stagger}>
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
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
                  </motion.div>
                  <motion.div variants={stagger}>
                    <FormField
                      control={form.control}
                      name="earningsEstimate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Earnings Estimate / Agreement per Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Earnings estimate..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  <motion.div variants={stagger}>
                    <FormField
                      control={form.control}
                      name="vibeRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vibe Rating (min: 1, max: 5)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={5}
                              placeholder="Vibe rating..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </motion.div>
              </div>
              {/* <div className="flex grow flex-row items-end justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEdit(false)}
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={!form.formState.isDirty}
              >
                SAVE
              </Button>
            </div> */}
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DaddyDisplayOrEditForm({
  daddyData,
  edit,
  setEdit,
}: {
  daddyData: DaddyWithInfos;
  edit: boolean;
  setEdit: (edit: boolean) => void;
}) {
  return edit ? (
    <EditForm daddyData={daddyData} edit={edit} setEdit={setEdit} />
  ) : (
    <DisplayForm daddyData={daddyData} edit={edit} setEdit={setEdit} />
  );
}

export default function DaddyPage({
  params,
}: {
  params: { id: Id<"daddies"> };
}) {
  const daddyData = useQuery(api.daddies.getDaddyWithMetadata, {
    daddy: params.id,
  });

  const [edit, setEdit] = useState(false);

  function allowanceQueryParams() {
    if (daddyData?.daddy?.allowance) {
      return { allowance: daddyData.daddy.allowance };
    }
    return "skip";
  }

  const allowanceData = useQuery(
    api.allowances.getAllowanceWithPayments,
    allowanceQueryParams(),
  );

  if (!daddyData) return null;

  const { daddy, contacts, dates } = daddyData;
  if (!daddy) return null;

  return (
    <div className="flex h-full w-full flex-col">
      {/* <div
        onClick={goBack}
        className="text-md text-slate-700 cursor-pointer flex flex-row gap-1 items-center mb-4 w-fit"
      >
        <ChevronLeft size={24} />
        Back
      </div> */}
      <div className="mb-4 flex w-full flex-row items-center justify-between">
        <Breadcrumb className="">
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
              <BreadcrumbPage
                className={cn(
                  daddy.snooze ? "text-primary-foreground/60" : "",
                  "flex flex-row items-center gap-2",
                )}
              >
                {daddy.name}
                {daddy.snooze && daddy.unsnoozeDate && (
                  <Badge
                    variant="outline"
                    className="border-primary-foreground/60 text-primary-foreground/60"
                  >
                    snoozed until {format(new Date(daddy.unsnoozeDate), "PP")}
                  </Badge>
                )}
                {daddy.snooze && !daddy.unsnoozeDate && (
                  <Badge
                    variant="outline"
                    className="border-primary-foreground/60 text-primary-foreground/60"
                  >
                    snoozed
                  </Badge>
                )}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ActionMenu>
          <ActionTrigger>ACTIONS</ActionTrigger>
          <ActionItems>
            {/* <ActionItem>
              <Button
                onClick={() => setEdit((editStatus) => !editStatus)}
                disabled={edit}
                size="sm"
              >
                <Pencil size={14} className="mr-2" />
                EDIT INFOS
              </Button>
            </ActionItem> */}
            <ActionItem>
              <NewDateButton daddyId={daddy._id}>
                <Plus size={16} className="mr-1" /> ADD DATE
              </NewDateButton>
            </ActionItem>
            <ActionItem>
              <NewContactButton daddyId={daddy._id}>
                <Plus size={16} className="mr-1" /> ADD CONTACT
              </NewContactButton>
            </ActionItem>
            <ActionItem>
              <NewSnoozeButton daddy={daddy} />
            </ActionItem>
            {!allowanceData && (
              <ActionItem>
                <AddAllowancePlanButton
                  daddy={daddy}
                  // allowance={allowanceData?.allowance}
                >
                  <Plus size={16} className="mr-1" /> START ALLOWANCE PLAN
                </AddAllowancePlanButton>
              </ActionItem>
            )}
          </ActionItems>
        </ActionMenu>
      </div>
      <div className="flex h-full flex-col gap-4 md:grid md:grid-cols-3 xl:grid-cols-4">
        <div className="flex flex-col gap-4 md:col-span-2 xl:col-span-3">
          <Card className="border-none">
            <CardHeader>
              <CardTitle className="flex h-4 flex-row items-center justify-center gap-3">
                <p className="text-sm font-light">
                  <span className="mr-1 text-lg font-semibold">
                    ${daddy.lifetimeValue || 0}
                  </span>{" "}
                  Gifted
                </p>
                <Separator orientation="vertical" className="bg-primary" />
                <p className="text-sm font-light">
                  <span className="mr-1 text-lg font-semibold">
                    {daddy.totalCompletedDates || 0}
                  </span>{" "}
                  {` ${daddy.totalCompletedDates == 1 ? "Date" : "Dates"} Completed`}
                </p>
                <Separator orientation="vertical" className="bg-primary" />
                <p className="text-sm font-light">
                  <span className="mr-1 text-lg font-semibold">
                    {daddy.totalScheduledDates || 0}
                  </span>
                  {`${daddy.totalScheduledDates == 1 ? " Date" : " Dates"} Scheduled`}
                </p>
                <Separator orientation="vertical" className="bg-primary" />
                <p className="text-sm font-light">
                  <span className="mr-1 text-lg font-semibold">
                    {daddy.totalContacts || 0}
                  </span>{" "}
                  {` ${daddy.totalContacts == 1 ? "Contact" : "Contacts"}`}
                </p>
              </CardTitle>
            </CardHeader>
          </Card>

          <AllowanceLink
            daddy={daddy}
            allowanceData={allowanceData?.allowance}
          />
          {/* <Plus size={16} className="mr-1" /> START ALLOWANCE PLAN
          </AddAllowancePlanButton> */}
          <DaddyDisplayOrEditForm
            daddyData={daddy}
            edit={edit}
            setEdit={setEdit}
          />
        </div>

        <div className="flex h-full flex-col gap-4 md:justify-between">
          <EventLog
            contacts={contacts}
            dates={dates}
            allowancePayments={allowanceData?.allowancePayments}
          />
          <Card className="border-none shadow-md">
            <CardHeader className="py-4">
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row gap-2">
              <ArchiveDaddyButton daddy={daddy._id} name={daddy.name} />
              <DeleteDaddyButton daddy={daddy._id} name={daddy.name} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
