import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';
import { isSameMonth, subMonths } from 'date-fns';
import { DollarSign } from 'lucide-react';

export function GiftedThisMonth({ dates }: { dates: Doc<'dates'>[] }) {
  // Filter dates for this month
  const thisMonth = dates.filter(date =>
    isSameMonth(new Date(date.date), new Date()),
  );

  // Filter dates for last month
  const lastMonth = dates.filter(date =>
    isSameMonth(new Date(date.date), subMonths(new Date(), 1)),
  );

  // get the total gifted amount from date.giftAmount
  const totalGifted = thisMonth.reduce(
    (acc, date) => acc + (date.giftAmount || 0),
    0,
  );

  // get the total gifted last month
  const totalGiftedLastMonth = lastMonth.reduce(
    (acc, date) => acc + (date.giftAmount || 0),
    0,
  );

  // get the percentage change

  function PercentageChange({
    thisMonth,
    lastMonth,
  }: {
    thisMonth: number;
    lastMonth: number;
  }) {
    if (lastMonth === 0) {
      return (
        <p className="text-xs text-muted-foreground">No data from last month</p>
      );
    }

    const percentageChangePrecise = ((thisMonth - lastMonth) / lastMonth) * 100;
    const percentageChange = Math.round(percentageChangePrecise);

    if (percentageChange > 0) {
      return (
        <p className="text-xs text-green-600">{`+${percentageChange}% compared to last month`}</p>
      );
    } else if (percentageChange == 0) {
      return (
        <p className="text-xs text-muted-foreground">
          No change from last month
        </p>
      );
    } else {
      return (
        <p className="text-xs text-red-600">{`${percentageChange}% compared to last month`}</p>
      );
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Gifted This Month
        </CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${totalGifted}</div>

        <PercentageChange
          thisMonth={totalGifted}
          lastMonth={totalGiftedLastMonth}
        />
      </CardContent>
    </Card>
  );
}
