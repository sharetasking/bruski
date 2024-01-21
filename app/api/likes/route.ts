import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs"


import prismadb from '@/lib/prismadb';

export async function POST( req: NextRequest, { params }: { params: { postId: string } }) {
  
  

  // GET PARAMS
  const data = await req.json();
    const { postId } = data
    
  try {
    

    // GET USER
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


  // CHECK IF ALREADY LIKED
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
  
  

  // CREATE LIKE
  let post
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

    // UPDATE POST - Increment the likes
    console.log(postId, "postId")
    await prismadb.post.update({
      where: {
        id: postId
      },
      data: {
        num_likes: {
          increment: 1
        }
      },
      
    });


    // CREATE NOTIFICATION
    //get the profile that owns the post
    post = await prismadb.post.findUnique({
      where: {
        id: postId
      },
      include: {
        poster: true
      }
    });

    if(!post || !post.poster || !post.poster.userId) {
      return new NextResponse("Internal Error", { status: 500 });
    }

    const postOwnerUserId = post.poster.userId;
    
    // if the user is not liking their own post
    if(post.poster.id != localUser.profiles[0].id)
    {


      let notification = await prismadb.notification.create({
        data: {
          body: 'liked your post!',
          targetProfileId: post.poster.id,
          targetObjectId: post.id,
          type: "LIKE",
          initiatorId: localUser.profiles[0].id,

        }
      });


      // update the user's num notifications field
      let updatedUser = await prismadb.user.update({
        where: {
          id: postOwnerUserId
        },
        data: {
          num_notifications: {
            increment: 1
          }
        }
      });
    }


    }
    catch(error) {
      console.log(error);
      return new NextResponse("Internal Error", { status: 500 });
    }


    return NextResponse.json({liked: true, numLikes: post.num_likes})
  }
  catch(error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }

  



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

      //check if already liked
      let existingLike = null;
      try{
        existingLike = await prismadb.postLike.findFirst({
          where: {
            targetPostId: postId,
            likerId: localUser.profiles[0].id,
          }
        });
        if (!existingLike) {
          return NextResponse.json({liked: false, decrement: false})
        }
      }
      catch(error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
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
  
