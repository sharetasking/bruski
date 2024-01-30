"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export const SubscriptionButton = ({
  isPro = false
}: {
  isPro: boolean;
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/stripe",
        { promotekit_referral: window.promotekit_referral},
      );

      window.location.href = response.data.url;
    } catch (error) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="sm" variant={isPro ? "default" : "premium"} disabled={loading} onClick={onClick} >
      {isPro ? "Manage Subscription" : "Upgrade"}
      <Sparkles className={cn("w-4 h-4 ml-2 fill-white", isPro && "hidden")} />
    </Button>
  )
};
