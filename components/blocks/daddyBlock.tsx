import { Star, Wallet, CircleAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formatDistance, isThisWeek } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { Separator } from "../ui/separator";
import { Doc } from "@/convex/_generated/dataModel";

//make a StarRating component that fakes a number of stars based on a stars prop from 1 to 5 , use the star icons from lucide
function StarRating({ stars = 0 }: { stars: number }) {
  return (
    <div className="flex flex-row gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          className={`${i < stars ? "text-primary" : "text-muted-foreground/50"}`}
        />
      ))}
    </div>
  );
}

function AllowanceIcon() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Wallet
            size={18}
            className="text-primary transition-all hover:scale-105"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>You are on allowance with this daddy.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function DateComingUp({ nextDate }: { nextDate?: number }) {
  if (!nextDate) {
    return <div className="opacity-0">No date planned</div>;
  }

  const dateText = formatDistance(new Date(nextDate), new Date(), {
    addSuffix: true,
  });

  function classnames(date: number) {
    return cn({
      "text-primary": isThisWeek(new Date(date), { weekStartsOn: 1 }),
      "font-semibold": true,
    });
  }

  return (
    <div className="flex flex-row items-center gap-1">
      <CircleAlert size={14} /> Date coming up{" "}
      <span className={classnames(nextDate)}>{dateText}</span>
    </div>
  );
}

export default function DaddyBlock({ daddy }: { daddy: Doc<"daddies"> }) {
  return (
    <Link href={`/daddies/${daddy._id}`}>
      <Card className="border-none transition-all hover:shadow-xl">
        <CardHeader className="flex flex-row justify-between space-y-0 pb-4">
          <CardTitle className="flex h-full flex-col justify-between text-xl font-medium">
            <div className="flex flex-row items-center gap-1 text-lg">
              {daddy.allowance && <AllowanceIcon />}
              {daddy.name}
            </div>
            <StarRating stars={daddy.vibeRating || 0} />
          </CardTitle>
          <div className="flex flex-col items-end gap-2">
            <div className="text-sm font-light">
              <DateComingUp nextDate={daddy.nextDateDate} />
            </div>
            <div className="flex h-3 items-center space-x-2 text-xs font-light">
              <div>
                <span className="mr-1 text-sm font-semibold">
                  {daddy.totalDates || "0"}
                </span>
                Dates
              </div>
              <Separator orientation="vertical" className="bg-primary" />
              <div>
                <span className="mr-1 text-sm font-semibold">
                  {daddy.totalContacts}
                </span>
                Contacts
              </div>
              <Separator orientation="vertical" className="bg-primary" />
              <div>
                <span className="mr-1 text-sm font-semibold">
                  ${daddy.lifetimeValue || 0}
                </span>
                Lifetime Value
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
