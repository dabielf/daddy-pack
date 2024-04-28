'use client';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { Id } from '@/convex/_generated/dataModel';

export function ArchivedDaddiesButton() {
  const archivedDaddies = useQuery(api.daddies.getArchivedDaddies);
  const unarchiveDaddy = useMutation(api.daddies.unarchiveDaddy);

  function handleUnarchiveDaddy(daddy: Id<'daddies'>) {
    unarchiveDaddy({ daddy });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="border border-transparent hover:bg-transparent hover:shadow-md hover:border-foreground opacity-80"
        >
          See Archived
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Archived Daddies</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          {archivedDaddies?.length > 0 &&
            archivedDaddies.map(daddy => {
              return (
                <div
                  key={daddy._id}
                  className="flex flex-row justify-between items-center"
                >
                  <Link href={`/daddies/${daddy._id}`}>{daddy.name}</Link>

                  <Button
                    variant="ghost"
                    onClick={() => handleUnarchiveDaddy(daddy._id)}
                  >
                    Unarchive
                  </Button>
                </div>
              );
            })}
          {archivedDaddies?.length === 0 && (
            <div className="text-center">No archived daddies</div>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
