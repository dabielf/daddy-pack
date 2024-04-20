'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { formatDistance, formatRelative } from 'date-fns';

export default function ContactPage({
  params,
}: {
  params: { id: Id<'contacts'> };
}) {
  const contactData = useQuery(api.contacts.getContact, {
    contact: params.id,
  });
  const router = useRouter();

  function formatDate(date: number) {
    return (
      formatDistance(new Date(date), new Date(), {
        addSuffix: true,
      }) +
      ' - ' +
      formatRelative(new Date(date), new Date())
    );
  }

  function goBack() {
    router.back();
  }

  if (!contactData) return null;

  const { daddy, contact } = contactData;
  if (!contact) return null;

  return (
    <div className="flex w-full h-full flex-col justify-between">
      <div>
        <div>
          <div
            onClick={goBack}
            className="text-slate-700 cursor-pointer flex flex-row gap-1 items-center mb-4"
          >
            <ChevronLeft size={24} />
            Back
          </div>
          <h1 className="text-xl font-bold mb-2">
            Contact with {daddy ? daddy.name : 'REDACTED'} -{' '}
            {formatDate(contact.date)}
          </h1>
          <p>Soon, more info about the contact will be available here.</p>
        </div>
      </div>
    </div>
  );
}
