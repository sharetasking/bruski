import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const localUser = await prismadb.user.findFirst({
      where: {
        clerkUserId: user?.id
      }
    });

    const { img, name, description, instructions, seed, categoryId } = body;

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log("[COMPANION_POST] user", user)

    if (!img || !name || !description || !instructions || !seed || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    };

    const isPro = await checkSubscription();
    console.log("[COMPANION_POST] isPro", isPro)
    // if (!isPro) { TODO: Reinstate?
    //   return new NextResponse("Pro subscription required", { status: 403 });
    // }

    if(!localUser?.id) 
      return new NextResponse("Unauthorized", { status: 401 });


    const companion = await prismadb.companion.create({
      data: {
        categoryId,
        ownerId: localUser?.id,
        username: name?.replace(" ", "-"),
        img,
        description,
        instructions,
        seed,
      }
    });



    
  // GENERATE USERNAME
  // CHECK IF AVAILABLE
  const initial_username = name?.replace(" ", "");
  let usernameAvailable = false;
  let usernameAvailableCount = 0;
  let username;

  // LOOP UNTIL A USERNAME ATTEMPT IS AVAILABLE
  while(!usernameAvailable)
  {
    const profile = await prismadb.profile.findFirst({
      where: {
        username
      }
    });

    if(!profile)
      usernameAvailable = true;
    else
    {
      usernameAvailableCount++;
      username = initial_username + usernameAvailableCount;
    }
  }




    // CHECK IF USERNAME IS UNIQUE





    





    // if successful, create a profile for the companion
    const profile = await prismadb.profile.create({
      data: {
        companionId: companion.id,
        img,
        display_name: name,
        username: username,
        bio: description,
        url: companion.id,
        categoryId,
      }
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
