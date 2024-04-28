import { Star } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';
import { formatDistance } from 'date-fns';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { DaddyExtendedData } from '@/custom-types';
import { staggerUpDaddies as stagger } from '@/constants/animations';

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

export default function DaddyBlock({ daddy }: { daddy: DaddyExtendedData }) {
  return (
    <motion.div
      variants={stagger}
      className=" hover:bg-slate-100 min-w-[470px] grow"
    >
      <Link href={`/daddies/${daddy._id}`}>
        <Card className="hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-medium">
              <div className="flex flex-col">
                <div className="text-xl">{daddy.name}</div>
                <StarRating stars={daddy.vibeRating || 0} />
              </div>
            </CardTitle>
            <div className="text-xs flex h-4 items-center space-x-2">
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
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-row gap-2 ">
              <div className="flex flex-col grow">
                <div className="flex flex-row gap-2 items-baseline">
                  <div className="text-baseline font-bold w-2">
                    {daddy.scheduledDates || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dates Scheduled/To Process
                  </p>
                </div>
                <div className="flex flex-row gap-1 items-baseline">
                  <div className="text-baseline font-bold w-3">
                    {daddy.completedDates || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Dates Completed
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-baseline">
                  <div className="text-baseline font-bold w-3">
                    {daddy.canceledDates || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dates Canceled
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
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
