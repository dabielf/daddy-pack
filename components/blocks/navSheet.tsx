import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const links = [
  { name: "Dashboard", href: "/" },
  { name: "Daddies", href: "/daddies" },
  { name: "Settings", href: "/settings" },
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

  function toggleSheet() {
    setOpen(!open);
  }

  const button = isAuthenticated ? <SignOut /> : <SignIn />;

  return (
    <Sheet open={open} onOpenChange={toggleSheet}>
      <SheetTrigger asChild>
        <Button variant="ghost">
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
        <div>Menu</div>
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
