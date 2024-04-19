'use client';

import { useConvexAuth, useQuery } from 'convex/react';
import { SignInButton, SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import { motion } from 'framer-motion';
import animations from '@/constants/animations';
import { api } from '@/convex/_generated/api';

export const Header = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser);
  console.log({ HeaderUser: user });

  const button = isAuthenticated ? <SignOutButton /> : <SignInButton />;
  return isLoading ? null : (
    <motion.div {...animations.appearDown}>
      <header>
        <nav className="flex flex-row justify-between items-center w-full mb-9">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src="/logo.svg"
              alt="logo"
              width={150}
              height={75}
              priority
            />
            <p>Hello, {user?.name ? user.name : 'You'} ❤️</p>
          </div>
          {isLoading ? null : button}
        </nav>
      </header>
    </motion.div>
  );
};
