import { Star, Wallet, CircleAlert } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { formatDistance, isThisWeek } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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
          size={12}
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

function DateComingUp({ nextDate }: { nextDate?: number }) {
  if (!nextDate) {
    return <div className="opacity-0">No date planned</div>;
  }

  const dateText = formatDistance(new Date(nextDate), new Date(), {
    addSuffix: true,
  });

  function classnames(date: number) {
    return cn({
      'text-primary': isThisWeek(new Date(date), { weekStartsOn: 1 }),
      'font-semibold': true,
    });
  }

  return (
    <div className="flex flex-row gap-1 items-center">
      <CircleAlert size={14} /> Date coming up{' '}
      <span className={classnames(nextDate)}>{dateText}</span>
    </div>
  );
}

export default function DaddyBlock({ daddy }: { daddy: Doc<'daddies'> }) {
  return (
    <Link href={`/daddies/${daddy._id}`}>
      <Card className="hover:shadow-xl hover:border-slate-500 border-slate-300 transition-all">
        <CardHeader className="flex flex-row justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-medium flex flex-col justify-between h-full">
            <div className="text-lg flex flex-row gap-1 items-center">
              {daddy.allowance && <AllowanceIcon />}
              {daddy.name}
            </div>
            <StarRating stars={daddy.vibeRating || 0} />
          </CardTitle>
          <div className="flex flex-col gap-2 items-end">
            <div className="text-sm font-light">
              <DateComingUp nextDate={daddy.nextDateDate} />
            </div>
            <div className="text-xs font-light flex h-3 items-center space-x-2">
              <div>
                <span className="text-sm font-semibold mr-1">
                  {daddy.totalDates || '0'}
                </span>
                Dates
              </div>
              <Separator orientation="vertical" className="bg-primary" />
              <div>
                <span className="text-sm font-semibold mr-1">
                  {daddy.totalContacts}
                </span>
                Contacts
              </div>
              <Separator orientation="vertical" className="bg-primary" />
              <div>
                <span className="text-sm font-semibold mr-1">
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
