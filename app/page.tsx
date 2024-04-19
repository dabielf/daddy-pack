'use client';

import { BuyButton } from '@/components/ui/buy-button';
import { NewDaddyButton } from '@/components/blocks/fastDaddyForm';
import { DaddiesList } from '@/components/blocks/daddiesList';
import { Header } from '@/components/blocks/header';
import { motion } from 'framer-motion';
import { Authenticated, Unauthenticated } from 'convex/react';

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col md:flex-row justify-center gap-4 w-full mb-9">
        <NewDaddyButton />
        <BuyButton text="New Date" />
        <BuyButton text="New Contact" />
      </div>
      <DaddiesList />
    </motion.div>
  );
}
