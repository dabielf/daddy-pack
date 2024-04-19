import { Button } from "@/components/ui/button";
import { BuyButton } from "@/components/ui/buy-button";
import { Header } from "@/components/blocks/header";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { toast } from "sonner";

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
    <main className="bg-orange-400 h-full p-12">
      <Header></Header>
      {/* <Button
        onClick={() => {
          toast.success("Coucou !");
        }}
      > */}
      <BuyButton text="Acheter" />
    </main>
  );
}
