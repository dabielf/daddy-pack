"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { create } from "zustand";

import { useRef, createContext, useContext } from "react";

interface ConvexDataProviderProps {
  children: React.ReactNode;
}

export interface ConvexDataContextState {
  user: Doc<"users"> | undefined | null;
  daddies: Doc<"daddies">[] | undefined | null;
  archivedDaddies: Doc<"daddies">[] | undefined | null;
  dates: Doc<"dates">[] | undefined | null;
  contacts: Doc<"contacts">[] | undefined | null;
  allowancePayments: Doc<"allowancePayments">[] | undefined | null;
}

export const ConvexDataContext = createContext<ConvexDataContextState>({
  user: undefined,
  daddies: undefined,
  archivedDaddies: undefined,
  dates: undefined,
  contacts: undefined,
  allowancePayments: undefined,
});

export function useConvexData() {
  return useContext(ConvexDataContext);
}

export const ConvexDataProvider = ({ children }: ConvexDataProviderProps) => {
  const user = useQuery(api.users.currentUser);
  const daddies = useQuery(api.daddies.getDaddies);
  const archivedDaddies = useQuery(api.daddies.getArchivedDaddies);
  const dates = useQuery(api.dates.getDates);
  const contacts = useQuery(api.contacts.getContacts);
  const allowancePayments = useQuery(api.allowances.getAllowancePayments);

  const useConvexReactiveData = create(() => {
    return {
      user,
      daddies,
      archivedDaddies,
      dates,
      contacts,
      allowancePayments,
    };
  });

  return (
    <ConvexDataContext.Provider
      value={{
        user: useConvexReactiveData((state) => state.user),
        daddies: useConvexReactiveData((state) => state.daddies),
        archivedDaddies: useConvexReactiveData(
          (state) => state.archivedDaddies,
        ),
        dates: useConvexReactiveData((state) => state.dates),
        contacts: useConvexReactiveData((state) => state.contacts),
        allowancePayments: useConvexReactiveData(
          (state) => state.allowancePayments,
        ),
      }}
    >
      {children}
    </ConvexDataContext.Provider>
  );
};
