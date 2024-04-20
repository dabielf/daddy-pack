import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';

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
      return { ...contact, type: 'contact' };
    });
    dates = dates.map(date => {
      return { ...date, type: 'date' };
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

  interface extendedContact extends Doc<'contacts'> {
    type: 'contact';
  }
  interface extendedDate extends Doc<'dates'> {
    type: 'date';
  }

  function EventDisplayer(event: extendedContact | extendedDate) {
    if (event.type === 'contact') {
      return (
        <div key={event._id} className="flex items-center gap-4">
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">
              {event.daddyName}
            </p>
            <p className="text-sm text-muted-foreground">{event.email}</p>
          </div>
          <div className="ml-auto font-medium">+{event.amount}</div>
        </div>
      );
    } else {
      return (
        <div key={event._id} className="flex items-center gap-4">
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">{event.name}</p>
            <p className="text-sm text-muted-foreground">{event.email}</p>
          </div>
          <div className="ml-auto font-medium">+{event.amount}</div>
        </div>
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Log</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        <h3 className="text-lg font-bold">Upcoming</h3>
        {incomingEvents.map(event => {
          return (
            <div key={event._id} className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {event.daddyName}
                </p>
                <p className="text-sm text-muted-foreground">{event.email}</p>
              </div>
              <div className="ml-auto font-medium">+{event.amount}</div>
            </div>
          );
        })}
        <h3 className="text-lg font-bold">Passed Events</h3>
        {pastEvents.map(event => {
          return (
            <div key={event.id} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={event.avatar} alt="Avatar" />
                <AvatarFallback>{event.avatarFallback}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{event.name}</p>
                <p className="text-sm text-muted-foreground">{event.email}</p>
              </div>
              <div className="ml-auto font-medium">+{event.amount}</div>
            </div>
          );
        })}
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
