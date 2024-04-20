'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { formatDistance, formatRelative } from 'date-fns';

export default function DatePage({ params }: { params: { id: Id<'dates'> } }) {
  const dateData = useQuery(api.dates.getDate, {
    date: params.id,
  });
  const router = useRouter();

  function formatDate(date: number) {
    return (
      formatDistance(new Date(date), new Date(), {
        addSuffix: true,
      }) +
      ' - ' +
      formatRelative(new Date(date), new Date())
    );
  }

  function goBack() {
    router.back();
  }

  if (!dateData) return null;

  const { daddy, date } = dateData;
  if (!date) return null;

  return (
    <div className="flex w-full h-full flex-col justify-between">
      <div>
        <div>
          <div
            onClick={goBack}
            className="text-slate-700 cursor-pointer flex flex-row gap-1 items-center mb-4"
          >
            <ChevronLeft size={24} />
            Back
          </div>
          <h1 className="text-xl font-bold mb-2">
            Date with {date.daddyName} - {formatDate(date.date)}
          </h1>
          <ul>
            <li>Current Vibe Rating: {daddy?.vibeRating}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
