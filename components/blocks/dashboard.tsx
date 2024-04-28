'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { GiftedThisMonth } from '@/components/blocks/giftedThisMonth';
import { NeedSomeLove } from '@/components/blocks/needSomeLove';
import { UpcomingDates } from './upcomingDates';
import { motion } from 'framer-motion';
import { staggerUpDaddies as stagger } from '@/constants/animations';

export function Dashboard() {
  const daddies = useQuery(api.daddies.getDaddies);
  const dates = useQuery(api.dates.getDates);
  const contacts = useQuery(api.contacts.getContacts);

  if (!daddies || !dates || !contacts) return null;

  return (
    <motion.div
      className="grid md:grid-cols-2  xl:grid-cols-3 gap-6"
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
        <GiftedThisMonth dates={dates} />
      </motion.div>
    </motion.div>
  );
}
