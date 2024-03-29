import prismadb from "@/lib/prismadb";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "../../auth/[...nextauth]/options";


export async function GET(req: NextRequest) {

  const session = await getServerSession(authConfig);
  const user = session?.user;


  try {
    

    // RETURN IF NOT FOUND
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    
    //  RETURN IF WRONG FORMAT
    if (!user.id || typeof user.id !== 'string') {
      throw new Error('Invalid ID');
    }

    // GET NOTIFICATIONS
    const notifications = await prismadb.notification.findMany({
      where: {
        targetProfileId: user.profiles?.[0]?.id
      },
      include:{
        initiator: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });


    // update number of notifications to 0
    await prismadb.user.update({
      where: {
        id: user.id
      },
      data: {
       num_notifications: 0
      }
    });

    // update notifications as viewed
    await prismadb.notification.updateMany({
      where: {
        targetProfileId: user.profiles?.[0]?.id
      },
      data: {
        dateCleared: new Date()
      }
    });


    return NextResponse.json(notifications);
  }
  catch(e)
  {
    console.log(e);
    return new NextResponse("Internal Error", { status: 500 });
  }


}