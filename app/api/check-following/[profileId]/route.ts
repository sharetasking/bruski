// pages/api/check-following/[profileId].js
import prismadb from "@/lib/prismadb";
import { log } from 'console';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '../../auth/[...nextauth]/options';

// export const config = {
//   api: {
//     externalResolver: true,
//   },
// };

  export async function GET(
    request: Request,
    { params }: { params: { profileId: string } } )
    {
      
  const session = await getServerSession(authConfig);
  const user = session?.user;
  
  try {
    // Ensure the user is authenticated
    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
      
    }

    const profileId = params.profileId;
    const userId = user?.id;

    //get profile for this user
    const senderProfile = user.profiles?.[0];

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