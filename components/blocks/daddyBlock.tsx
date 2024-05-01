import { Star, Wallet } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { formatDistance } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import Link from 'next/link';
import { Separator } from '../ui/separator';
import { Doc } from '@/convex/_generated/dataModel';

//make a StarRating component that fakes a number of stars based on a stars prop from 1 to 5 , use the star icons from lucide
function StarRating({ stars = 0 }: { stars: number }) {
  return (
    <div className="flex flex-row gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={`${i < stars ? 'text-primary' : 'text-muted-foreground/50'}`}
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
            className="transition-all hover:scale-105 text-primary"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>You are on allowance with this daddy.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function DaddyBlock({ daddy }: { daddy: Doc<'daddies'> }) {
  return (
    <Link href={`/daddies/${daddy._id}`}>
      <Card className="hover:shadow-xl hover:border-slate-500 border-slate-300 transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-medium">
            <div className="flex flex-col">
              <div className="text-xl flex flex-row gap-1 items-center">
                {daddy.allowance && <AllowanceIcon />}
                {daddy.name}
              </div>
              <StarRating stars={daddy.vibeRating || 0} />
            </div>
          </CardTitle>
          <div className="text-xs flex h-4 items-center space-x-2">
            <div>
              <span className="text-base mr-1">{daddy.totalDates || '0'}</span>
              Dates
            </div>
            <Separator orientation="vertical" className="bg-primary" />
            <div>
              <span className="text-base mr-1">{daddy.totalContacts}</span>
              Contacts
            </div>
            <Separator orientation="vertical" className="bg-primary" />
            <div>
              <span className="text-base mr-1">
                ${daddy.lifetimeValue || 0}
              </span>
              Lifetime Value
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-row gap-2 ">
            <div className="flex flex-col grow">
              <div className="flex flex-row gap-2 items-baseline">
                <div className="text-baseline font-bold w-2">
                  {daddy.totalScheduledDates || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Dates Scheduled/To Process
                </p>
              </div>
              <div className="flex flex-row gap-1 items-baseline">
                <div className="text-baseline font-bold w-3">
                  {daddy.totalCompletedDates || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  Dates Completed
                </div>
              </div>
              <div className="flex flex-row gap-2 items-baseline">
                <div className="text-baseline font-bold w-3">
                  {daddy.totalCanceledDates || 0 + daddy.totalNoShowDates || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Canceled / No Show
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2 items-baseline justify-end">
                <p className="text-xs text-muted-foreground">Next Date:</p>
                <div className="text-baseline font-bold">
                  {daddy.nextDateDate
                    ? formatDistance(new Date(daddy.nextDateDate), new Date(), {
                        addSuffix: true,
                      })
                    : 'No Date Planned'}
                </div>
              </div>
              <div className="flex flex-row gap-2 items-baseline justify-end">
                <p className="text-xs text-muted-foreground">
                  Most Recent Date:
                </p>
                <div className="text-baseline font-bold">
                  {daddy.mostRecentDateDate
                    ? formatDistance(
                        new Date(daddy.mostRecentDateDate),
                        new Date(),
                        { addSuffix: true },
                      )
                    : 'N/A'}
                </div>
              </div>
              <div className="flex flex-row gap-2 items-baseline justify-end">
                <p className="text-xs text-muted-foreground">
                  Most Recent Contact:
                </p>
                <div className="text-baseline font-bold">
                  {daddy.mostRecentContactDate
                    ? formatDistance(
                        new Date(daddy.mostRecentContactDate),
                        new Date(),
                        { addSuffix: true },
                      )
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
