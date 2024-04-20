'use client';

import { BuyButton } from '@/components/ui/buy-button';
import { NewDaddyButton } from '@/components/blocks/fastDaddyForm';
import { DaddiesList } from '@/components/blocks/daddiesList';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
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
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerPortal>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
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
      <div className="flex flex-col md:flex-row justify-center gap-4 w-full mb-9">
        <NewDaddyButton />
        <Button>Add a New Date</Button>
        <Button>Add a New Contact</Button>
      </div>
      <DaddiesList />
    </>
  );
}
