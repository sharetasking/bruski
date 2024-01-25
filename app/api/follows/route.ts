import { NextRequest, NextResponse } from "next/server";

import prismadb from '@/lib/prismadb';
import { ConsoleCallbackHandler } from "langchain/callbacks";
import { authConfig } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function POST( request: NextRequest)
{

  const session = await getServerSession(authConfig);
  const sessionUser = session?.user;

  if(!sessionUser || !sessionUser.email)
  {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // GET PARAMS (target profile id)
  const { profileId } = await request.json()
  
  


  // IF WRONG PROFILE FORMAT
  if (!profileId || typeof profileId !== 'string') {
    throw new Error('Invalid ID');
  }

  //GET LOCAL USER
  const localUser = await prismadb.user.findUnique({
    where: {
      email: sessionUser.email
    },
    include:{
      profiles: true
    }
  });

  // IF NO LOCAL USER
  if(!localUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // CONFIRM NOT FOLLOWING SELF
  if(localUser.profiles?.[0]?.id === profileId)
  {
    throw new Error('Cannot follow yourself');
  }
  
  // CHECK IF ALREADY FOLLOWING
  const existingFollow = await prismadb.follower.findFirst({
    where: {
      followerId: localUser.profiles?.[0]?.id,
      followeeId: profileId
    }
  });

  // IF ALREADY FOLLOWING
  if(existingFollow)
  {
    console.log("already following")
    return NextResponse.json({following: true, increment: false})
  }

  // IF NOT FOLLOWING - Create a new follow relationship
  else
  {
    console.log(localUser.profiles?.[0]?.id,profileId )
    // if either profile id doesn't exist, return
    if(!localUser.profiles?.[0]?.id || !profileId)
      return NextResponse.json({following: false, increment: false})

    const follow = await prismadb.follower.create({
      data: {
        followerId: localUser.profiles?.[0]?.id,
        followeeId: profileId
        
      }
    });
    console.log(follow)

    //UPDATE FOLLOWER AND FOLLOWING COUNTS ON DATABASE
    //Followers
    await prismadb.profile.update({
      where: {
        id: profileId
      },
      data: {
        num_followers: {
          increment: 1
        }
      }
    });

    console.log("updated follower count")
    //Following
    await prismadb.profile.update({
      where: {
        id: localUser.profiles?.[0]?.id // ID of the follower's profile
      },
      data: {
        num_following: {
          increment: 1
        }
      }
    });
    

    console.log("updated following count")
    // CREATE NOTIFICATION

    try {
    //  localUser.profiles[0].id
        // if the user is not liking their own post
        // if(profileId != localUser.profiles[0].id)
        // {


          // CREATE NOTIFICATION ENTRY
          let notification = await prismadb.notification.create({
            data: {
              targetProfileId: profileId,
              targetObjectId: profileId,
              type: "FOLLOW",
              initiatorId: localUser.profiles?.[0]?.id,
              body: ""

            }
          });

          console.log("notification", notification)

          // GET TARGET PROFILE WITH CORRESPONDING USER
          let targetProfile = await prismadb.profile.findUnique({
            where: {
              id: profileId
            },
            include: {
              user: true
            }
          });


          // UPDATE THE TARGET USER'S NOTIFICATION COUNT
          let updatedUser = await prismadb.user.update({
            where: {
              id: targetProfile?.user?.id
            },
            data: {
              num_notifications: {
                increment: 1
              }
            }
          });

          console.log("updatedUser", updatedUser)
        // }
    } catch (error) {
          console.log(error)
    }






    return NextResponse.json({following: true, increment: true})
  }

  






  // if (existingFollow) {
  //   throw new Error('Already following this profile');
  // }

  // // Create a new follow relationship
  // const follow = await prismadb.follower.create({
  //   data: {
  //     followerId: localUser?.profiles[0].id,
  //     followeeId: profileId
  //   }
  // });

      // NOTIFICATION PART START
      // try {
      //   await prisma.notification.create({
      //     data: {
      //       body: 'Someone followed you!',
      //       userId,
      //     },
      //   });

      //   await prisma.user.update({
      //     where: {
      //       id: userId,
      //     },
      //     data: {
      //       hasNotification: true,
      //     }
      //   });
      // } catch (error) {
      //   console.log(error);
      // }
      // // NOTIFICATION PART END


      // const updatedUser = await prisma.user.update({
      //   where: {
      //     id: currentUser.id
      //   },
      //   data: {
      //     followingIds: updatedFollowingIds
      //   }
      // });

      // return res.status(200).json(updatedUser);
      
    
}

export async function DELETE( request: NextRequest ) {

  const session = await getServerSession(authConfig);
  const sessionUser = session?.user;

  if(!sessionUser || !sessionUser.email)
  {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  const profileId = await request.nextUrl?.searchParams.get("profileId");

  
  console.log(profileId)
  

  if (!profileId || typeof profileId !== 'string') {
    // throw new Error('Invalid ID');
    return NextResponse.json({following: true, decrement: false});
  }

  
  console.log(profileId)
  const localUser = await prismadb.user.findUnique({
    where: {
      email: sessionUser.email
    },
    include:{
      profiles: true
    }
  });

  
  console.log(profileId)
  if (!localUser) {
    // throw new Error('Invalid ID');
    return NextResponse.json({following: true, decrement: false});
  }
  
  let existingFollow;
  try {
    
    existingFollow = await prismadb.follower.findFirst({
    where: {
      followerId: localUser?.profiles[0]?.id,
      followeeId: profileId
    }
  });
  } catch (error) {
    
  console.log(error)
  }

  
  console.log(existingFollow)
  if (!existingFollow) {
    console.log("not following")
    return NextResponse.json({following: false, decrement: true});
    // throw new Error('Not following this profile');
  }

  try{
    console.log(profileId)
    // Delete the follow relationship
    await prismadb.follower.delete({
      where: {
        id: existingFollow.id
      }
    });

    console.log(profileId)
    //update follower and following counts on database

    try {
      
    await prismadb.profile.update({
      where: {
        id: profileId
      },
      data: {
        num_followers: {
          decrement: 1
        }
      }
    });
    } catch (error) {
      console.log(error)
    }



    await prismadb.profile.update({
      where: {
        id: localUser.profiles?.[0]?.id // ID of the follower's profile
      },
      data: {
        num_following: {
          decrement: 1
        }
      }
    });

  }
  catch(error)
  {

    return NextResponse.json({following: true, decrement: false})
  }

  return NextResponse.json({following: false, decrement: true});

}
//   if (req.method !== 'POST' && req.method !== 'DELETE') {
//     return res.status(405).end();
//   }

//   try {
//     const { userId } = req.body;


//     if (!userId || typeof userId !== 'string') {
//       throw new Error('Invalid ID');
//     }

//     const user = await prisma.user.findUnique({
//       where: {
//         id: userId
//       }
//     });

//     if (!user) {
//       throw new Error('Invalid ID');
//     }

//     let updatedFollowingIds = [...(user.followingIds || [])];
// // sdfadfa












    // if (req.method === 'POST') {
    //   updatedFollowingIds.push(userId);

    //   // NOTIFICATION PART START
    //   try {
    //     await prisma.notification.create({
    //       data: {
    //         body: 'Someone followed you!',
    //         userId,
    //       },
    //     });

    //     await prisma.user.update({
    //       where: {
    //         id: userId,
    //       },
    //       data: {
    //         hasNotification: true,
    //       }
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    //   // NOTIFICATION PART END
      
    // }

    // if (req.method === 'DELETE') {
    //   updatedFollowingIds = updatedFollowingIds.filter((followingId) => followingId !== userId);
    // }

  //   const updatedUser = await prisma.user.update({
  //     where: {
  //       id: currentUser.id
  //     },
  //     data: {
  //       followingIds: updatedFollowingIds
  //     }
  //   });

  //   return res.status(200).json(updatedUser);
  // } catch (error) {
  //   console.log(error);
  //   return res.status(400).end();
  // }
  