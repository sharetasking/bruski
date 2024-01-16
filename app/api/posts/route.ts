import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { log } from "console";

export async function POST( req: Request, { params }: { params: { profileId: string } }) {
  
  
  try {
    const data = await req.json();
    const user = await currentUser();
    const { body } = data;

    if (!user || !user.id) {
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
        clerkUserId: user.id
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
    console.log(localUser.profiles[0].id, "localUser.profiles[0].id")
const profileId = localUser.profiles[0].id;
let post;
    //create the post
    try{
        post = await prismadb.post.create({
      data: {
        profileId: profileId,
        body: body.substring(0, process.env.POST_MAX_CHARACTERS) ?? 350
      }
    });
    }
    catch(err)
    {
      console.log(err, "err")
    }
    
    return NextResponse.json(post);
  } catch (error) {

    return new NextResponse("Internal Error", { status: 500 });
  }
};



// FETCH ALL POSTS (For everyone or for one profile)
export async function GET( req: NextRequest, { params }: { params: { page?: number, size?: number } }) {

  try {
    // CURRENT PAGE AND NUM POSTS TO PULL
    // const { page, size } = params; //TODO: code this
    console.log(req.nextUrl.searchParams.get("page"), "req.nextUrl.searchParams.get(page)")
    const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1") ?? 1;
    const size = parseInt(req.nextUrl.searchParams.get("size") ?? "3") ?? 3;
    console.log(page, size, "page, size")
    const profileId = req.nextUrl.searchParams.get("profileId");

    const offset = (page - 1) * size; // Calculate the offset based on the page number and size

    const user = await currentUser();

    //check if logged in
    const localUser = await prismadb.user.findFirst({
      where: {
        clerkUserId: user?.id
      },
      include: {
        profiles: true // Include the related Profile records
      }
    });
    
    let results;
    // [ GET POSTS ]

    // IF NOT LOGGED IN (Select but don't include follow status)
    if(!localUser || !localUser.id) results = await fetchPostsForGuest(profileId??"", page, offset, size)
    else results = await fetchPostsForUser(profileId ?? "", localUser?.profiles[0].id, page, offset, size);

    console.log(results)

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
          profileId: followee
        },
        include: {
          poster: true,
          commentList: true
        },
        orderBy: {
          createdAt: 'desc'
        },
      });
    }

    // -- SELECTING FOR ALL PROFILES
    else
    {
    
      posts = await prismadb.post.findMany({
        skip: offset,
        take: size,
        include: {
          // include the poster and their followers
          poster: true,
          commentList: true,
          likeList: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }
    

    return posts;
  }


  // GET POSTS TO SHOW TO SOMEONE WHO IS LOGGED IN
  async function fetchPostsForUser(followee:string, follower:string, page:number, offset:number, size:number)
  {

    console.log("fetching")


    let posts = null;

    //SELECTING FOR A SPECIFIC PROFILE
    if(followee) 
    {




      posts = await prismadb.post.findMany({
        skip: offset,
        take: size,
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
          commentList: true,
          likeList: true
        },
        where: {
          profileId: followee
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
          commentList: true,
          likeList: true
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
          console.log(results)

      }catch(error)
      {
        console.log(error)
        return error;
      }

      console.log(results)
      return results;
    });

    //get the list of posters and find out if the user is following them
    // const posters = posts.map(post => post.poster);
    // console.log(posters)
    // const postersWithFollowedFlag = posters.map((poster) => {
    // const isFollowed = !!poster.followersList.find(follower => follower.followerId === follower)
    // const results = {
    //   ...poster,
    //   isFollowed
    // };

    
    

    console.log(updated_posts)
    return updated_posts;
  }













    // //SELECTING FOR A SPECIFIC PROFILE
    // if(profileId) 
    // {
    //   posts = await prismadb.post.findMany({
    //     where: {
    //       profileId
    //     },
    //     include: {
    //       poster: true,
    //       commentList: true
    //     },
    //     orderBy: {
    //       createdAt: 'desc'
    //     },
    //   });
    // }
    
    
    


    // else
    // {

    
   
      
    //   if(localUser)
    //   {

    //       posts = await prismadb.post.findMany({
    //         skip: offset,
    //         take: size,
    //         include: {
    //           poster: {
    //             include: {
    //               followers: {
    //                 where: { followerId: requesterId },
    //                 select: { followerId: true },
    //               },
    //             },
    //           },
    //           commentList: true,
    //           likeList: true
    //         },
    //         orderBy: {
    //           createdAt: 'desc'
    //         }
    //       });


    //     }


    // //loop through posts and add liked and follow status

    //     posts = posts.map(post => {
          
    //       const isLiked = post.likeList?.find(like => like.likerId === localUser.profiles[0].id)
          
          

    //       const results = {
    //         ...post,
    //         isLiked
    //       }

    //       return results
    //     })
    //   }

    // }






  
}