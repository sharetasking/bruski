import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { Profile } from "@prisma/client";


import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { log, profile } from "console";
import { authConfig } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

// export async function POST() {
  
//   try {
//     const data = await req.json();
//     const user = await currentUser();
//     const { body } = data;


//     if (!user || !user.id) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     if (!body) {
//       return new NextResponse("Missing required fields", { status: 400 });
//     };


//     // const isPro = await checkSubscription();

//     // if (!isPro) {
//     //   return new NextResponse("Pro subscription required", { status: 403 });
//     // }

//     //find corresponding db user
//     const localUser = await prismadb.user.findFirst({
//       where: {
//         email: user.email ?? ""  
//       },
//       include: {
//         profiles: true // Include the related Profile records
//       }
//     });

//     // if not found
//     if (!localUser) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     //create the profile
//     const profile = await prismadb.profile.create({
//       data: {
//         profileId: localUser.profiles[0].id,
//         body
//       }
//     });

//     return NextResponse.json(profile);
//   } catch (error) {

//     return new NextResponse("Internal Error", { status: 500 });
//   }
// };


export async function GET(req: NextRequest) {
  
  const session = await getServerSession(authConfig)
  const sessionUser = session?.user;
  try {
    
    const profileId = req.nextUrl.searchParams.get("profileId");
    let count = req.nextUrl.searchParams.get("take") ? parseInt(req.nextUrl.searchParams.get("take") ?? "10") : 10;
    


    if(!sessionUser || !sessionUser.email) 
    return new NextResponse("Unauthorized", { status: 401 });


    const user = await prismadb.user.findFirst({
      where: {
        email: sessionUser.email ?? ""
      },
      include: {
        profiles: true // Include the related Profile records
      }
    });

    const follower = user?.profiles[0].id;


    let profiles;

    //if looking for profiles for a specific profileId then pull just those
    // if(profileId) 
    // {
    //   profiles = await prismadb.profile.findMany({
    //     where: {
    //       profileId
    //     },
    //     include: {
    //       user: true,
    //       comments: true
    //     },
    //     orderBy: {
    //       createdAt: 'desc'
    //     },
    // take: 30
    //   });

    // }
    // //otherwise pull all profiles
    // else
    // {
      profiles = await prismadb.profile.findMany({
        include: {
          listOfProfilesFollowingViewedProfile: {
            where: { followerId: follower },
            select: { followerId: true, followeeId: true },
          },
          listOfProfilesFollowedByViewedProfile: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: count
      });



      // mark if is following
      interface ExtendedProfile extends Profile {
        isFollowedByUser: boolean;
        isFollowingUser: boolean;
      }

      const _profiles: ExtendedProfile[] = profiles.map(profile => {
        const _profile: ExtendedProfile = {
          ...profile,
          isFollowedByUser: profile.listOfProfilesFollowingViewedProfile.some((follow: any) => follow.followerId === follower) ? true : false,
          isFollowingUser: profile.listOfProfilesFollowedByViewedProfile.some((follow: any) => follow.followeeId === follower) ? true : false
        };
        return _profile;
      });

    


    return new NextResponse(JSON.stringify(_profiles), { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
  
}