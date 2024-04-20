'use client';

import { BuyButton } from '@/components/ui/buy-button';
import { NewDaddyButton } from '@/components/blocks/fastDaddyForm';
import { DaddiesList } from '@/components/blocks/daddiesList';

export default function Home() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center gap-4 w-full mb-9">
        <NewDaddyButton />
        <BuyButton text="New Date" />
        <BuyButton text="New Contact" />
      </div>
      <DaddiesList />
    </>
  );
}
