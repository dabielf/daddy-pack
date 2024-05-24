"use client";

import { GiftsData } from "@/components/blocks/giftsData";
import { NeedSomeLove } from "@/components/blocks/needSomeLove";
import { UpcomingDates } from "./upcomingDates";
import { motion } from "framer-motion";
import { staggerUpDaddies as stagger } from "@/constants/animations";

import { useConvexData } from "@/providers/convexDataContext";

export function Dashboard() {
  // const contacts = useQuery(api.contacts.getContacts);
  // const allowancePayments = useQuery(api.allowances.getAllowancePayments);
  //
  const { daddies, dates, allowancePayments, archivedDaddies } =
    useConvexData();

  // console.log(daddies, dates, contacts, allowancePayments, archivedDaddies);

  if (!daddies || !dates || !allowancePayments) return null;

  return (
    <motion.div
      className="grid gap-6  md:grid-cols-2 xl:grid-cols-3"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={stagger}>
        <UpcomingDates dates={dates} />
      </motion.div>
      <motion.div variants={stagger}>
        <NeedSomeLove daddies={daddies} />
      </motion.div>
      <motion.div variants={stagger}>
        <GiftsData
          daddies={daddies}
          archivedDaddies={archivedDaddies ? archivedDaddies : []}
          dates={dates}
          allowancePayments={allowancePayments}
        />
      </motion.div>
    </motion.div>
  );
}
