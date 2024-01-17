import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";


import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { log } from "console";

export async function POST(request: NextRequest, { params }: { params: { postId: string, body:string } }) {
  
  const { body } = await request.json();
  const postId = await request.nextUrl.searchParams.get('postId');
  
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
      }
    });

    // if not found
    if (!localUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("localUser", localUser)
    
    //create the comment
    const comment = null;
    // await prismadb.comment.create({
    //   data: {
    //     postId: params.postId,
    //     senderId: localUser.profiles[0].id,
    //     body
    //   }
    // });

    

    return NextResponse.json(comment);
  } catch (error) {

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