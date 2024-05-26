import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { format, formatDistance, isAfter } from "date-fns";
import {
  ChevronRight,
  MessageSquareHeart,
  CalendarCheck2,
  CalendarMinus,
  CircleAlert,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface UpcomingDatesProps {
  dates: Doc<"dates">[];
}

function formatDate(date: number) {
  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
  });
}

function DisplayDate({ date }: { date: Doc<"dates"> }) {
  return (
    <Link href={`/dates/${date._id}`} className="group flex flex-row">
      <div className="grow">
        <div className="text-md font-semibold decoration-primary group-hover:underline">
          {formatDate(date.date)}{" "}
          <span className="text-sm font-light">- {format(date.date, "p")}</span>
        </div>
        <div className="text-sm font-medium">{date.daddyName}</div>
      </div>
      <div className="flex items-center justify-center">
        <ChevronRight className="h-6 w-6 transition-all group-hover:scale-125 group-hover:text-primary" />
      </div>
    </Link>
  );
}

export function ToProcessDates({ dates }: UpcomingDatesProps) {
  const toProcessDates = dates
    .filter((date) => date.status == "tentative" || date.status == "confirmed")
    .filter((date) => new Date(date.date).getTime() < new Date().getTime());

  if (!toProcessDates || toProcessDates.length == 0) return null;

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-semibold">
          Dates to Process
        </CardTitle>
        <CircleAlert className="h-6 w-6 text-primary/80" />
      </CardHeader>

      <CardContent>
        <Separator className="mb-4 bg-primary/50" />
        {toProcessDates.length === 0 && (
          <div className="flex h-[100px] flex-col items-center justify-center">
            <div className="text-4xl">🎉</div>
            <div className="text-lg">No dates to process!</div>
          </div>
        )}
        {toProcessDates.length > 0 && (
          <div className="mb-4">
            <ul className="flex flex-col gap-2">
              {toProcessDates.map((date) => (
                <DisplayDate key={date._id} date={date} />
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function UpcomingDates({ dates }: UpcomingDatesProps) {
  // filter out dates that are in the past
  const upcomingDates = dates
    .filter((date) => isAfter(new Date(date.date), new Date()))
    .filter((date) => date.status !== "canceled")
    .sort((a, b) => a.date - b.date);

  const confirmedDates = upcomingDates.filter(
    (date) => date.status === "confirmed",
  );
  const tentativeDates = upcomingDates.filter(
    (date) => date.status !== "confirmed",
  );

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-semibold">Upcoming Dates</CardTitle>
        <MessageSquareHeart className="h-6 w-6 text-primary/80" />
      </CardHeader>

      <CardContent>
        <Separator className="mb-4 bg-primary/50" />
        {upcomingDates.length === 0 && (
          <div className="flex h-[100px] flex-col items-center justify-center">
            <div className="text-4xl">🥲</div>
            <div className="text-lg">No upcoming dates!</div>
          </div>
        )}
        {confirmedDates.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 mt-2 inline-flex place-items-center gap-2 text-xl font-semibold">
              <CalendarCheck2 size={20} className="text-primary/80" /> Confirmed
              Dates
            </h3>
            <ul className="flex flex-col gap-2">
              {confirmedDates.map((date) => (
                <DisplayDate key={date._id} date={date} />
              ))}
            </ul>
          </div>
        )}
        {tentativeDates.length > 0 && (
          <>
            <h3 className="mb-2 mt-2 inline-flex place-items-center gap-2 text-xl font-semibold opacity-80">
              <CalendarMinus size={20} /> Tentative Dates
            </h3>
            <ul className="flex flex-col gap-2 opacity-75">
              {tentativeDates.map((date) => (
                <DisplayDate key={date._id} date={date} />
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
