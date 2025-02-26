"use client";

import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { motion, Reorder } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import animations from "@/constants/animations";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DaddyBlock from "./daddyBlock";
import { NewDaddyButton } from "./newDaddyDialog";
import NoDaddyYet from "./noDaddyYet";
import { staggerUpDaddies as stagger } from "@/constants/animations";
import { ArchivedDaddiesButton } from "./archivedDaddies";
import Tiptap from "./tiptap";
import { useConvexData } from "@/providers/convexDataContext";

export function DeleteDaddyButton({
  daddy,
  name,
  buttonText = "DELETE DADDY",
}: {
  daddy: Id<"daddies">;
  name: string;
  buttonText?: string;
}) {
  const deleteDaddy = useMutation(api.daddies.deleteDaddy);
  const router = useRouter();

  function deleteDaddyHandler() {
    deleteDaddy({ daddy });

    toast.success(`${name} was successfully ERASED 🎊.`);
    router.push("/daddies");
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="grow">
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
  buttonText = "ARCHIVE DADDY",
}: {
  daddy: Id<"daddies">;
  name: string;
  buttonText?: string;
}) {
  const [archivedReason, setArchivedReason] = useState<string>("");
  const archiveDaddy = useMutation(api.daddies.archiveDaddy);
  const router = useRouter();

  function archiveDaddyHandler() {
    archiveDaddy({ daddy, archivedReason });

    toast.success(`${name} was successfully ARCHIVED 🎊.`);
    router.push("/daddies");
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="grow">
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
        <div className="-mb-2 mt-2 font-semibold">
          (optional) Reason for archiving:
        </div>
        <Tiptap content={archivedReason} onChange={setArchivedReason} />
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

function getLocalOrderType() {
  return localStorage.getItem("orderType") || "nextDate";
}

function setLocalOrderType(orderType: string | undefined) {
  if (orderType) {
    localStorage.setItem("orderType", orderType);
  }
}

function orderDaddies(
  daddies: Doc<"daddies">[] | null | undefined,
  orderType: string | undefined,
) {
  if (!daddies) {
    return [];
  }
  if (!orderType) {
    return daddies || [];
  }
  if (orderType === "lifetimeValueDown") {
    return daddies.sort((a, b) => b.lifetimeValue - a.lifetimeValue);
  }

  if (orderType === "lifetimeValueUp") {
    return daddies.sort((a, b) => a.lifetimeValue - b.lifetimeValue);
  }

  if (orderType === "vibeRating") {
    return daddies.sort((a, b) => b.vibeRating - a.vibeRating);
  }

  if (orderType === "_creationTime") {
    return daddies.sort(
      (a, b) => (b._creationTime || 0) - (a._creationTime || 0),
    );
  }

  if (orderType === "nextDate") {
    //create a new Date 50 years from now
    const fiftyYearsFromNow = new Date();
    fiftyYearsFromNow.setFullYear(fiftyYearsFromNow.getFullYear() + 50);
    const fiftyYearsFromNowTimestamp = fiftyYearsFromNow.getTime();

    return daddies.sort(
      (a, b) =>
        (a.nextDateDate || fiftyYearsFromNowTimestamp) -
        (b.nextDateDate || fiftyYearsFromNowTimestamp),
    );
  }

  return [];
}

export function DaddiesList() {
  const localOrderType = getLocalOrderType();
  const [hovered, setHovered] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<string | undefined>(
    localOrderType,
  );
  // const { daddies } = useConvexData();
  const daddies = useQuery(api.daddies.getDaddies);

  const initialDaddies = orderDaddies(daddies, orderType);
  const [orderedDaddies, setOrderedDaddies] =
    useState<Doc<"daddies">[]>(initialDaddies);

  useEffect(() => {
    setLocalOrderType(orderType);
    if (daddies !== undefined) {
      setOrderedDaddies(orderDaddies(daddies, orderType));
    }
  }, [daddies, orderType]);

  return (
    <div className="flex flex-grow flex-col">
      <div className="mb-4 flex flex-row items-center justify-between">
        <div className=" flex flex-row gap-4">
          <h1 className="text-3xl font-semibold">Daddies</h1>
          <Select value={orderType} onValueChange={setOrderType}>
            <SelectTrigger className="w-[220px] bg-background">
              <SelectValue placeholder="Reorder by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Order by:</SelectLabel>
                <SelectItem value="lifetimeValueUp">
                  Lifetime Value Ascending
                </SelectItem>
                <SelectItem value="lifetimeValueDown">
                  Lifetime Value Descending️
                </SelectItem>
                <SelectItem value="nextDate">Next Date</SelectItem>
                <SelectItem value="vibeRating">Vibe Rating</SelectItem>
                <SelectItem value="_creationTime">Date Added</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row gap-4">
          <ArchivedDaddiesButton />

          <NewDaddyButton />
        </div>
      </div>
      {(() => {
        if (!orderedDaddies) {
          return null;
        } else if (orderedDaddies?.length) {
          return (
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3"
            >
              {orderedDaddies.map((daddy) => (
                <motion.div
                  key={daddy._id}
                  variants={stagger}
                  animate={{
                    opacity: hovered == daddy._id || hovered == null ? 1 : 0.7,
                    filter:
                      hovered == daddy._id || hovered == null
                        ? "none"
                        : "grayscale(0.6)",
                  }}
                  className="min-w-[470px] grow"
                  whileHover={{ scale: 1.03, rotate: -0.5 }}
                  onHoverStart={() => setHovered(daddy._id)}
                  onHoverEnd={() => setHovered(null)}
                >
                  <DaddyBlock daddy={daddy} />
                </motion.div>
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
