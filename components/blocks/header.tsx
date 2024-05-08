"use client";

import { Button } from "@/components/ui/button";
import animations from "@/constants/animations";
// import { useConvexData } from "@/providers/convexDataContext";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { NavSheetTrigger } from "@/components/blocks/navSheet";
import { useConvexAuth } from "convex/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/blocks//modeToggle";
import { useTheme } from "next-themes";

const links = [
  { name: "Dashboard", href: "/" },
  { name: "Daddies", href: "/daddies" },
  // { name: 'Dates', href: '/dates' },
  // { name: 'Contacts', href: '/contacts' },
  { name: "Settings", href: "/settings" },
];

export const Header = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { theme } = useTheme();
  // const { user } = useConvexData();

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
      <header className="mb-6">
        <div className="grid w-full grid-cols-2 items-center  md:grid-cols-3">
          <Link href={"/"}>
            <Image
              src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
              alt="logo"
              width={160}
              height={100}
              priority
            />
          </Link>

          <nav className="justify-self-end md:place-self-center">
            <ul className="flex flex-row items-center gap-4">
              {links.map((link) => (
                <li key={link.name}>
                  <Link className="hover:underline" href={link.href}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-row items-center gap-4 place-self-end">
            <ModeToggle />
            {/* {isLoading ? null : button} */}
            <NavSheetTrigger />
          </div>
        </div>
      </header>
    </motion.div>
  );
};
