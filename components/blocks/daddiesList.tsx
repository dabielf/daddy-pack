'use client';

import { api } from '@/convex/_generated/api';
import { useQuery, useMutation } from 'convex/react';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { motion } from 'framer-motion';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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
import { toast } from 'sonner';

function DeleteDaddyButton({
  daddy,
  name,
}: {
  daddy: Id<'daddies'>;
  name: string;
}) {
  const deleteDaddy = useMutation(api.daddies.deleteDaddy);

  function deleteDaddyHandler() {
    deleteDaddy({ daddy });
    toast.success(`${name} was successfully ERASED 🎊.`);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
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
    <div>
      <h1 className="text-2xl font-bold mb-4">Daddies</h1>
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
                    <TableHead>Amount</TableHead>
                    <TableHead className="w-[100px] text-center">
                      Delete
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {daddies.map(daddy => (
                    <TableRow key={daddy._id}>
                      <TableCell className="font-medium">
                        {daddy.name}
                      </TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>{daddy.vibeRating}</TableCell>
                      <TableCell className="text-right">
                        ${daddy.lifetimeValue}
                      </TableCell>
                      <TableCell className="flex flex-row content-end">
                        <DeleteDaddyButton
                          daddy={daddy._id}
                          name={daddy.name}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$0</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </motion.div>
          );
        } else {
          return (
            <motion.div {...animations.appearUp}>
              <p>No daddies yet. Add One</p>
            </motion.div>
          );
        }
      })()}
    </div>
  );
}
