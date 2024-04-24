'use client';

import { api } from '@/convex/_generated/api';
import { useQuery, useMutation } from 'convex/react';
import { Id } from '@/convex/_generated/dataModel';
import { motion } from 'framer-motion';
import { FilePenLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistance } from 'date-fns';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import animations from '@/constants/animations';
import { NewDaddyButton } from './newDaddyDialog';
import { toast } from 'sonner';
import NoDaddyYet from './noDaddyYet';
import Link from 'next/link';

export function DeleteDaddyButton({
  daddy,
  name,
  buttonText = 'Delete this Daddy',
}: {
  daddy: Id<'daddies'>;
  name: string;
  buttonText?: string;
}) {
  const deleteDaddy = useMutation(api.daddies.deleteDaddy);
  const router = useRouter();

  function deleteDaddyHandler() {
    deleteDaddy({ daddy });

    toast.success(`${name} was successfully ERASED 🎊.`);
    router.push('/');
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{buttonText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="text-black">
              <p>This action cannot be undone.</p>
              <p>This will permanently delete this daddy.</p>
              <p className="font-bold">
                You will NEVER EVER be able to recover it!
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteDaddyHandler}>
            Delete that bitch!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DaddiesList() {
  const daddies = useQuery(api.daddies.getDaddies);
  return (
    <div className="flex flex-grow flex-col">
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Daddies</h1>
        <NewDaddyButton />
      </div>
      {(() => {
        if (!daddies) {
          return (
            <div>
              <Skeleton className="w-full h-[20px] rounded-full mb-4" />
              <Skeleton className="w-full h-[20px] rounded-full mb-4" />
              <Skeleton className="w-full h-[20px] rounded-full mb-4" />
            </div>
          );
        } else if (daddies?.length) {
          return (
            <motion.div {...animations.appearUp}>
              <Table>
                <TableCaption></TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Number of dates</TableHead>
                    <TableHead>Vibe Rating</TableHead>
                    <TableHead>Most Recent Date</TableHead>
                    <TableHead>Most Recent Contact</TableHead>
                    <TableHead>Lifetime Value</TableHead>
                    <TableHead className="flex flex-row items-center justify-end">
                      <FilePenLine size={20} />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {daddies.map(daddy => (
                    <TableRow key={daddy._id}>
                      <TableCell className="font-medium">
                        {daddy.name}
                      </TableCell>
                      <TableCell>{daddy.numDates}</TableCell>
                      <TableCell>{daddy.vibeRating}</TableCell>
                      <TableCell>
                        {daddy.mostRecentDate
                          ? formatDistance(
                              new Date(daddy.mostRecentDate),
                              new Date(),
                              {
                                addSuffix: true,
                              },
                            )
                          : 'none'}
                      </TableCell>

                      <TableCell>
                        {daddy.mostRecentContact
                          ? formatDistance(
                              new Date(daddy.mostRecentContact),
                              new Date(),
                              {
                                addSuffix: true,
                              },
                            )
                          : 'none'}
                      </TableCell>
                      <TableCell>${daddy.lifetimeValue}</TableCell>
                      <TableCell className="flex flex-row items-center justify-end ">
                        {/* <DeleteDaddyButton
                          daddy={daddy._id}
                          name={daddy.name}
                        /> */}
                        {/* <DaddySheetTrigger daddy={daddy} /> */}
                        <Link href={`/daddies/${daddy._id}`}>
                          <p className="text-primary underline">See More</p>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {/* <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell className="font-bold">$0</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter> */}
              </Table>
            </motion.div>
          );
        } else {
          return (
            <motion.div {...animations.appearUp} className="flex grow">
              <NoDaddyYet />
            </motion.div>
          );
        }
      })()}
    </div>
  );
}
