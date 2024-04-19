"use client";

import { Button } from "./button";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { use } from "react";

export function BuyButton({ text }: { text: string }) {
  const buy = useAction(api.stripe.pay);
  const router = useRouter();

  const handleBuy = async () => {
    const url = await buy({});
    if (!url) return;
    router.push(url);
  };

  return <Button onClick={handleBuy}>{text || "Buy"}</Button>;
}
