import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs"


import prismadb from '@/lib/prismadb';

export async function POST( req: NextRequest, { params }: { params: { postId: string } }) {
  
  const data = await req.json();
    const { postId } = data

  try {
    
    const user = await currentUser();

    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid ID');
    }

      //get localUser
      const localUser = await prismadb.user.findUnique({
        where: {
          clerkUserId: user?.id
        },
        include: {
          profiles: true // Include the related Profile records
        }
      });

      if(!localUser) {
        return new NextResponse("Unauthorized", { status: 401 });
      }


  // Check if the like relationship already exists
  let existingLike
  try{
     existingLike = await prismadb.postLike.findFirst({
      where: {
        targetPostId: postId,
        likerId: localUser.profiles[0].id,
      }
    });
    if (existingLike) {
      return NextResponse.json({liked: true})
    }
  }
  catch(error) {
    console.log(error);
    return NextResponse.error()
  }
  
  

  // Create a new like relationship
  let like2 = null;
  try{

    like2 = await prismadb.postLike.create({
      data: {
        targetPost: {
          connect: {
            id: postId
          },
        },
        liker:{
          connect:{
            id:localUser.profiles[0].id
          },
        },

        // targetComment:{
        //   connect:{
        //     id:"0"
        //   },
        // } 
      }
    });

    // Update the post - increment the likes
    console.log(postId, "postId")
    let post = await prismadb.post.update({
      where: {
        id: postId
      },
      data: {
        num_likes: {
          increment: 1
        }
      }
    });
    return NextResponse.json({liked: true, numLikes: post.num_likes})
  }
  catch(error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }

  








      // NOTIFICATION PART START
      // try {
      //   const post = await prisma.post.findUnique({
      //     where: {
      //       id: postId,
      //     }
      //   });
    
      //   if (post?.userId) {
      //     await prisma.notification.create({
      //       data: {
      //         body: 'Someone liked your tweet!',
      //         userId: post.userId
      //       }
      //     });
    
      //     await prisma.user.update({
      //       where: {
      //         id: post.userId
      //       },
      //       data: {
      //         hasNotification: true
      //       }
      //     });
      //   }
      // } catch(error) {
      //   console.log(error);
      // }
      // NOTIFICATION PART END

      
    }
    catch(error) {
      console.log(error);
      return new NextResponse("Internal Error", { status: 500 });
    }

    // if (req.method === 'DELETE') {
    //   updatedLikedIds = updatedLikedIds.filter((likedId) => likedId !== currentUser?.id);
    // }

    // const updatedPost = await prisma.post.update({
    //   where: {
    //     id: postId
    //   },
    //   data: {
    //     likedIds: updatedLikedIds
    //   }
    // });

  //   return res.status(200).json(updatedPost);
  // } catch (error) {
  //   console.log(error);
  //   return res.status(400).end();
  // }
}



// DELETE
export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
  const data = await req.json();
  const { postId } = data

  try {
    
    const user = await currentUser();

    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid ID');
    }

      //get localUser
      const localUser = await prismadb.user.findUnique({
        where: {
          clerkUserId: user?.id
        },
        include: {
          profiles: true // Include the related Profile records
        }
      });

      if(!localUser) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      //remove like
      let like = null;
      try{
        like = await prismadb.postLike.deleteMany({
          where: {
            targetPostId: postId,
            likerId: localUser.profiles[0].id,
          }
        });
      }
      catch(error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
      }


      // Update the post - decrement the likes
      let post = null;
      try{
        post = await prismadb.post.update({
          where: {
            id: postId
          },
          data: {
            num_likes: {
              decrement: 1
            }
          }
        });
        return NextResponse.json({liked: false, numLikes: post.num_likes})
      }
      catch(error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
      }
      
    }
    catch(error) {
      console.log(error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  
