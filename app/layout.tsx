import { AuthBoundary } from "@/components/auth/authBoundary";
import { Header } from "@/components/blocks/header";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Daddy Pack",
  description: "Who's your Daddy Today?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "bg-gradient-to-br from-primary/5 via-pink-50 to-primary/15",
        )}
      >
        <ConvexClientProvider>
          <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
          <main className="flex h-full flex-col px-6 py-4 md:px-9 md:py-6">
            <Header />
            <AuthBoundary>{children}</AuthBoundary>
          </main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
