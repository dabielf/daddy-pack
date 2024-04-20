'use client';

import { NewDaddyButton } from '@/components/blocks/newDaddyDialog';
import { NewDateButton } from '@/components/blocks/newDateDialog';
import { NewContactButton } from '@/components/blocks/newContactDialog';
import { DaddiesList } from '@/components/blocks/daddiesList';
import { DateList } from '@/components/blocks/dateList';
import { Plus } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  // DrawerDescription,
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
import { ContactList } from '@/components/blocks/contactList';

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
    <>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full mb-9">
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="w-fit md:hidden flex flex-row items-center gap-1">
              <Plus size={24} /> ADD
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
      <DaddiesList />
      <ContactList />
      <DateList />
    </>
  );
}
