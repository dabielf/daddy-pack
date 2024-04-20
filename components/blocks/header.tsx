'use client';

import { useConvexAuth, useQuery } from 'convex/react';
import { SignInButton, SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import { motion } from 'framer-motion';
import animations from '@/constants/animations';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser);
  console.log({ HeaderUser: user });

  function SignOut() {
    return (
      <Button variant="secondary">
        <SignOutButton />
      </Button>
    );
  }

  function SignIn() {
    return (
      <Button>
        <SignInButton />
      </Button>
    );
  }

  const button = isAuthenticated ? <SignOut /> : <SignIn />;
  return isLoading ? null : (
    <motion.div {...animations.appearDown}>
      <header>
        <nav className="flex flex-row justify-between items-center w-full mb-9">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src="/logo.svg"
              alt="logo"
              width={150}
              height={100}
              priority
            />
            {user && <p>Hello, {user?.name ? user.name : 'You'}!️</p>}
          </div>
          <div className="flex flex-row gap-4 items-center">
            {isLoading ? null : button}
          </div>
        </nav>
      </header>
    </motion.div>
  );
};
