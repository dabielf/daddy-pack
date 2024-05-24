import { useConvexData } from "@/providers/convexDataContext";

import { formatRelative } from "date-fns";
import Link from "next/link";

export function ContactList() {
  // const { contacts, daddies } = useConvexData();

  // const contactsDaddyIdSet = new Set();
  // contacts?.map((contact) => contactsDaddyIdSet.add(contact.daddy));

  // const daddiesMap = new Map();
  // daddies?.map((daddy) => daddiesMap.set(daddy._id, daddy));

  // if (!contacts) return null;
  // if (!daddies) return null;

  // const orderedContacts = contacts.sort((a, b) => b.date - a.date);

  // const filteredContacts = orderedContacts.filter((contact) =>
  //   daddiesMap.has(contact.daddy),
  // );

  function formatDate(date: number) {
    return formatRelative(new Date(date), new Date());
  }

  return (
    <div>
      <h1>Contact List</h1>
      {/* <ul>
        {filteredContacts.map((contact) => (
          <li key={contact._id} className="hover:underline">
            <Link href={`/contacts/${contact._id}`}>
              {daddiesMap.get(contact.daddy).name} - {formatDate(contact.date)}
            </Link>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
