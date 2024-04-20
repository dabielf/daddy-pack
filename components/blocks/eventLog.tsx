import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';
import { formatDistance } from 'date-fns';
import Link from 'next/link';

export default function EventLog({
  contacts,
  dates,
}: {
  contacts: Doc<'contacts'>[];
  dates: Doc<'dates'>[];
}) {
  // create a function that takes contact and dates, order them by date, and returns two arrays, one with the incoming contacts and dates and one with the past contacts and dates
  function orderEvents(contacts: Doc<'contacts'>[], dates: Doc<'dates'>[]) {
    // first, map over both arrays and add a type property to each object
    contacts = contacts.map(contact => {
      return { ...contact, eventType: 'contact' };
    });
    dates = dates.map(date => {
      return { ...date, eventType: 'date' };
    });
    const allEvents = [...contacts, ...dates];
    const orderedEvents = allEvents.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    const incomingEvents = orderedEvents.filter(event => {
      return new Date(event.date).getTime() > new Date().getTime();
    });
    const pastEvents = orderedEvents.filter(event => {
      return new Date(event.date).getTime() < new Date().getTime();
    });
    return { incomingEvents, pastEvents };
  }

  const { incomingEvents, pastEvents } = orderEvents(contacts, dates);

  type DaddyEvent = {
    eventType?: string;
  };

  function formatEventDate(date: number) {
    return formatDistance(new Date(date), new Date(), {
      addSuffix: true,
    });
  }

  type extendedContact = Doc<'contacts'> & DaddyEvent;
  type extendedDate = Doc<'dates'> & DaddyEvent;

  function EventDisplayer(event: extendedContact | extendedDate) {
    if (event.eventType === 'contact') {
      return (
        <div key={event._id} className="event flex items-center gap-4">
          <div className="grid gap-1">
            <p className="font-medium leading-none text-cyan-700">Contact</p>
            <p className="text-sm text-muted-foreground">
              {formatEventDate(event.date)}
            </p>
          </div>
          <Link
            className="ml-auto font-medium text-primary underline"
            href={`/contacts/${event._id}`}
          >
            See
          </Link>
        </div>
      );
    } else {
      return (
        <div key={event._id} className="event flex items-center gap-4">
          <div className="grid gap-1">
            <p className="font-medium leading-none text-emerald-700">Date</p>
            <p className="text-sm text-muted-foreground">
              {formatEventDate(event.date)}
            </p>
          </div>
          <Link
            className="ml-auto font-medium text-primary underline"
            href={`/dates/${event._id}`}
          >
            See
          </Link>
        </div>
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        <h3 className="text-lg font-bold ">Upcoming</h3>
        {incomingEvents.map(EventDisplayer)}
        <h3 className="text-lg font-bold">Past Events</h3>
        {pastEvents.map(EventDisplayer)}
      </CardContent>
    </Card>
  );
}

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>History</CardTitle>
//       </CardHeader>
//       <CardContent className="grid gap-8">
//         <div className="flex items-center gap-4">
//           <Avatar className="hidden h-9 w-9 sm:flex">
//             <AvatarImage src="/avatars/01.png" alt="Avatar" />
//             <AvatarFallback>OM</AvatarFallback>
//           </Avatar>
//           <div className="grid gap-1">
//             <p className="text-sm font-medium leading-none">Olivia Martin</p>
//             <p className="text-sm text-muted-foreground">
//               olivia.martin@email.com
//             </p>
//           </div>
//           <div className="ml-auto font-medium">+$1,999.00</div>
//         </div>
//         <div className="flex items-center gap-4">
//           <Avatar className="hidden h-9 w-9 sm:flex">
//             <AvatarImage src="/avatars/02.png" alt="Avatar" />
//             <AvatarFallback>JL</AvatarFallback>
//           </Avatar>
//           <div className="grid gap-1">
//             <p className="text-sm font-medium leading-none">Jackson Lee</p>
//             <p className="text-sm text-muted-foreground">
//               jackson.lee@email.com
//             </p>
//           </div>
//           <div className="ml-auto font-medium">+$39.00</div>
//         </div>
//         <div className="flex items-center gap-4">
//           <Avatar className="hidden h-9 w-9 sm:flex">
//             <AvatarImage src="/avatars/03.png" alt="Avatar" />
//             <AvatarFallback>IN</AvatarFallback>
//           </Avatar>
//           <div className="grid gap-1">
//             <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
//             <p className="text-sm text-muted-foreground">
//               isabella.nguyen@email.com
//             </p>
//           </div>
//           <div className="ml-auto font-medium">+$299.00</div>
//         </div>
//         <div className="flex items-center gap-4">
//           <Avatar className="hidden h-9 w-9 sm:flex">
//             <AvatarImage src="/avatars/04.png" alt="Avatar" />
//             <AvatarFallback>WK</AvatarFallback>
//           </Avatar>
//           <div className="grid gap-1">
//             <p className="text-sm font-medium leading-none">William Kim</p>
//             <p className="text-sm text-muted-foreground">will@email.com</p>
//           </div>
//           <div className="ml-auto font-medium">+$99.00</div>
//         </div>
//         <div className="flex items-center gap-4">
//           <Avatar className="hidden h-9 w-9 sm:flex">
//             <AvatarImage src="/avatars/05.png" alt="Avatar" />
//             <AvatarFallback>SD</AvatarFallback>
//           </Avatar>
//           <div className="grid gap-1">
//             <p className="text-sm font-medium leading-none">Sofia Davis</p>
//             <p className="text-sm text-muted-foreground">
//               sofia.davis@email.com
//             </p>
//           </div>
//           <div className="ml-auto font-medium">+$39.00</div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
