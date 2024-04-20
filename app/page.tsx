'use client';

import { NewDaddyButton } from '@/components/blocks/fastDaddyForm';
import { DaddiesList } from '@/components/blocks/daddiesList';
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

import { Button } from '@/components/ui/button';
import { useDrawers } from '@/providers/convex-client-provider';

export default function Home() {
  const [_drawers, setDrawers] = useDrawers();

  function toggleDaddyDrawer() {
    setDrawers(prev => ({
      ...prev,
      daddyOpen: !prev.daddyOpen,
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
                  <Button>Add a New Date</Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button>Add a New Contact</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>

        <div className="hidden md:block">
          <NewDaddyButton />
        </div>
        <Button className="hidden md:block">Add a New Date</Button>
        <Button className="hidden md:block">Add a New Contact</Button>
      </div>
      <DaddiesList />
    </>
  );
}
