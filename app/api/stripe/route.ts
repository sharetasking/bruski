import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { authConfig } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

const settingsUrl = absoluteUrl("/settings");

export async function POST(req: NextRequest) {
  console.log("[STRIPE] POST");
  console.log("[STRIPE] req", req);
  
  const session = await getServerSession(authConfig)
  const sesionUser = session?.user;

  //get promotekit_referral
  const params = await req.json();
  const {promotekit_referral} = params ?? "";
  console.log(promotekit_referral);
  try {

    // CONFIRM USER IS LOGGED IN
    


    // IF NOT LOGGED IN, RETURN UNAUTHORIZED
    if (!sesionUser || !sesionUser.email) {
      console.log("[STRIPE] user not logged in");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // GET USER ID
    const user = await prismadb.user.findUnique({
      where: {
        email: sesionUser.email ?? ""
      },
      include: {
        subscriptions: true,
      }

    });


    // IF USER ID NOT FOUND, RETURN UNAUTHORIZED
    if (!user) {
      console.log("[STRIPE] user not found");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = user.id;

    // CHECK IF USER HAS A STRIPE CUSTOMER ID
    const userSubscription = user?.subscriptions[0];

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      })
console.log("[STRIPE] stripeSession", stripeSession);
      return new NextResponse(JSON.stringify({ url: stripeSession.url }))
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.email ?? "",
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Companion Pro",
              description: "Create Custom AI Companions"
            },
            unit_amount: 999,
            recurring: {
              interval: "month"
            }
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        promotekit_referral
      },
    })

    console.log("[STRIPE] stripeSession", stripeSession);
    return new NextResponse(JSON.stringify({ url: stripeSession.url }))
  } catch (error) {
    console.log("[STRIPE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
