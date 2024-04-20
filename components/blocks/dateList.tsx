import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';

export function DateList() {
  const dates = useQuery(api.dates.getDates);

  if (!dates) return null;

  function formatDate(date: number) {
    return (
      formatDistance(new Date(date), new Date(), {
        addSuffix: true,
      }) +
      ' - ' +
      formatRelative(new Date(date), new Date())
    );
  }

  return (
    <div>
      <h1>Date List</h1>
      <ul>
        {dates.map(date => (
          <li key={date._id}>
            {date.daddyName} - {formatDate(date.date)}
          </li>
        ))}
      </ul>
    </div>
  );
}
