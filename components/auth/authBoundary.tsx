"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@clerk/nextjs";

export function AuthBoundary({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <div className="flex grow items-center justify-center font-black">
          <div>
            Please{" "}
            <span className="*:underline hover:text-primary">
              <SignInButton />
            </span>{" "}
            <br />
            to manage your daddies
          </div>
        </div>
      </Unauthenticated>
    </>
  );
}
