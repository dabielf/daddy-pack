'use client';

import { NewDaddyButton } from '@/components/blocks/newDaddyDialog';
import { NewDateButton } from '@/components/blocks/newDateDialog';
import { NewContactButton } from '@/components/blocks/newContactDialog';
import { Plus } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerPortal,
} from '@/components/ui/drawer';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { useDrawers } from '@/providers/convex-client-provider';
import animations from '@/constants/animations';
import { Dashboard } from '@/components/blocks/dashboard';

export default function Home() {
  const [_drawers, setDrawers] = useDrawers();

  function toggleDaddyDrawer() {
    setDrawers(prev => ({
      ...prev,
      daddyOpen: !prev.daddyOpen,
    }));
  }

  function toggleDateDrawer() {
    setDrawers(prev => ({
      ...prev,
      dateOpen: !prev.dateOpen,
    }));
  }

  function toggleContactDrawer() {
    setDrawers(prev => ({
      ...prev,
      contactOpen: !prev.contactOpen,
    }));
  }
  return (
    <div className="h-full">
      <div className="flex flex-row justify-end items-center  gap-4 w-full mb-9">
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="md:hidden w-full flex flex-row gap-2">
              <Plus size={20} /> Quick Add
            </Button>
          </DrawerTrigger>
          <DrawerPortal>
            <DrawerContent>
              <motion.div {...animations.appearUp}>
                <DrawerHeader>
                  <DrawerTitle>What do you want to add ?</DrawerTitle>
                  {/* <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription> */}
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button onClick={toggleDaddyDrawer}>Add a New Daddy</Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button onClick={toggleDateDrawer}>Add a New Date</Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button onClick={toggleContactDrawer}>
                      Add a New Contact
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </motion.div>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>

        <div className="hidden md:block">
          <NewDaddyButton />
        </div>
        <div className="hidden md:block">
          <NewDateButton />
        </div>
        <div className="hidden md:block">
          <NewContactButton />
        </div>
      </div>
      <Dashboard />
    </div>
  );
}
