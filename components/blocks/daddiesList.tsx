'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

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
import animations, { staggerUp } from '@/constants/animations';
import { toast } from 'sonner';
import DaddyBlock from './daddyBlock';
import { NewDaddyButton } from './newDaddyDialog';
import NoDaddyYet from './noDaddyYet';
import { staggerUpDaddies as stagger } from '@/constants/animations';

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
    router.push('/daddies');
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          {buttonText}
        </Button>
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

export function ArchiveDaddyButton({
  daddy,
  name,
  buttonText = 'Archive this Daddy',
}: {
  daddy: Id<'daddies'>;
  name: string;
  buttonText?: string;
}) {
  const archiveDaddy = useMutation(api.daddies.archiveDaddy);
  const router = useRouter();

  function archiveDaddyHandler() {
    archiveDaddy({ daddy });

    toast.success(`${name} was successfully ARCHIVED 🎊.`);
    router.push('/daddies');
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="text-black">
              <p>Archiving a daddy will remove him</p>
              <p>From your lists and your stats.</p>
              <p className="font-bold">But you can always restore him later.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={archiveDaddyHandler}>
            Yup, don&apos;t need him for now!
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
        <h1 className="text-3xl font-semibold">Daddies</h1>
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
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4"
            >
              {daddies.map(daddy => (
                <DaddyBlock key={daddy._id} daddy={daddy} />
              ))}
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
