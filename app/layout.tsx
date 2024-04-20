import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from '@/providers/convex-client-provider';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/blocks/header';
import { AuthBoundary } from '@/components/auth/authBoundary';

const inter = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Daddy Pack ❤️',
  description: "Who's your Daddy Today ?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <Toaster position="top-center" />
          <main className="h-full p-6 md:p-9 flex flex-col">
            <Header />
            <AuthBoundary>{children}</AuthBoundary>
          </main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
