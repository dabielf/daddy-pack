"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { SignInButton, SignOutButton } from "@clerk/nextjs";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";

const links = [
  { name: "Dashboard", href: "/" },
  { name: "Daddies", href: "/daddies" },
  { name: "Settings", href: "/settings" },
  { name: "Timeline", href: "/timeline" },
];

function SignOut() {
  return (
    <Button className="w-full" variant="outline" asChild>
      <SignOutButton />
    </Button>
  );
}

function SignIn() {
  return (
    <Button className="w-full" asChild>
      <SignInButton />
    </Button>
  );
}

export function NavSheetTrigger() {
  const [open, setOpen] = useState(false);
  const { isLoading, isAuthenticated } = useConvexAuth();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // const url = `${pathname}?${searchParams}`;
    // console.log(url);
    setOpen(false);
  }, [pathname, searchParams]);

  const button = isAuthenticated ? <SignOut /> : <SignIn />;

  return (
    <Sheet open={open} onOpenChange={() => setOpen(!open)}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between">
        {/* <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader> */}
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div> */}
        <nav className="mt-6">
          <ul className="flex flex-col items-start gap-2 text-xl">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  className="decoration-primary hover:underline"
                  href={link.href}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SheetFooter>
          {/* <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose> */}
          {isLoading ? null : button}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
