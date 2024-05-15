import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { subDays, formatDistance, isBefore } from "date-fns";
import { ChevronRight, MessageSquareHeart } from "lucide-react";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface NeedSomeLoveProps {
  daddies: Doc<"daddies">[];
}

function formatMostRecentDate(date: number | undefined) {
  if (!date) {
    return "No Date yet.";
  }

  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
  });
}

function formatMostRecentContact(date: number | undefined) {
  if (!date) {
    return "No Contact yet.";
  }

  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
  });
}

export function NeedSomeLove({ daddies }: NeedSomeLoveProps) {
  // filter daddies where mostRecentDate and mostRecentContact are moth more than 7 days ago
  const daddiesNeedLove = daddies.filter((daddy) => {
    const mostRecentDate = daddy.mostRecentDateDate || 0;
    const mostRecentContact = daddy.mostRecentContactDate || 0;

    if (daddy.nextDateDate) {
      return false;
    }

    if (daddy.snooze) {
      return false;
    }

    const sevenDaysAgo = subDays(new Date(), 7);
    return (
      isBefore(new Date(mostRecentDate), sevenDaysAgo) &&
      isBefore(new Date(mostRecentContact), sevenDaysAgo)
    );
  });

  function DisplayDaddy({ daddy }: { daddy: Doc<"daddies"> }) {
    return (
      <Link href={`/daddies/${daddy._id}`} className="group flex flex-row">
        <div className="grow">
          <div className="text-lg font-semibold decoration-primary group-hover:underline">
            {daddy.name}
          </div>
          <div className="text-sm">
            Last Contact: {formatMostRecentContact(daddy.mostRecentContactDate)}
          </div>
          <div className="text-sm">
            Last Date: {formatMostRecentDate(daddy.mostRecentDate)}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <ChevronRight className="h-6 w-6 transition-all group-hover:scale-125 group-hover:text-primary" />
        </div>
      </Link>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-semibold">
          They need some love...
        </CardTitle>
        <MessageSquareHeart className="h-6 w-6 text-primary" />
      </CardHeader>

      <CardContent>
        <Separator className="mb-4 bg-primary/50" />
        {daddiesNeedLove.length === 0 && (
          <div className="flex h-[100px] flex-col items-center justify-center">
            <div className="mb-4 text-4xl">🎉</div>

            <div className="text-lg leading-3">You&apos;re up to date!</div>
            <div className="text-lg">No Daddy needs contacting right now.</div>
          </div>
        )}
        {daddiesNeedLove.length > 0 && (
          <ul className="flex flex-col gap-4">
            {daddiesNeedLove.map((daddy) => (
              <DisplayDaddy key={daddy._id} daddy={daddy} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
