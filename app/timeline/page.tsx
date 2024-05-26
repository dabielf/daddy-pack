"use client";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import {
  CircleDollarSign,
  CalendarIcon,
  Gift,
  ChevronRight,
  ThumbsDown,
} from "lucide-react";
import { format, isBefore } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
// import { motion } from "framer-motion";
//

function ContactDisplayer({ event }: { event: Doc<"events"> }) {
  if (
    !event.daddyName ||
    !event.eventDate ||
    !event.eventRefDate ||
    !event.eventRef
  )
    return null;
  return (
    <Link
      href={`/contacts/${event.eventRef}`}
      className="event group flex items-start justify-between"
    >
      <div className="">
        <span className="text-sm font-semibold text-foreground">
          {format(event.eventDate, "eeee, P p")}
        </span>
        <div className="flex flex-row items-center gap-1 text-base font-medium text-dpblue">
          <CalendarIcon size={16} />
          <div className="mr-1">New Contact</div>
        </div>
        <Badge
          className="w-fit border-none bg-dpblue-muted text-xs font-medium text-white"
          variant="outline"
        >
          {/* <div className="text-xs"> */}
          <span className="mr-1 font-thin">with</span>
          {event.daddyName}
          {/* </div> */}
        </Badge>
      </div>

      <div className="group:hover:scale-125 pt-1">
        <ChevronRight size={20} />
      </div>
    </Link>
  );
}

function DateNoShowDisplayer({ event }: { event: Doc<"events"> }) {
  if (!event.daddyName || !event.eventRefDate || !event.eventRef) return null;
  return (
    <Link
      href={`/dates/${event.eventRef}`}
      className="event group flex items-start justify-between"
    >
      <div className="">
        <span className="text-sm font-semibold text-foreground">
          {format(event.eventRefDate, "eeee, P p")}
        </span>
        <div className="flex flex-row items-center gap-1 text-base font-light text-dpred">
          <ThumbsDown size={16} />
          <div className="mr-1 font-semibold">
            {event.daddyName} fucked up !
          </div>
        </div>
        <Badge
          className="w-fit border-none bg-dpred-muted text-xs font-medium text-white"
          variant="outline"
        >
          NO SHOW
        </Badge>
        {/* <span className="mb-1 text-xs font-light text-muted-foreground">
          {format(event.eventRefDate || new Date(), "PPPP - p")}
        </span> */}
      </div>

      <div className="group:hover:scale-125 pt-1">
        <ChevronRight size={20} />
      </div>
    </Link>
  );
}

function DateConfirmedDisplayer({ event }: { event: Doc<"events"> }) {
  if (!event.daddyName || !event.eventRefDate || !event.eventRef) return null;
  return (
    <Link
      href={`/dates/${event.eventRef}`}
      className="event group flex items-start justify-between"
    >
      <div className="">
        <span className="text-sm font-semibold text-foreground">
          {format(event.eventDate, "eeee, P p")}
        </span>
        <div className="flex flex-row items-center gap-1 text-base font-light text-dpgreen">
          <CalendarIcon size={16} />
          <div className="mr-1 font-semibold">
            Date Confirmed
            <span className="ml-1 text-xs font-semibold text-muted-foreground">
              {format(event.eventRefDate, "P p")}
            </span>
          </div>
        </div>
        <Badge
          className="w-fit border-none bg-dpgreen-muted text-xs font-medium text-white"
          variant="outline"
        >
          <span className="mr-1 font-thin">with</span>
          {event.daddyName}
        </Badge>
      </div>

      <div className="group:hover:scale-125 pt-1">
        <ChevronRight size={20} />
      </div>
    </Link>
  );
}

function DateScheduledDisplayer({ event }: { event: Doc<"events"> }) {
  if (
    !event.daddyName ||
    !event.eventDate ||
    !event.eventRefDate ||
    !event.eventRef
  )
    return null;
  return (
    <Link
      href={`/dates/${event.eventRef}`}
      className="event group flex items-start justify-between"
    >
      <div className="">
        <span className="text-sm font-semibold text-foreground">
          {format(event.eventDate, "eeee, P p")}
        </span>
        <div className="flex flex-row items-center gap-1 text-base font-medium text-dpblue">
          <CalendarIcon size={16} />
          <div className="mr-1">
            New Date Scheduled
            <span className="ml-1 text-xs font-semibold text-muted-foreground">
              {format(event.eventRefDate, "P p")}
            </span>
          </div>
        </div>
        <Badge
          className="w-fit border-none bg-dpblue-muted text-xs font-medium text-white"
          variant="outline"
        >
          {/* <div className="text-xs"> */}
          <span className="mr-1 font-thin">with</span>
          {event.daddyName}
          {/* </div> */}
        </Badge>
      </div>

      <div className="group:hover:scale-125 pt-1">
        <ChevronRight size={20} />
      </div>
    </Link>
  );
}

function EventDisplayer({ event }: { event: Doc<"events"> }) {
  switch (event.eventType) {
    case "contact":
      return <ContactDisplayer event={event} />;
    case "dateScheduled":
      return <DateScheduledDisplayer event={event} />;
    case "dateNoShow":
      return <DateNoShowDisplayer event={event} />;
    case "dateConfirmed":
      return <DateConfirmedDisplayer event={event} />;
    case "date":
      return (
        <div>
          <CircleDollarSign />
        </div>
      );
    default:
      return <div>Undefined Event: {event.eventType}</div>;
  }
}

export default function Timeline() {
  const { results, status, isLoading, loadMore } = usePaginatedQuery(
    api.users.getUserEvents,
    {},
    { initialNumItems: 5 },
  );

  const orderedResults = results.sort((a, b) => b.eventDate - a.eventDate);
  return (
    <div className="flex flex-grow flex-col gap-4">
      <div className="mb-4 flex flex-row items-center justify-between">
        <div className=" flex flex-row gap-4">
          <h1 className="text-3xl font-semibold">Timeline</h1>
        </div>
      </div>
      <div className="mx-auto max-w-lg space-y-4">
        {!!orderedResults.length &&
          orderedResults.map((event) => (
            <div key={event._id}>
              <EventDisplayer event={event} />
            </div>
          ))}
        <Button
          onClick={() => loadMore(1)}
          disabled={status !== "CanLoadMore"}
          className="mt-8"
        >
          Load More
        </Button>
      </div>
    </div>
  );
}
