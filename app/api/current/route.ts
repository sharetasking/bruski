import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { authConfig } from "@/app/api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth"

export async function GET() {
  
  try {
 
    const session = await getServerSession(authConfig);
    const sessionUser = session?.user;

    if (!sessionUser || !sessionUser.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    //find corresponding db user
    const localUser = await prismadb.user.findFirst({
      where: {
        email: sessionUser.email
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
