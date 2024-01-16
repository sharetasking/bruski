import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";


export async function GET(req: NextRequest) {

  try {
    // Get user id from clerk
    const clerkUser = await currentUser();
    const user = await prismadb.user.findFirst({
      where: {
        clerkUserId: clerkUser?.id
      }
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // const { userId } = req.nextUrl.searchParams.get('userId');

    if (!user.id || typeof user.id !== 'string') {
      throw new Error('Invalid ID');
    }

    const notifications = await prismadb.notification.findMany({
      where: {
        profileId: user.id,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    await prismadb.user.update({
      where: {
        id: user.id
      },
      data: {
        hasNotifications: false,
      }
    });


    return NextResponse.json(notifications);
  }
  catch(e)
  {
    return new NextResponse("Internal Error", { status: 500 });
  }


}