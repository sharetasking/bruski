import { NextRequest, NextResponse } from "next/server";
import { MediaType } from "@prisma/client";


import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/options";

import { log } from "console";

export async function POST( req: NextRequest, { params }: { params: { profileId: string, media_type: string } }) {
  


  // GET SESSION
  const session = await getServerSession(authConfig)

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const data = await req.json();

    const user = await session?.user;
    const media_type = req.nextUrl.searchParams.get("media_type");
    const { body } = data?.body ?? "";
    

    if (!user || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!body) {
      return new NextResponse("Missing required fields", { status: 400 });
    };


    // const isPro = await checkSubscription();

    // if (!isPro) {
    //   return new NextResponse("Pro subscription required", { status: 403 });
    // }

    

    //find corresponding db user
    const localUser = await prismadb.user.findFirst({
      where: {
        email: user.email
      },
      include: {
        profiles: true // Include the related Profile records
      }
    });
    console.log(localUser, "localUser")
    // if not found
    if (!localUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // if no profiles
    if (!localUser.profiles || localUser.profiles.length === 0) {
      return new NextResponse("Active profile required", { status: 401 });
    }


    console.log(localUser.profiles[0].id, "localUser.profiles[0].id")
const profileId = localUser.profiles[0].id;
let post;

    //create the post
    try {
      post = await prismadb.post.create({
        data: {
          profileId: profileId,
          body: body.substring(0, process.env.POST_MAX_CHARACTERS ?? 350),
          postType: "ORIGINAL",
          mediaType: media_type as MediaType ?? "TEXT" as MediaType 
        }
      });
    } catch (err) {
      console.log(err, "err")
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.log(error, "error")
    return new NextResponse("Internal Error", { status: 500 });
  }
};



// FETCH ALL POSTS (For everyone or for one profile)
export async function GET( req: NextRequest, { params }: { params: { page?: number, size?: number } }) {

  try {
    // CURRENT PAGE AND NUM POSTS TO PULL
    const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1") ?? 1;
    const size = parseInt(req.nextUrl.searchParams.get("size") ?? "3") ?? 3;

    const profileId = req.nextUrl.searchParams.get("profileId");

    const offset = (page - 1) * size; // Calculate the offset based on the page number and size

    // GET SESSION
    const session = await getServerSession(authConfig)
    const user = await session?.user;

    
    // [ GET POSTS ]
    let results;

    // IF NOT LOGGED IN (Select but don't include follow status)
    if(!user || !user.id) results = await fetchPostsForGuest(profileId??"", page, offset, size)
    else results = await fetchPostsForUser(profileId ?? "", user?.profiles[0].id, page, offset, size);


    return NextResponse.json(results);


  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }



  // GET POSTS TO SHOW TO SOMEONE WHO ISN'T LOGGED IN
  async function fetchPostsForGuest(followee:string, page:number, offset:number, size:number)
  {

    let posts = null;

    // -- SELECTING FOR A SPECIFIC PROFILE
    if(followee) 
    {
      posts = await prismadb.post.findMany({
        where: {
          profileId: followee,
          OR: [
            { date_deleted: { equals: null } }, // Checks if date_deleted is explicitly set to null
            { date_deleted: { isSet: false } }  // Checks if date_deleted is not set at all
          ],
        },
        include: {
          poster: true,
          comments: true,
          originalPost: {
            include: {
              poster: true,
            },
            where: {
              OR: [
                { date_deleted: { equals: null } }, // Checks if date_deleted is explicitly set to null
                { date_deleted: { isSet: false } }  // Checks if date_deleted is not set at all
              ],
            }
          },
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 30,
      });
    }

    // -- SELECTING FOR ALL PROFILES
    else
    {
    
      posts = await prismadb.post.findMany({
        skip: offset,
        take: size,
        where: {
      OR: [
        { date_deleted: { equals: null } }, // Checks if date_deleted is explicitly set to null
        { date_deleted: { isSet: false } }  // Checks if date_deleted is not set at all
      ],
        },
        include: {
          // include the poster and their followers
          poster: true,
          likeList: true
        },
        orderBy: {
          createdAt: 'desc'
        },
      });
    }
    

    return posts;
  }


  // GET POSTS TO SHOW TO SOMEONE WHO IS LOGGED IN
  async function fetchPostsForUser(followee:string, follower:string, page:number, offset:number, size:number)
  {

    let posts = null;

    //SELECTING FOR A SPECIFIC PROFILE
    if(followee) 
    {




      posts = await prismadb.post.findMany({
        skip: offset,
        take: size,
        where: {

          profileId: followee,
          OR: [
            { date_deleted: { equals: null } }, // Checks if date_deleted is explicitly set to null
            { date_deleted: { isSet: false } }  // Checks if date_deleted is not set at all
          ],
        },
        include: {
          poster: {
            // include both the followers and following for the poster
            include: { 
              listOfProfilesFollowingViewedProfile: {
                where: { followerId: follower },
                select: { followerId: true, followeeId: true },
              },
              // listOfProfilesFollowedByViewedProfile: {
              //   select: { followerId: true, followeeId: true },
              // }
            },
          },
          comments: true,
          originalPost: {
            include: {
              poster: true,
            },
            where: {
              OR: [
                { date_deleted: { equals: null } }, // Checks if date_deleted is explicitly set to null
                { date_deleted: { isSet: false } }  // Checks if date_deleted is not set at all
              ],
            }
          },
          likeList: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });


    }

    // SELECTING FOR ALL PROFILES
    else
    {
    
      console.log(followee, follower)

      try{
        
      posts = await prismadb.post.findMany({
        skip: offset,
        take: size,
        where: {

      OR: [
        { date_deleted: { equals: null } }, // Checks if date_deleted is explicitly set to null
        { date_deleted: { isSet: false } }  // Checks if date_deleted is not set at all
      ],
        },
        include: {
          poster: {
            // include both the followers and following for the poster
            include: { 
              listOfProfilesFollowingViewedProfile: {
                where: { followerId: follower },
                select: { followerId: true, followeeId: true },
              },
              // listOfProfilesFollowedByViewedProfile: {
              //   select: { followerId: true, followeeId: true },
              // }
            },
          },
          likeList: true,
          comments: true,
          originalPost: {
            include: {
              poster: true,
            },
            where: {
              OR: [
                { date_deleted: { equals: null } }, // Checks if date_deleted is explicitly set to null
                { date_deleted: { isSet: false } }  // Checks if date_deleted is not set at all
              ],
            }
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

    }
    catch(error)
    {
      console.log(error)
    }
      
      console.log("df",posts,"sfasfasfs")
    }


    if(!posts) return null; 

    //loop through posts and add liked and follow status
    const updated_posts = posts.map(post => {
      let results;

      //check if user is following the poster

      try{
        
          const isFollowed = post.poster.listOfProfilesFollowingViewedProfile?.length > 0;//?.find(follower => follower.followerId === follower) 
          const isLiked = !!post.likeList.find(like => like.likerId === follower)
          results = {
            ...post,
            poster: {
              ...post.poster,
              isFollowed,
            },
            isLiked
          }

      }catch(error)
      {
        console.log(error)
        return error;
      }

      return results;
    });


    return updated_posts;
  }



  
}