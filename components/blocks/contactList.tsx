import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { formatDistance, formatRelative } from 'date-fns';

export function ContactList() {
  const contacts = useQuery(api.contacts.getContacts);

  if (!contacts) return null;

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
        {contacts.map(contact => (
          <li key={contact._id}>
            {contact.daddyName} - {formatDate(contact.date)}
          </li>
        ))}
      </ul>
    </div>
  );
}
