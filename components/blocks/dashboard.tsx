'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { GiftedThisMonth } from '@/components/blocks/giftedThisMonth';
import { NeedSomeLove } from '@/components/blocks/needSomeLove';
import { UpcomingDates } from './upcomingDates';

export function Dashboard() {
  const daddies = useQuery(api.daddies.getDaddies);
  const dates = useQuery(api.dates.getDates);
  const contacts = useQuery(api.contacts.getContacts);

  if (!daddies || !dates || !contacts) return null;

  return (
    <div className="grid md:grid-cols-2  xl:grid-cols-3 gap-6">
      <UpcomingDates dates={dates} />
      <NeedSomeLove daddies={daddies} />
      <GiftedThisMonth dates={dates} />
    </div>
  );
}
