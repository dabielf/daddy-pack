"use client";

import { Button } from "@/components/ui/button";
import { BuyButton } from "@/components/ui/buy-button";
import { NewDaddyButton } from "@/components/blocks/fastDaddyForm";
import { DaddiesList } from "@/components/blocks/daddiesList";
import { Header } from "@/components/blocks/header";
import { motion } from "framer-motion";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

export default function Home() {
  // const storeUser = useMutation(api.users.store);

  // const buy = useAction(api.stripe.pay);
  // const router = useRouter();

  // useEffect(() => {
  //   storeUser({});
  // });

  // const handleBuy = async () => {
  //   const url = await buy({});
  //   if (!url) return;
  //   router.push(url);
  // };

  return (
    <main className="h-full p-6 md:p-12 flex flex-col gap-12">
      <Header></Header>
      {/* <Button
        onClick={() => {
          toast.success("Coucou !");
        }}
      > */}
      <Authenticated>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row justify-between gap-4 w-fit mb-6">
            <NewDaddyButton />
            <BuyButton text="New Date" />
            <BuyButton text="New Contact" />
          </div>
          <DaddiesList />
        </motion.div>
      </Authenticated>
      <Unauthenticated>Please login to manage your daddies</Unauthenticated>
    </main>
  );
}
