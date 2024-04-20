'use client';

import { Authenticated, Unauthenticated } from 'convex/react';

export function AuthBoundary({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <div className="flex grow justify-center items-center font-black">
          Please Sign in <br />
          to manage your daddies
        </div>
      </Unauthenticated>
    </>
  );
}
