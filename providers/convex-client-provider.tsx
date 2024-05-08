"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { createContext, useContext, useState } from "react";

import { ConvexDataProvider } from "./convexDataContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

export interface DrawerState {
  daddyOpen: boolean;
  dateOpen: boolean;
  contactOpen: boolean;
  deleteDaddyOpen: boolean;
  deleteDateOpen: boolean;
  deleteContactOpen: boolean;
}

const useDrawersState = (initialState: DrawerState) =>
  useState<DrawerState>(initialState);

export const DrawersContext = createContext<ReturnType<
  typeof useDrawersState
> | null>(null);

export const useDrawers = () => {
  const drawers = useContext(DrawersContext);
  if (!drawers) {
    throw new Error("useDrawers must be used within a DrawersProvider");
  }
  return drawers;
};

function initialDrawerState(): DrawerState {
  let daddyOpen = false;
  let dateOpen = false;
  let contactOpen = false;
  let deleteDaddyOpen = false;
  let deleteDateOpen = false;
  let deleteContactOpen = false;

  return {
    daddyOpen,
    dateOpen,
    contactOpen,
    deleteDaddyOpen,
    deleteDateOpen,
    deleteContactOpen,
  };
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
  children,
}: ConvexClientProviderProps) => {
  const initialState = initialDrawerState();
  const [drawers, setDrawers] = useDrawersState(initialState);
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <ConvexDataProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <DrawersContext.Provider value={[drawers, setDrawers]}>
              {children}
            </DrawersContext.Provider>
          </ThemeProvider>
        </ConvexDataProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
