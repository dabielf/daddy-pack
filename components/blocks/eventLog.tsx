import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { format, formatDistance } from "date-fns";
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

  function formatEventDate(date: number) {
    return formatDistance(new Date(date), new Date(), {
      addSuffix: true,
    });
  }

  function EventStatus({ timelineEvent }: { timelineEvent: Doc<"dates"> }) {
    const past = new Date(timelineEvent.date).getTime() < new Date().getTime();
    if (!past) {
      if (timelineEvent.status === "tentative") {
        return (
          <Badge
            className="border-dpblue text-dpblue w-fit font-normal"
            variant="outline"
          >
            TENTATIVE
          </Badge>
        );
      }
      if (timelineEvent.status === "confirmed") {
        return (
          <Badge
            className="bg-dpblue w-fit border-none font-normal text-white"
            variant="outline"
          >
            CONFIRMED
          </Badge>
        );
      }
    }

    if (timelineEvent.status === "canceled") {
      return (
        <Badge
          className="bg-dpred w-fit border-none font-normal text-white"
          variant="outline"
        >
          CANCELED
        </Badge>
      );
    } else if (timelineEvent.status === "completed") {
      return (
        <Badge
          className="bg-dpgreen-muted w-fit border-none font-normal text-white"
          variant="outline"
        >
          {timelineEvent.giftAmount
            ? `+ $${timelineEvent.giftAmount}`
            : "COMPLETED"}
        </Badge>
      );
    } else if (timelineEvent.status === "no-show") {
      return (
        <Badge
          className="bg-dpred w-fit border-none font-normal text-white"
          variant="outline"
        >
          NO SHOW
        </Badge>
      );
    }

    return (
      <Badge
        className="bg-dpred w-fit border-none font-normal text-white"
        variant="destructive"
      >
        TO PROCESS
      </Badge>
    );
  }

  function ContactDisplayer({
    timelineEvent,
  }: {
    timelineEvent: Doc<"contacts">;
  }) {
    return (
      <Link
        href={`/contacts/${timelineEvent._id}`}
        className="event flex items-start justify-between"
      >
        <div className="grid">
          <div className="text-md text-dpblue flex flex-row items-center gap-1 font-medium">
            <MessageSquareMore size={16} />
            <div>Contact</div>
          </div>
          <span className="mb-1 text-xs font-light text-muted-foreground">
            {formatEventDate(timelineEvent.date)} -{" "}
            {format(timelineEvent.date, "p")}
          </span>
          <Markdown className="text-xs transition-all">
            {timelineEvent.notes
              ? timelineEvent.notes
              : "No notes for this contact"}
          </Markdown>
        </div>
        <motion.div
          animate={{
            scale: hovered == timelineEvent._id ? 1.5 : 1,
          }}
          className="pt-2"
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
        className="event flex items-start justify-between"
      >
        <div className="grid">
          <div className="text-md text-allowance flex flex-row items-center gap-1 font-medium">
            <Gift size={16} />
            <div className="mr-1">Allowance</div>
            <Badge
              className="bg-allowance-muted w-fit border-none font-medium text-white"
              variant="outline"
            >
              + ${timelineEvent.amount}
            </Badge>
          </div>
          <span className="mb-1 text-xs font-light text-muted-foreground">
            {formatEventDate(timelineEvent.date)} -{" "}
            {format(timelineEvent.date, "p")}
          </span>
        </div>

        <motion.div
          animate={{
            scale: hovered == timelineEvent._id ? 1.5 : 1,
          }}
          className="pt-2"
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
        className="event flex items-start justify-between"
      >
        <div className="grid">
          <div className="text-md text-dpgreen flex flex-row items-center gap-1 font-medium">
            <CalendarFold size={16} />
            <div className="mr-1">Date</div>
            <EventStatus timelineEvent={timelineEvent} />
          </div>
          <span className="mb-1 text-xs font-light text-muted-foreground">
            {formatEventDate(timelineEvent.date)} -{" "}
            {format(timelineEvent.date, "p")}
          </span>
        </div>

        <motion.div
          animate={{
            scale: hovered == timelineEvent._id ? 1.5 : 1,
          }}
          className="pt-2"
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
          onHoverStart={() => setHovered(timelineEvent._id)}
          onHoverEnd={() => setHovered(null)}
          className="pb-2"
        >
          {dispatchEvent(timelineEvent)}
        </motion.div>
      );
    });
  }

  return (
    <Card className="border-none">
      <CardHeader className="py-2 shadow">
        <CardTitle className="text-xl text-primary">History</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[650px]">
        <CardContent>
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="-mt-2 flex flex-col"
          >
            <motion.h3
              variants={stagger}
              className="mb-4 mt-6 text-lg font-semibold"
            >
              Upcoming Events
            </motion.h3>

            {incomingEvents.length > 0 ? (
              EventDisplayer(incomingEvents)
            ) : (
              <div className="text-sm font-light italic">
                No upcoming events at the moment...
              </div>
            )}

            <motion.h3
              variants={stagger}
              className="mb-4 mt-2 text-lg font-semibold"
            >
              Previous Events
            </motion.h3>
            {pastEvents.length > 0 ? (
              EventDisplayer(pastEvents)
            ) : (
              <div className="text-sm font-light italic">
                No past events yet...
              </div>
            )}
          </motion.div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
