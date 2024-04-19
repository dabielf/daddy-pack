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
      <Unauthenticated>Please login to manage your daddies</Unauthenticated>
    </>
  );
}
