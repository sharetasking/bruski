import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

export async function PATCH(
  req: Request,
  { params }: { params: { companionId: string } }
) {

  try {

    // GET PARAMS
    const body = await req.json();

    // CHECK IF LOGGED IN
    const clerkUser = await currentUser();
    if(!clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // GET LOCAL USER
    const user = await prismadb.user.findUnique({
      where: {
        clerkUserId: clerkUser.id
      }
    });

    // GET INDIVIDUAL FIELDS FROM BODY
    const { img, name, description, instructions, seed, categoryId } = body;

    // CHECK IF REQUIRED FIELDS ARE PRESENT`
    // Companion Id
    if (!params.companionId) {
      return new NextResponse("Companion ID required", { status: 400 });
    }

    // User
    if (!user || !user.id || !user.first_name) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Companion details
    if (!img || !name || !description || !instructions || !seed || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    };


    // CHECK IF PRO
    // const isPro = await checkSubscription();

    // if (!isPro) {
    //   return new NextResponse("Pro subscription required", { status: 403 });
    // }

    
    // UPDATE COMPANION
    const companion = await prismadb.companion.update({
      where: {
        id: params.companionId,
        ownerId: user.id,
      },
      data: {
        categoryId,
        ownerId: user.id,
        // TODO: Let them select a username
        // username: user.first_name, 
        img,
        description,
        instructions,
        seed,
      }
    });

    const refetchedCompanion = await prismadb.companion.findUnique({
      where: {
        id: params.companionId,
      },
      include: {
        profiles: true,
      }
      
    });

    // confirm that companion has a profile
    let companionProfile = refetchedCompanion?.profiles?.[0];

    if (!companionProfile) {
      // CREATE PROFILE
      let initialUsername = refetchedCompanion?.username ?? "pixi";

      // loop through and find a unique username
      let usernameExists = true;
      let username = initialUsername;
      let i = 0;
      while (usernameExists) {
        const existingProfile = await prismadb.profile.findFirst({
          where: {
            username: username,
          }
        });

        if (!existingProfile) {
          usernameExists = false;
        } else {
          i++;
          username = initialUsername + i;
        }
      }

      companionProfile = await prismadb.profile.create({
        data: {
          display_name: name,
          companionId: params.companionId,
          username: username,
          bio: description,
          url: username,
        }
      });
    }



    // UPDATE COMPANION PROFILE
    await prismadb.profile.update({
      where: {
        id: companionProfile?.id,
      },
      data: {
        display_name: name,
      }
    });

    console.log(companion)

    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export async function DELETE(
  request: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const companion = await prismadb.companion.delete({
      where: {
        ownerId: userId,
        id: params.companionId
      }
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
