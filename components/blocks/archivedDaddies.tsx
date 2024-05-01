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
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { Id } from '@/convex/_generated/dataModel';
import { Separator } from '../ui/separator';
import Markdown from 'react-markdown';

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
            <DialogTitle className="text-2xl">
              Your Archived Daddies
            </DialogTitle>
            {/* <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription> */}
          </DialogHeader>
          <Separator className="bg-foreground" />
          <ScrollArea className="h-[300px] [&>*]:h-[300px]">
            {archivedDaddies &&
              archivedDaddies?.length > 0 &&
              archivedDaddies.map(daddy => {
                return (
                  <div key={daddy._id} className="flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                      <Button variant="link" asChild>
                        <Link
                          href={`/daddies/${daddy._id}`}
                          className="font-medium text-xl px-0"
                        >
                          {daddy.name}
                        </Link>
                      </Button>
                      <Button
                        variant="link"
                        className="px-0"
                        onClick={() => handleUnarchiveDaddy(daddy._id)}
                      >
                        Unarchive
                      </Button>
                    </div>
                    {daddy.archivedReason ? (
                      <div className="flex flex-col text-sm">
                        <span className="font-semibold">
                          Reason for archiving:
                        </span>
                        <Markdown className="italic text-xs">
                          {daddy.archivedReason || ''}
                        </Markdown>
                      </div>
                    ) : (
                      <span className="font-semibold text-sm">
                        No reason given for archiving.
                      </span>
                    )}
                  </div>
                );
              })}
            {archivedDaddies?.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <p>No archived daddies</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
