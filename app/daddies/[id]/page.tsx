'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { DeleteDaddyButton } from '@/components/blocks/daddiesList';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import EventLog from '@/components/blocks/eventLog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="flex w-full h-full flex-col">
      <div
        onClick={goBack}
        className="text-md text-slate-700 cursor-pointer flex flex-row gap-1 items-center mb-4"
      >
        <ChevronLeft size={24} />
        Back
      </div>
      <div className="flex flex-col md:grid md:grid-cols-3 xl:grid-cols-4 h-full gap-6">
        <div className="md:col-span-2 xl:col-span-3">
          <h1 className="text-xl font-bold mb-2">{daddy?.name}</h1>
          {/* <ul>
              <li>Current Vibe Rating: {daddy?.vibeRating}</li>
            </ul> */}
          <p>Soon, more info about the Daddy will be available here.</p>
        </div>

        <div className="h-full flex flex-col md:justify-between gap-6">
          <EventLog contacts={contacts} dates={dates} />
          <Card className="border-destructive shadow-md">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <DeleteDaddyButton daddy={daddy._id} name={daddy.name} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// import { Activity } from 'lucide-react';

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// export default function Component() {
//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium">Active Now</CardTitle>
//         <Activity className="h-4 w-4 text-muted-foreground" />
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold">+573</div>
//         <p className="text-xs text-muted-foreground">+201 since last hour</p>
//       </CardContent>
//     </Card>
//   );
// }
