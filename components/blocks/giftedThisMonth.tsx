import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';
import { isSameMonth, subMonths } from 'date-fns';
import { DollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function GiftedThisMonth({
  dates,
  allowancePayments,
}: {
  dates: Doc<'dates'>[];
  allowancePayments: Doc<'allowancePayments'>[];
}) {
  // Filter dates for this month
  const thisMonth = dates.filter(date =>
    isSameMonth(new Date(date.date), new Date()),
  );

  // Filter dates for last month
  const lastMonth = dates.filter(date =>
    isSameMonth(new Date(date.date), subMonths(new Date(), 1)),
  );

  const allowancePaymentsThisMonth = allowancePayments.filter(
    allowancePayment =>
      isSameMonth(new Date(allowancePayment.date), new Date()),
  );

  const allowancePaymentsLastMonth = allowancePayments.filter(
    allowancePayment =>
      isSameMonth(new Date(allowancePayment.date), subMonths(new Date(), 1)),
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

  // get the total allowance payments this month
  const totalAllowancePayments = allowancePaymentsThisMonth.reduce(
    (acc, allowancePayment) => acc + (allowancePayment.amount || 0),
    0,
  );

  // get the total allowance payments last month
  const totalAllowancePaymentsLastMonth = allowancePaymentsLastMonth.reduce(
    (acc, allowancePayment) => acc + (allowancePayment.amount || 0),
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
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-semibold">
          Gifted This Month
        </CardTitle>
        <DollarSign className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent>
        <Separator className="bg-primary/50 mb-4" />
        <div className="text-2xl font-bold">
          ${totalGifted + totalAllowancePayments}
        </div>

        <PercentageChange
          thisMonth={totalGifted + totalAllowancePayments}
          lastMonth={totalGiftedLastMonth + totalAllowancePaymentsLastMonth}
        />
      </CardContent>
    </Card>
  );
}
