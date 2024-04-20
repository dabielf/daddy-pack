'use client';

import { motion } from 'framer-motion';
import animations from '@/constants/animations';

export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <motion.div className="h-full flex flex-col" {...animations.appearUp}>
      {children}
    </motion.div>
  );
}
