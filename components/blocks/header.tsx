"use client";

import { useConvexAuth } from "convex/react";
import { UserButton, SignInButton, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";

export const Header = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();

  const button = isAuthenticated ? <SignOutButton /> : <SignInButton />;
  return (
    <header>
      <nav className="flex flex-row justify-between w-full">
        <Image
          src="/logo.svg"
          alt="logo"
          className="mb-12"
          width={150}
          height={50}
        />
        {isLoading ? null : button}
      </nav>
    </header>
  );
};
