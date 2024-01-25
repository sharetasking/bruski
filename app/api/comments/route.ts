
import { NextResponse, NextRequest } from "next/server";


import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { log } from "console";
import { authConfig } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth"


export async function POST(request: NextRequest, { params }: { params: { postId: string, body:string } }) {
  
  // GET PARAMS
  const { body } = await request.json();
  const submittedTargetPostId = request.nextUrl.searchParams.get("postId");
  const sessions = await getServerSession(authConfig)
  const sessionUser = sessions?.user;

  if(!submittedTargetPostId) 
  {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {

    // GET USER
    if (!sessionUser || !sessionUser.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // RETURN IF EMPTY COMMENT
    if (!body) {
      return new NextResponse("Missing required fields", { status: 400 });
    };


    // CHECK IF PRO
          // const isPro = await checkSubscription();

          // if (!isPro) {
          //   return new NextResponse("Pro subscription required", { status: 403 });
          // }

    // GET LOCAL USER
    const user = await prismadb.user.findFirst({
      where: {
        email: sessionUser.email
      },
      include: {
        profiles: true
      }
    });

      // if not found
      if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

   
    // SAVE THE COMMENT
    const savedComment = await prismadb.post.create({
      data: {
        body,
        profileId: user.profiles[0].id,
        originalPostId: submittedTargetPostId,
        postType: "COMMENT",
      }
    });
    
    // IF NOT SUCCESSFULLY SAVED
    if(!savedComment) {
      return new NextResponse("Internal Error", { status: 500 });
    }

    // REFETCH THE TARGET POST
    const targetPost = await prismadb.post.findFirst({
      where: {
        id: submittedTargetPostId
      },
      include: {
        poster: {
          include: {
            user: true
          }
        }
      },
    });

    console.log(targetPost)
    
      

    //UPDATE THE TARGET POST COMMENT COUNT
    if(targetPost?.id)
    {
      await prismadb.post.update({
        where: {
          id: targetPost?.id
        },
        data: {
          num_comments: {
            increment: 1
          }
        }
      });
    }


    // CREATE NOTIFICATION

      try {
       
          // if the user is not commenting on their own post
          if(targetPost?.poster.id != user.profiles[0].id)
          {
            // GET THE TARGET PROFILE USER ID
            const targetPostOwnerUserId = targetPost?.poster?.user?.id;

            console.log("targetPostOwnerUserId", targetPostOwnerUserId)

            // CREATE NOTIFICATION ENTRY
            let notification = await prismadb.notification.create({
              data: {
                body: body,
                targetProfileId: targetPost?.poster?.id ?? "",
                targetObjectId: targetPost?.id,
                createdObjectId: savedComment.id,
                type: "COMMENT",
                initiatorId: user.profiles[0].id,

              }
            });


            // UPDATE THE TARGET USER'S NOTIFICATION COUNT
            let updatedUser = await prismadb.user.update({
              where: {
                id: targetPost?.poster?.user?.id
              },
              data: {
                num_notifications: {
                  increment: 1
                }
              }
            });

            console.log("updatedUser", updatedUser)
          }
      } catch (error) {
            console.log(error)
      }



    console.log(targetPost)

    return NextResponse.json(targetPost);
  } catch (error) {

    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {

  const postId = request.nextUrl.searchParams.get("postId");
  
  
  try {
    const post = await prismadb.post.findMany({
      where: {
        originalPostId: postId,
        postType: "COMMENT"}
      ,
      include: {
        poster: {
          include: {
            user: true
          }
        },
        originalPost: {
          include: {
            poster: {
              include: {
                user: true
              }
            }
          }

        },
      },
      orderBy: {
        createdAt: 'desc'
      },
    });
    if (!post) {
      console.log('No post found with ID:', params.postId);
      return new NextResponse('Not Found', { status: 404 });
    }

    return new NextResponse(JSON.stringify(post), { status: 200 });

  } catch (error) {
    console.error('Error fetching post:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }


}

// // export async function GET() {
//   export async function GET(request: Request, { params }: { params: { postId: string } }) {
//     try {
//       const post = await prismadb.post.findFirst({
//         where: { id: params.postId },
//         include: {
//           profile: true,
//           comments: true
//         },
//       });
  
//       if (!post) {
//         console.log('No post found with ID:', params.postId);
//         return new NextResponse('Not Found', { status: 404 });
//       }
  
//       return new NextResponse(JSON.stringify(post), { status: 200 });
  
//     } catch (error) {
//       console.error('Error fetching post:', error);
//       return new NextResponse('Internal Error', { status: 500 });
//     }
//   }
  
// //   // try {
// //     // const data = req.query;
// //     // const user = await currentUser();
// //     // const userId = user.id
      
// //             let posts = await prismadb.post.findMany({take:30});

// //             // TODO: Fix this
// //             // if (userId && typeof userId === 'string') {
// //             //   posts = await prismadb.post.findMany({
// //             //     where: {
// //             //       userId
// //             //     },
// //             //     include: {
// //             //       user: true,
// //             //       comments: true
// //             //     },
// //             //     orderBy: {
// //             //       createdAt: 'desc'
// //             //     },
// take: 30,
// //             //   });
// //             // } else {
// //             //   posts = await prismadb.post.findMany({
// //             //     include: {
// //             //       user: true,
// //             //       comments: true
// //             //     },
// //             //     orderBy: {
// //             //       createdAt: 'desc'
// //             //     },
// take: 30,
// //             //   });
// //             // }
      
// //             // console.log(posts)
// //             return new NextResponse("testing", { status: 200 });
// //             return new NextResponse(JSON.stringify(posts), { status: 200 });// res.status(200).json(posts);


// //   }
// //   catch (error) {
// //     // console.log("[GET_POST]", error);
// //     // return new NextResponse("Internal Error", { status: 500 });
// //   }
// // }








// // import { NextApiRequest, NextApiResponse } from "next";

// // import prisma from "@/lib/prismadb"; // ensure the path is correct


// // export default async function handler() {
// //   if (req.method !== 'POST' && req.method !== 'GET') {
// //     return res.status(405).end();
// //   }

// //   try {
    
// //     if (req.method === 'POST') {
// //       const currentUser = await auth();




// //       const { body } = req.body;

// //       const post = await prisma.post.create({
// //         data: {
// //           body,
// //           userId: currentUser.id
// //         }
// //       });

// //       return res.status(200).json(post);
// //     }

// //     if (req.method === 'GET') {
// //       const { userId } = req.query;

// //       console.log({ userId })

// //       let posts;

// //       if (userId && typeof userId === 'string') {
// //         posts = await prisma.post.findMany({
// //           where: {
// //             userId
// //           },
// //           include: {
// //             user: true,
// //             comments: true
// //           },
// //           orderBy: {
// //             createdAt: 'desc'
// //           },
// take: 30,
// //         });
// //       } else {
// //         posts = await prisma.post.findMany({
// //           include: {
// //             user: true,
// //             comments: true
// //           },
// //           orderBy: {
// //             createdAt: 'desc'
// //           },
// take: 30
// //         });
// //       }

// //       return res.status(200).json(posts);
// //     }
// //   } catch (error) {
// //     console.log(error);
// //     return res.status(400).end();
// //   }
// // }