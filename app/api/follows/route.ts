import { NextRequest, NextResponse } from "next/server";

import prismadb from '@/lib/prismadb';
import { currentUser } from "@clerk/nextjs"
import { ConsoleCallbackHandler } from "langchain/callbacks";

export async function POST( request: NextRequest)
{
  
  const user = await currentUser();

  const { profileId } = await request.json()

  //if wrong profile format
  if (!profileId || typeof profileId !== 'string') {
    throw new Error('Invalid ID');
  }

  //get localUser
  const localUser = await prismadb.user.findUnique({
    where: {
      clerkUserId: user?.id
    },
    include:{
      profiles: true
    }
  });

  if(!localUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  //confirm user and profile aren't the same
  if(localUser.profiles?.[0].id === profileId)
  {
    throw new Error('Cannot follow yourself');
  }
  
  console.log(profileId)
  // see if already following
  // 
  const existingFollow = await prismadb.follower.findFirst({
    where: {
      followerId: localUser.profiles[0].id,
      followeeId: profileId
    }
  });
console.log(existingFollow)
  if(existingFollow)
  {
    console.log("already following")
    return NextResponse.json({following: true, increment: false})
  }
  else
  {
    const follow = await prismadb.follower.create({
      data: {
        follower: {
          connect: {
            id: localUser.profiles[0].id
          }
        },
        followee: {
          connect: {
            id: profileId
          }
        }
        
      }
    });
    console.log(follow)

    //update follower and following counts on database
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

    await prismadb.profile.update({
      where: {
        id: localUser.profiles[0].id // ID of the follower's profile
      },
      data: {
        num_following: {
          increment: 1
        }
      }
    });
    


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

  
  const profileId = await request.nextUrl?.searchParams.get("profileId");

  
  console.log(profileId)
  
  const user = await currentUser();


  if (!profileId || typeof profileId !== 'string') {
    // throw new Error('Invalid ID');
    return NextResponse.json({following: true, decrement: false});
  }

  
  console.log(profileId)
  const localUser = await prismadb.user.findUnique({
    where: {
      clerkUserId: user?.id
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
        id: localUser.profiles[0].id // ID of the follower's profile
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
  