import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import {
  CalendarFold,
  MessageSquareMore,
  FilePenLine,
  ChevronRight,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';

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
    status?: string;
  };

  function formatEventDate(date: number) {
    return formatDistance(new Date(date), new Date(), {
      addSuffix: true,
    });
  }

  type extendedContact = Doc<'contacts'> & DaddyEvent;
  type extendedDate = Doc<'dates'> & DaddyEvent;

  function EventStatus({ event }: { event: extendedContact | extendedDate }) {
    const past = new Date(event.date).getTime() < new Date().getTime();
    if (!past) {
      return (
        <Badge
          className="w-fit font-light border-cyan-500 text-cyan-500"
          variant="outline"
        >
          Scheduled
        </Badge>
      );
    } else if (event.status === 'cancelled') {
      return (
        <Badge
          className="w-fit font-light border-red-600 text-red-600"
          variant="outline"
        >
          Cancelled
        </Badge>
      );
    } else if (event.status === 'scheduled' || !event.status) {
      return (
        <Badge
          className="w-fit font-medium border-red-500"
          variant="destructive"
        >
          TO PROCESS
        </Badge>
      );
    } else if (event.status === 'completed') {
      return (
        <Badge
          className="w-fit font-light border-emerald-500 text-emerald-500"
          variant="outline"
        >
          Completed
        </Badge>
      );
    }
  }

  function EventDisplayer(event: extendedContact | extendedDate) {
    if (event.eventType === 'contact') {
      return (
        <div
          key={event._id}
          className="event flex justify-between items-start gap-4"
        >
          <div className="grid gap-1">
            <p className="font-medium text-lg flex flex-row gap-1 text-cyan-500 items-center">
              <MessageSquareMore size={16} />
              <div className="flex flex-row items-baseline gap-2">
                Contact
                <span className="text-xs font-light text-muted-foreground">
                  {formatEventDate(event.date)}
                </span>
              </div>
            </p>

            <p className="text-sm">
              {event.notes || 'No notes for this contact'}
            </p>
          </div>
          <Link
            className="font-medium text-secondary-foreground hover:underline -mt-1"
            href={`/contacts/${event._id}`}
          >
            See
          </Link>
        </div>
      );
    } else {
      return (
        <div
          key={event._id}
          className="event flex items-start justify-between gap-2"
        >
          <div className="grid gap-1">
            <div className="font-medium text-lg flex flex-row gap-1 text-emerald-700 items-center">
              <CalendarFold size={16} />
              <div className="flex flex-row items-baseline gap-2">
                Date
                <span className="text-xs font-light text-muted-foreground">
                  {formatEventDate(event.date)}
                </span>
              </div>
            </div>

            <EventStatus event={event} />
          </div>

          <Link className="mt-2" href={`/dates/${event._id}`}>
            <ChevronRight size={20} />
          </Link>
        </div>
      );
    }
  }

  return (
    <Card>
      <CardHeader className="shadow-sm">
        <CardTitle className="text-xl">Timeline</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[650px]">
        <CardContent className="flex flex-col gap-4 -mt-2">
          <h3 className="font-bold text-lg mt-6">Upcoming Events</h3>
          {incomingEvents.map(EventDisplayer)}
          <h3 className="font-bold text-lg mt-2">Past Events</h3>
          {pastEvents.map(EventDisplayer)}
        </CardContent>
      </ScrollArea>
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
