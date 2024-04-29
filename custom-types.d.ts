import { Doc } from '@/convex/_generated/dataModel';

declare type DateStatus = 'scheduled' | 'completed' | 'canceled' | 'no-show';

declare type DaddyExtendedData = Doc<'daddies'> & {
  mostRecentDate: number | undefined;
  mostRecentContact: number | undefined;
  nextDate: number | undefined;
  lifetimeValue: number;
  numDates: number;
  numContacts: number;
  scheduledDates?: number;
  completedDates?: number;
  canceledDates?: number;
};
