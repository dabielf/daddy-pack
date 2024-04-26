import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';
import { formatDistance, isAfter } from 'date-fns';
import { ChevronRight, MessageSquareHeart } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface UpcomingDatesProps {
  dates: Doc<'dates'>[];
}

function formatDate(date: number) {
  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
  });
}

export function UpcomingDates({ dates }: UpcomingDatesProps) {
  // filter out dates that are in the past
  const upcomingDates = dates
    .filter(date => isAfter(new Date(date.date), new Date()))
    .sort((a, b) => a.date - b.date);

  function DisplayDate({ date }: { date: Doc<'dates'> }) {
    return (
      <Link href={`/dates/${date._id}`} className="group flex flex-row">
        <div className="grow">
          <div className="text-lg font-semibold group-hover:underline decoration-primary">
            {formatDate(date.date)}
          </div>
          <div className="text-sm">With {date.daddyName}</div>
        </div>
        <div className="flex items-center justify-center">
          <ChevronRight className="h-6 w-6 group-hover:text-primary transition-all group-hover:scale-125" />
        </div>
      </Link>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-semibold">Upcoming Dates</CardTitle>
        <MessageSquareHeart className="h-6 w-6 text-primary" />
      </CardHeader>

      <CardContent>
        <Separator className="bg-primary/50 mb-4" />
        {upcomingDates.length === 0 && (
          <div className="h-[100px] flex flex-col justify-center items-center">
            <div className="text-4xl">🥲</div>
            <div className="text-lg">No upcoming dates!</div>
          </div>
        )}
        {upcomingDates.length > 0 && (
          <ul className="flex flex-col gap-4">
            {upcomingDates.map(date => (
              <DisplayDate key={date._id} date={date} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
