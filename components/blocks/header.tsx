"use client";

import { useConvexAuth } from "convex/react";
import { UserButton, SignInButton, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";

export const Header = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();

  const button = isAuthenticated ? <SignOutButton /> : <SignInButton />;
  return (
    <header className="mb-12">
      <nav className="flex flex-row justify-between items-center w-full">
        <Image src="/logo.svg" alt="logo" width={150} height={75} priority />
        {isLoading ? null : button}
      </nav>
    </header>
  );
};
