import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";


import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { log } from "console";

import { authConfig } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function POST(req: Request, { params }: { params: { profileId: string } }) {
  const session = await getServerSession(authConfig)  
  const sessionUser = session?.user;

  try {
    const data = await req.json();
    const { body } = data;


    if (!sessionUser || !sessionUser.email) {
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
        email: sessionUser.email
      }
    });

    // if not found
    if (!localUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    //create the post
    const post = await prismadb.post.create({
      data: {
        profileId: localUser.id,
        body,
        postType: "ORIGINAL"
      }
    });

    return NextResponse.json(post);
  } catch (error) {

    return new NextResponse("Internal Error", { status: 500 });
  }
};


// export async function GET() {
  export async function GET(request: Request, { params }: { params: { postId: string } }) {
    try {
      const post = await prismadb.post.findFirst({
        where: { id: params.postId,
          OR: [
            { date_deleted: { equals: null } }, // Checks if date_deleted is explicitly set to null
            { date_deleted: { isSet: false } }  // Checks if date_deleted is not set at all
          ], },
        include: {
          poster: true,
          // comments: true
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
  
//   // try {
//     // const data = req.query;
//     // const user = await currentUser();
//     // const userId = user.id
      
//             let posts = await prismadb.post.findMany({take: 30});

//             // TODO: Fix this
//             // if (userId && typeof userId === 'string') {
//             //   posts = await prismadb.post.findMany({
//             //     where: {
//             //       userId
//             //     },
//             //     include: {
//             //       user: true,
//             //       comments: true
//             //     },
//             //     orderBy: {
//             //       createdAt: 'desc'
//             //     },
// take: 30
//             //   });
//             // } else {
//             //   posts = await prismadb.post.findMany({
//             //     include: {
//             //       user: true,
//             //       comments: true
//             //     },
//             //     orderBy: {
//             //       createdAt: 'desc'
//             //     },
// take: 30
//             //   });
//             // }
      
//             // console.log(posts)
//             return new NextResponse("testing", { status: 200 });
//             return new NextResponse(JSON.stringify(posts), { status: 200 });// res.status(200).json(posts);


//   }
//   catch (error) {
//     // console.log("[GET_POST]", error);
//     // return new NextResponse("Internal Error", { status: 500 });
//   }
// }








// import { NextApiRequest, NextApiResponse } from "next";

// import prisma from "@/lib/prismadb"; // ensure the path is correct


// export default async function handler() {
//   if (req.method !== 'POST' && req.method !== 'GET') {
//     return res.status(405).end();
//   }

//   try {
    
//     if (req.method === 'POST') {
//       const currentUser = await auth();




//       const { body } = req.body;

//       const post = await prisma.post.create({
//         data: {
//           body,
//           userId: currentUser.id
//         }
//       });

//       return res.status(200).json(post);
//     }

//     if (req.method === 'GET') {
//       const { userId } = req.query;

//       console.log({ userId })

//       let posts;

//       if (userId && typeof userId === 'string') {
//         posts = await prisma.post.findMany({
//           where: {
//             userId
//           },
//           include: {
//             user: true,
//             comments: true
//           },
//           orderBy: {
//             createdAt: 'desc'
//           },
// take: 30
//         });
//       } else {
//         posts = await prisma.post.findMany({
//           include: {
//             user: true,
//             comments: true
//           },
// take: 30
//           orderBy: {
//             createdAt: 'desc'
//           }
//         });
//       }

//       return res.status(200).json(posts);
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(400).end();
//   }
// }