'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { DeleteDaddyButton } from '@/components/blocks/daddiesList';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import EventLog from '@/components/blocks/eventLog';

export default function DaddyPage({
  params,
}: {
  params: { id: Id<'daddies'> };
}) {
  const daddyData = useQuery(api.daddies.getDaddy, {
    daddy: params.id,
  });
  const router = useRouter();

  function goBack() {
    router.back();
  }

  if (!daddyData) return null;

  const { daddy, contacts, dates } = daddyData;
  if (!daddy) return null;
  return (
    <div className="flex w-full h-full flex-col justify-between">
      <div>
        <div
          onClick={goBack}
          className="text-md text-slate-700 cursor-pointer flex flex-row gap-1 items-center mb-4"
        >
          <ChevronLeft size={24} />
          Back
        </div>
        <div className="grid md:grid-cols-3 xl:grid-cols-4">
          <div className="md:col-span-2 xl:col-span-3">
            <h1 className="text-xl font-bold mb-2">{daddy?.name}</h1>
            {/* <ul>
              <li>Current Vibe Rating: {daddy?.vibeRating}</li>
            </ul> */}
            <p>Soon, more info about the Daddy will be available here.</p>
          </div>

          <EventLog contacts={contacts} dates={dates} />
        </div>
      </div>

      <DeleteDaddyButton daddy={daddy._id} name={daddy.name} />
    </div>
  );
}
