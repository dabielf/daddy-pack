'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { DeleteDaddyButton } from '@/components/blocks/daddiesList';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function DaddyPage({
  params,
}: {
  params: { id: Id<'daddies'> };
}) {
  const daddy = useQuery(api.daddies.getDaddy, { daddy: params.id });
  const router = useRouter();

  function goBack() {
    router.push('/');
  }

  if (!daddy) return null;
  return (
    <div className="flex w-full h-full flex-col justify-between">
      <div>
        <div
          onClick={goBack}
          className="text-lg text-slate-700 cursor-pointer flex flex-row gap-1 items-center mb-2"
        >
          <ChevronLeft size={24} />
          Go back
        </div>
        <h1>This is the page with only one daddy: {daddy?.name}</h1>
        <p>His current Vibe rating is : {daddy?.vibeRating}</p>
      </div>
      <DeleteDaddyButton daddy={daddy._id} name={daddy.name} />
    </div>
  );
}
