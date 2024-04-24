import { Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { formatDistance } from 'date-fns';

type DaddyExtendedDada = Doc<'daddies'> & {
  mostRecentDate: number | null;
  mostRecentContact: number | null;
  nextDate: number | null;
  lifetimeValue: number;
  numDates: number;
  numContacts: number;
  scheduledDates?: number;
  completedDates?: number;
  canceledDates?: number;
};

export default function DaddyBlock({ daddy }: { daddy: DaddyExtendedDada }) {
  return (
    <motion.div className=" hover:bg-slate-100 min-w-[470px] grow">
      <Link href={`/daddies/${daddy._id}`}>
        <Card className="hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-baseline justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              <div className="flex flex-col">
                <div className="text-xl">{daddy.name}</div>
              </div>
            </CardTitle>
            <div className="text-xs flex h-5 items-center space-x-2">
              <div>
                <span className="text-base mr-1">{daddy.numDates}</span> Dates
              </div>
              <Separator orientation="vertical" className="bg-primary" />
              <div>
                <span className="text-base mr-1">{daddy.numContacts}</span>
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
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-row gap-2 ">
              <div className="flex flex-col gap-1 grow">
                <div className="flex flex-row gap-2 items-baseline">
                  <div className="text-baseline font-bold">
                    {daddy.scheduledDates || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dates Scheduled
                  </p>
                </div>
                <div className="flex flex-row gap-1 items-baseline">
                  <div className="text-baseline font-bold">
                    {daddy.completedDates || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Dates Completed
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-baseline">
                  <div className="text-baseline font-bold">
                    {daddy.canceledDates || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dates Canceled
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-2 items-baseline justify-end">
                  <p className="text-xs text-muted-foreground">Next Date:</p>
                  <div className="text-baseline font-bold">
                    {daddy.nextDate
                      ? formatDistance(new Date(daddy.nextDate), new Date(), {
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
                    {daddy.mostRecentDate
                      ? formatDistance(
                          new Date(daddy.mostRecentDate),
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
                    {daddy.mostRecentContact
                      ? formatDistance(
                          new Date(daddy.mostRecentContact),
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
    </motion.div>
  );
}
