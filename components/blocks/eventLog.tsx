import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { formatDistance } from "date-fns";
import {
  CalendarFold,
  ChevronRight,
  MessageSquareMore,
  Gift,
} from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { motion } from "framer-motion";
import { staggerUp as stagger } from "@/constants/animations";
import { useState } from "react";
import { cn } from "@/lib/utils";

type TimelineEvent = Doc<"contacts"> | Doc<"dates"> | Doc<"allowancePayments">;

export default function EventLog({
  contacts,
  dates,
  allowancePayments,
}: {
  contacts: Doc<"contacts">[];
  dates: Doc<"dates">[];
  allowancePayments?: Doc<"allowancePayments">[];
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  // create a function that takes contact and dates, order them by date, and returns two arrays, one with the incoming contacts and dates and one with the past contacts and dates
  function orderEvents(contacts: Doc<"contacts">[], dates: Doc<"dates">[]) {
    // first, map over both arrays and add a type property to each object
    // contacts = contacts.map((contact) => {
    //   return { ...contact, eventType: "contact" };
    // });
    // dates = dates.map((date) => {
    //   return { ...date, eventType: "date" };
    // });
    const payments = allowancePayments || [];
    const allEvents = [...contacts, ...dates, ...payments];
    const orderedEvents = allEvents.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    const incomingEvents = orderedEvents.filter((event) => {
      return new Date(event.date).getTime() > new Date().getTime();
    });
    const pastEvents = orderedEvents.filter((event) => {
      return new Date(event.date).getTime() < new Date().getTime();
    });
    return { incomingEvents, pastEvents };
  }

  const { incomingEvents, pastEvents } = orderEvents(contacts, dates);
  console.log({ incomingEvents, pastEvents });

  function formatEventDate(date: number) {
    return formatDistance(new Date(date), new Date(), {
      addSuffix: true,
    });
  }

  function EventStatus({ timelineEvent }: { timelineEvent: Doc<"dates"> }) {
    const past = new Date(timelineEvent.date).getTime() < new Date().getTime();
    if (!past && timelineEvent.status === "scheduled") {
      return (
        <Badge
          className="w-fit border-cyan-500 font-light text-cyan-500"
          variant="outline"
        >
          Scheduled
        </Badge>
      );
    } else if (timelineEvent.status === "canceled") {
      return (
        <Badge
          className="w-fit border-red-600 font-light text-red-600"
          variant="outline"
        >
          Canceled
        </Badge>
      );
    } else if (timelineEvent.status === "scheduled" || !timelineEvent.status) {
      return (
        <Badge
          className="w-fit border-red-500 font-medium"
          variant="destructive"
        >
          TO PROCESS
        </Badge>
      );
    } else if (timelineEvent.status === "completed") {
      return (
        <Badge
          className="w-fit border-emerald-500 bg-emerald-500 font-medium text-white"
          variant="outline"
        >
          {timelineEvent.giftAmount
            ? `+ $${timelineEvent.giftAmount}`
            : "Completed"}
        </Badge>
      );
    }
  }

  function ContactDisplayer({
    timelineEvent,
  }: {
    timelineEvent: Doc<"contacts">;
  }) {
    return (
      <Link
        href={`/contacts/${timelineEvent._id}`}
        className="event flex items-start justify-between gap-4"
      >
        <div className="grid gap-1">
          <div className="text-md flex flex-row items-center gap-1 font-medium text-cyan-500">
            <MessageSquareMore size={16} />
            <div className="flex flex-row items-baseline gap-2">
              Contact
              <span className="text-xs font-light text-muted-foreground">
                {formatEventDate(timelineEvent.date)}
              </span>
            </div>
          </div>
          <Markdown
            className={cn(
              hovered == timelineEvent._id || hovered == null
                ? ""
                : "opacity-70",
              "text-sm transition-all",
            )}
          >
            {timelineEvent.notes
              ? timelineEvent.notes
              : "No notes for this contact"}
          </Markdown>
        </div>
        <motion.div
          animate={{
            scale: hovered == timelineEvent._id ? 1.5 : 1,
          }}
        >
          <ChevronRight size={20} />
        </motion.div>
      </Link>
    );
  }

  function AllowanceDisplayer({
    timelineEvent,
  }: {
    timelineEvent: Doc<"allowancePayments">;
  }) {
    return (
      <Link
        href={`/daddies/${timelineEvent.daddy}/allowance/${timelineEvent.allowanceId}`}
        className="event flex items-start justify-between gap-2"
      >
        <div className="grid gap-1">
          <div className="text-md flex flex-row items-center gap-1 font-medium text-violet-700">
            <Gift size={16} />
            <div className="flex flex-row items-baseline gap-2">
              Allowance
              <span className="text-xs font-light text-muted-foreground">
                {formatEventDate(timelineEvent.date)}
              </span>
            </div>
          </div>

          <div>
            <Badge
              className="w-fit border-violet-500 bg-violet-500 font-medium text-white"
              variant="outline"
            >
              + ${timelineEvent.amount}
            </Badge>
          </div>
        </div>

        <motion.div
          animate={{
            scale: hovered == timelineEvent._id ? 1.5 : 1,
          }}
        >
          <ChevronRight size={20} />
        </motion.div>
      </Link>
    );
  }

  function DateDisplayer({ timelineEvent }: { timelineEvent: Doc<"dates"> }) {
    return (
      <Link
        href={`/dates/${timelineEvent._id}`}
        className="event flex items-start justify-between gap-2"
      >
        <div className="grid gap-1">
          <div className="text-md flex flex-row items-center gap-1 font-medium text-emerald-700">
            <CalendarFold size={16} />
            <div className="flex flex-row items-baseline gap-2">
              Date
              <span className="text-xs font-light text-muted-foreground">
                {formatEventDate(timelineEvent.date)}
              </span>
            </div>
          </div>

          <EventStatus timelineEvent={timelineEvent} />
        </div>

        <motion.div
          animate={{
            scale: hovered == timelineEvent._id ? 1.5 : 1,
          }}
        >
          <ChevronRight size={20} />
        </motion.div>
      </Link>
    );
  }

  function EventDisplayer(timelineEvents: TimelineEvent[]) {
    function dispatchEvent(timelineEvent: TimelineEvent) {
      if ("dateDaddy" in timelineEvent) {
        return <DateDisplayer timelineEvent={timelineEvent} />;
      } else if ("amount" in timelineEvent) {
        return <AllowanceDisplayer timelineEvent={timelineEvent} />;
      } else if ("contactDaddy" in timelineEvent)
        return <ContactDisplayer timelineEvent={timelineEvent} />;
    }

    return timelineEvents.map((timelineEvent) => {
      return (
        <motion.div
          key={timelineEvent._id}
          variants={stagger}
          animate={{
            opacity: hovered == timelineEvent._id || hovered == null ? 1 : 0.7,
            filter:
              hovered == timelineEvent._id || hovered == null
                ? "none"
                : "grayscale(0.7)",
          }}
          onHoverStart={() => setHovered(timelineEvent._id)}
          onHoverEnd={() => setHovered(null)}
          className="flex flex-col gap-2"
        >
          {dispatchEvent(timelineEvent)}
        </motion.div>
      );
    });
  }

  return (
    <Card className="grow">
      <CardHeader className="shadow-sm">
        <CardTitle className="text-xl">Timeline</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[550px]">
        <CardContent>
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="-mt-2 flex flex-col"
          >
            <motion.h3
              variants={stagger}
              className="mb-2 mt-6 text-lg font-semibold"
            >
              Upcoming Events
            </motion.h3>

            {EventDisplayer(incomingEvents)}

            <motion.h3
              variants={stagger}
              className="mb-2 mt-4 text-lg font-semibold"
            >
              Past Events
            </motion.h3>

            {EventDisplayer(pastEvents)}
          </motion.div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
