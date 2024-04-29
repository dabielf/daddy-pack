'use client';

import { google, ics } from 'calendar-link';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Doc } from '@/convex/_generated/dataModel';
import Link from 'next/link';

interface AddToCalendarButtonProps {
  date: Doc<'dates'>;
}

export function AddToCalendarButton({ date }: AddToCalendarButtonProps) {
  const event = {
    title: `Date with ${date.daddyName || 'REDACTED'}`,
    description: date.notes || 'No notes provided',
    start: new Date(date.date),
    duration: [date.dateDuration || 3, 'hours'] as [number, 'hours'],
    location: date.location || 'No location provided',
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="ml-4">
          ADD TO CALENDAR
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-lg leading-none">
              Choose your option:
            </h4>
          </div>
          <div className="grid gap-2">
            <Link
              href={google(event)}
              className="flex flex-row gap-2 items-center hover:underline decoration-primary"
            >
              <ChevronRight size={18} />
              Add to Google Calendar
            </Link>
            <Link
              href={ics(event)}
              className="flex flex-row gap-2 items-center hover:underline decoration-primary"
            >
              <ChevronRight size={18} />
              Download .ics file (Apple)
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
