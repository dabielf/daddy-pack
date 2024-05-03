'use client';

import { Button } from '@/components/ui/button';
import animations from '@/constants/animations';
import { api } from '@/convex/_generated/api';
import { SignInButton, SignOutButton } from '@clerk/nextjs';
import { useConvexAuth, useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const links = [
  { name: 'Dashboard', href: '/' },
  { name: 'Daddies', href: '/daddies' },
  // { name: 'Dates', href: '/dates' },
  // { name: 'Contacts', href: '/contacts' },
  { name: 'Settings', href: '/settings' },
];

export const Header = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser);

  function SignOut() {
    return (
      <Button variant="outline" asChild>
        <SignOutButton />
      </Button>
    );
  }

  function SignIn() {
    return (
      <Button asChild>
        <SignInButton />
      </Button>
    );
  }

  const button = isAuthenticated ? <SignOut /> : <SignIn />;
  return isLoading ? null : (
    <motion.div {...animations.appearDown}>
      <header className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center  w-full">
          <Link href={'/'}>
            <Image
              src="/logo.png"
              alt="logo"
              width={160}
              height={100}
              priority
            />
          </Link>

          <nav className="justify-self-end md:place-self-center">
            <ul className="flex flex-row gap-4 items-center">
              {links.map(link => (
                <li key={link.name}>
                  <Link className="hover:underline" href={link.href}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-row gap-4 items-center place-self-end">
            {isLoading ? null : button}
          </div>
        </div>
      </header>
    </motion.div>
  );
};
