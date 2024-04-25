'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { GiftedThisMonth } from '@/components/blocks/giftedThisMonth';

export function Dashboard() {
  const daddies = useQuery(api.daddies.getDaddies);
  const dates = useQuery(api.dates.getDates);
  const contacts = useQuery(api.contacts.getContacts);

  if (!daddies || !dates || !contacts) return null;

  return (
    <div>
      <div className="grid md:grid md:grid-cols-3 xl:grid-cols-4 gap-6">
        <GiftedThisMonth dates={dates} />
      </div>
    </div>
  );
}
