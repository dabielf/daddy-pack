import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { formatDistance, formatRelative } from 'date-fns';

export function ContactList() {
  const contacts = useQuery(api.contacts.getContacts);
  const daddies = useQuery(api.daddies.getDaddies);

  const contactsDaddyIdSet = new Set();
  contacts?.map(contact => contactsDaddyIdSet.add(contact.daddy));

  const daddiesMap = new Map();
  daddies?.map(daddy => daddiesMap.set(daddy._id, daddy));

  if (!contacts) return null;
  if (!daddies) return null;

  const orderedContacts = contacts.sort((a, b) => b.date - a.date);

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
      <h1>Contact List</h1>
      <ul>
        {orderedContacts.map(contact => (
          <li key={contact._id}>
            {daddiesMap.get(contact.daddy).name} - {formatDate(contact.date)}
          </li>
        ))}
      </ul>
    </div>
  );
}
