// pages/api/check-following/[profileId].js
import { withAuth } from '@clerk/nextjs/api';
import { currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { log } from 'console';
import { NextResponse } from 'next/server';

// export const config = {
//   api: {
//     externalResolver: true,
//   },
// };

  export async function GET(
    request: Request,
    { params }: { params: { profileId: string } } )
    {
  const user = await currentUser();
  
  try {
    // Ensure the user is authenticated
    if (!user || !user.id) {
      new NextResponse("Unauthorized", { status: 401 })
      
    }

    const profileId = params.profileId;
    const userId = user?.id;

    //get profile for this ser
    const senderProfile = await prismadb.profile.findFirst({
      where: {
        id: profileId,
      },
    });

    const isFollowing = await prismadb.follower.findFirst({
      where: {
        followerId: senderProfile?.id,
        followeeId: profileId,
      },
    });

    return new NextResponse(JSON.stringify({ isFollowing: !!isFollowing }), { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}