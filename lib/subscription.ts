// import { getSession } from 'next-auth/react';

import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/options";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {

const session = await getServerSession(authConfig);  
const user = session?.user;
console
  // Retrieve the session using NextAuth.js
  // const session = await getSession(context);
  if (!session || !session.user) {
    return false;
  }

  // Assuming userId is stored in the session
  const userId = session.user?.id; 

  const userSubscription = user?.subscriptions[0];

  if (!userSubscription) {
    return false;
  }
console.log("[STRIPE] checkSubscription userSubscription", userSubscription);
  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()
console.log("[STRIPE] checkSubscription isValid", isValid);
  return !!isValid;
};
