import { AuthBoundary } from '@/components/auth/authBoundary';
import { Header } from '@/components/blocks/header';
import { Toaster } from '@/components/ui/sonner';
import { ConvexClientProvider } from '@/providers/convex-client-provider';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const inter = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Daddy Pack',
  description: "Who's your Daddy Today?",
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
          <Toaster position="bottom-right" toastOptions={{ duration: 1000 }} />
          <main className="h-full px-6 md:px-9 py-4 md:py-6 flex flex-col">
            <Header />
            <AuthBoundary>{children}</AuthBoundary>
          </main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
