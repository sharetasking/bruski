import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";


import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { log } from "console";
export async function POST(request: NextRequest, { params }: { params: { postId: string, body:string } }) {
  
  const { body } = await request.json();
  const postId = request.nextUrl.searchParams.get("postId");
  console.log("postId", postId)
  try {
    const user = await currentUser();


    if (!user || !user.id || !user.firstName) {
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
        profiles: true
      }
    });

    // if not found
    if (!localUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("localUser", localUser)
    

  // profileId             String    @db.ObjectId
  // media                 String[]
  // mediaType             MediaType?
  // num_comments          Int       @default(0)
  // categoryId            String?   @db.ObjectId
  
  // // Relations
  // poster                Profile   @relation("PostAndOwner", fields: [profileId], references: [id], onDelete: Cascade)
  // category              Category? @relation(fields: [categoryId], references: [id])

  // // Original Post, Comment, or Rebrew
  // postType              PostType

  // // Reference to the original post (for comments and rebrews)
  // originalPostId        String?   @db.ObjectId
  // originalPost          Post?     @relation("OriginalPostRelations", fields: [originalPostId], references: [id], onDelete: NoAction, onUpdate: NoAction)


  // Relations for rebrews
  // rebrewedByProfile     Profile?  @relation("RebrewsMadeByProfile", fields: [rebrewedById], references: [id])
  // rebrewedById          String?   @db.ObjectId

  // originalPostByProfile Profile?  @relation("RebrewsReceivedByProfile", fields: [originalPostById], references: [id])
  // originalPostById      String?   @db.ObjectId
console.log("postId", postId)
    //create the comment
    const _post = await prismadb.post.create({
      data: {
        body,
        profileId: localUser.profiles[0].id,
        originalPostId: postId,
        postType: "COMMENT",
        // originalPost: {
        //   connect: {
        //     id: postId ?? ""
        //   }
        // }
          
      }
    });
    
    if(!_post) {
      return
    }

    //get the comment with the poster and comment information
    const post = await prismadb.post.findFirst({
      where: {
        id: _post.id
      },
      include: {
        poster: true,
        // comments: true,
      },
    });
    
      
    console.log(post)

    //update original post count
    if(post?.id && postId)
      await prismadb.post.update({
        where: {
          id: postId
        },
        data: {
          num_comments: {
            increment: 1
          }
        }
      });

    // const comment = null;

    // await prismadb.comment.create({
    //   data: {
    //     postId: params.postId,
    //     senderId: localUser.profiles[0].id,
    //     body
    //   }
    // });

    console.log(post)

    return NextResponse.json(post);
  } catch (error) {

    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};


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
      
// //             let posts = await prismadb.post.findMany();

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
// //             //   });
// //             // } else {
// //             //   posts = await prismadb.post.findMany({
// //             //     include: {
// //             //       user: true,
// //             //       comments: true
// //             //     },
// //             //     orderBy: {
// //             //       createdAt: 'desc'
// //             //     }
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

// // import { auth, redirectToSignIn } from "@clerk/nextjs";
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
// //         });
// //       } else {
// //         posts = await prisma.post.findMany({
// //           include: {
// //             user: true,
// //             comments: true
// //           },
// //           orderBy: {
// //             createdAt: 'desc'
// //           }
// //         });
// //       }

// //       return res.status(200).json(posts);
// //     }
// //   } catch (error) {
// //     console.log(error);
// //     return res.status(400).end();
// //   }
// // }