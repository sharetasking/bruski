import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  
  try {
 
    const user = await currentUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    //find corresponding db user
    const localUser = await prismadb.user.findFirst({
      where: {
        clerkUserId: user.id
      },
      include: {
        profiles: true // Include the related Profile records
      }
    });

    // if not found
    if (!localUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    return new NextResponse(JSON.stringify(localUser), { status: 200 });
  } catch (error) {

    return new NextResponse("Internal Error", { status: 500 });
  }
};
