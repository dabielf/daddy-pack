'use client';

import animations from '@/constants/animations';
import { motion } from 'framer-motion';

export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <motion.div className="h-full flex flex-col">{children}</motion.div>;
}
