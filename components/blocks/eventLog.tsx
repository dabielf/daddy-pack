import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { formatDistance } from "date-fns";
import { CalendarFold, ChevronRight, MessageSquareMore } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { motion } from "framer-motion";
import { staggerUp as stagger } from "@/constants/animations";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function EventLog({
  contacts,
  dates,
}: {
  contacts: Doc<"contacts">[];
  dates: Doc<"dates">[];
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  // create a function that takes contact and dates, order them by date, and returns two arrays, one with the incoming contacts and dates and one with the past contacts and dates
  function orderEvents(contacts: Doc<"contacts">[], dates: Doc<"dates">[]) {
    // first, map over both arrays and add a type property to each object
    contacts = contacts.map((contact) => {
      return { ...contact, eventType: "contact" };
    });
    dates = dates.map((date) => {
      return { ...date, eventType: "date" };
    });
    const allEvents = [...contacts, ...dates];
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

  type DaddyEvent = {
    eventType?: string;
    status?: string;
  };

  function formatEventDate(date: number) {
    return formatDistance(new Date(date), new Date(), {
      addSuffix: true,
    });
  }

  type extendedContact = Doc<"contacts"> & DaddyEvent;
  type extendedDate = Doc<"dates"> & DaddyEvent;

  function EventStatus({ event }: { event: extendedDate }) {
    const past = new Date(event.date).getTime() < new Date().getTime();
    if (!past && event.status === "scheduled") {
      return (
        <Badge
          className="w-fit border-cyan-500 font-light text-cyan-500"
          variant="outline"
        >
          Scheduled
        </Badge>
      );
    } else if (event.status === "canceled") {
      return (
        <Badge
          className="w-fit border-red-600 font-light text-red-600"
          variant="outline"
        >
          Canceled
        </Badge>
      );
    } else if (event.status === "scheduled" || !event.status) {
      return (
        <Badge
          className="w-fit border-red-500 font-medium"
          variant="destructive"
        >
          TO PROCESS
        </Badge>
      );
    } else if (event.status === "completed") {
      return (
        <Badge
          className="w-fit border-emerald-500 bg-emerald-500 font-medium text-white"
          variant="outline"
        >
          {event.giftAmount ? `+ $${event.giftAmount}` : "Completed"}
        </Badge>
      );
    }
  }

  function DateDisplayer(event: extendedDate) {
    return (
      <motion.div
        key={event._id}
        variants={stagger}
        animate={{
          opacity: hovered == event._id || hovered == null ? 1 : 0.7,
          filter:
            hovered == event._id || hovered == null ? "none" : "grayscale(0.7)",
        }}
        onHoverStart={() => setHovered(event._id)}
        onHoverEnd={() => setHovered(null)}
      >
        <Link
          href={`/dates/${event._id}`}
          className="event flex items-start justify-between gap-2"
        >
          <div className="grid gap-1">
            <div className="flex flex-row items-center gap-1 text-lg font-medium text-emerald-700">
              <CalendarFold size={16} />
              <div className="flex flex-row items-baseline gap-2">
                Date
                <span className="text-xs font-light text-muted-foreground">
                  {formatEventDate(event.date)}
                </span>
              </div>
            </div>

            <EventStatus event={event} />
          </div>

          <motion.div
            animate={{
              scale: hovered == event._id ? 1.5 : 1,
            }}
          >
            <ChevronRight className="mt-2" size={20} />
          </motion.div>
        </Link>
      </motion.div>
    );
  }

  function EventDisplayer(event: extendedContact | extendedDate) {
    if ("giftAmount" in event) {
      return DateDisplayer(event);
    } else if (event.eventType === "contact") {
      return (
        <motion.div
          key={event._id}
          variants={stagger}
          animate={{
            opacity: hovered == event._id || hovered == null ? 1 : 0.7,
            filter:
              hovered == event._id || hovered == null
                ? "none"
                : "grayscale(0.7)",
          }}
          onHoverStart={() => setHovered(event._id)}
          onHoverEnd={() => setHovered(null)}
        >
          <Link
            href={`/contacts/${event._id}`}
            className="event flex items-start justify-between gap-4"
          >
            <div className="grid gap-1">
              <div className="flex flex-row items-center gap-1 text-lg font-medium text-cyan-500">
                <MessageSquareMore size={16} />
                <div className="flex flex-row items-baseline gap-2">
                  Contact
                  <span className="text-xs font-light text-muted-foreground">
                    {formatEventDate(event.date)}
                  </span>
                </div>
              </div>

              <Markdown
                className={cn(
                  hovered == event._id || hovered == null ? "" : "opacity-70",
                  "text-sm transition-all",
                )}
              >
                {event.notes || "No notes for this contact"}
              </Markdown>
            </div>
            <motion.div
              animate={{
                scale: hovered == event._id ? 1.5 : 1,
              }}
            >
              <ChevronRight className="mt-2" size={20} />
            </motion.div>
          </Link>
        </motion.div>
      );
    }
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
            className="-mt-2 flex flex-col gap-2"
          >
            <motion.h3 variants={stagger} className="mt-6 text-lg font-bold">
              Upcoming Events
            </motion.h3>
            {incomingEvents.map(EventDisplayer)}
            <motion.h3 variants={stagger} className="mt-2 text-lg font-bold">
              Past Events
            </motion.h3>
            {pastEvents.map(EventDisplayer)}
          </motion.div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
