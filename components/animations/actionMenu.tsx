"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, createContext, useContext, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { cn } from "@/lib/utils";

const ActionContext = createContext({
  open: false,
  setOpen: (open: boolean) => {},
});

function staggerDown(open: boolean) {
  return {
    initial: { opacity: 0, y: -5 },
    animate: {
      opacity: open ? 1 : 0,
      y: open ? 0 : -5,
      // height: open ? 'auto' : 0,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
}

export function ActionItem({ children }: { children: React.ReactNode }) {
  const context = useContext(ActionContext);
  return (
    <motion.div
      className="flex items-center space-x-2"
      variants={staggerDown(context.open)}
    >
      {children}
    </motion.div>
  );
}

export function ActionItems({ children }: { children: React.ReactNode }) {
  const context = useContext(ActionContext);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerDown(context.open)}
      className={cn(
        context.open ? "" : "pointer-events-none",
        "absolute right-0 z-10 mt-2 flex flex-col items-end gap-2",
      )}
    >
      {children}
    </motion.div>
  );
}

export function ActionTrigger({
  children = "Actions",
}: {
  children?: React.ReactNode;
}) {
  const context = useContext(ActionContext);

  function onHandleClick() {
    !context.open && context.setOpen(true);
  }

  return (
    <Button disabled={context.open} onClick={onHandleClick}>
      {children}
    </Button>
  );
}

type ActionButtonProps = {
  children: React.ReactNode;
  props?: React.ComponentProps<"button">;
};

export function ActionMenu({ children, ...props }: ActionButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <ActionContext.Provider value={{ open, setOpen }}>
      <div className="relative" ref={ref}>
        {/* <motion.div
        // onHoverStart={() => setOpen(true)}
        // onHoverEnd={() => setOpen(false)}
        className="w-fit flex"
      > */}
        {children}
        {/* </motion.div> */}
      </div>
    </ActionContext.Provider>
  );
}
