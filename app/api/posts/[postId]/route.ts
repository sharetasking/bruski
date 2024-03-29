import { NextRequest, NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { authConfig } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth"


export async function POST(request: NextRequest, { params }: { params: { postId: string, body:string } }) {
  
  try {
    const body = params.body;

    const session = await getServerSession(authConfig)
    const user = session?.user;
    

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
        postType: "ORIGINAL",
        
      }
    });

    return NextResponse.json(post);
  } catch (error) {

    return new NextResponse("Internal Error", { status: 500 });
  }
};


// export async function GET() {
  export async function GET(request: NextRequest, { params }: { params: { postId: string, take:number, target:string, page:number } }) {

    const session = await getServerSession(authConfig)
    const user = session?.user;
    let _post;
    try {
      const post = await prismadb.post.findFirst({
        where: { id: params.postId,
        
      OR: [
        { date_deleted: { equals: null } }, // Checks if date_deleted is explicitly set to null
        { date_deleted: { isSet: false } }  // Checks if date_deleted is not set at all
      ], },
        include: {
        },
      });
  
      if (!post) {
        return new NextResponse('Not Found', { status: 404 });
      }
      // mark isliked as true if the user has liked the post
      if (user && user.email) {
        const localUser = await prismadb.user.findFirst({
          where: {
            email: user.email
          },
          include: {
            profiles: true // Include the related Profile records
          }
        });
        if (localUser) {
          const like = await prismadb.postLike.findFirst({
            where: {
              targetPostId: post.id,
              likerId: localUser.profiles[0].id,
            }
          });

          if (like) {
             _post = {...post,isLiked: true};
          }
        }
      }


  
      return new NextResponse(JSON.stringify(_post), { status: 200 });
  
    } catch (error) {
      console.error('Error fetching post:', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }
  


  export async function DELETE(request: NextRequest, { params }: { params: { postId: string, } }) {

    const session = await getServerSession(authConfig)
    const user = session?.user;

    // GET ID
    const postId = params.postId;


    // IF NOT EXISTS
    if (!user || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // GET LOCAL USER
    const localUser = await prismadb.user.findFirst({
      where: {
        email: user.email
      },
      include: {
        profiles: true // Include the related Profile records
      }
    });

    // IF NOT EXISTS
    if (!localUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
      // GET POST
      const post = await prismadb.post.findFirst({
        where: {
          id: postId,
          OR: [
  
            {profileId: localUser.profiles[0].id,},
            //or where poster.id = localUser.id
            { poster: { userId: localUser.id } },   
          ],
  
        }
      });
      
    // IF NOT EXISTS
    if (!post) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    try {
      

      // SOFT DELETE POST
      const res = await prismadb.post.update({
        where: {
          id: postId
        },
        data: {
          date_deleted: new Date()
        }
      });

      return new NextResponse("Success", { status: 200 });

    } catch (error) {
      // IF NOT SUCCESFUL
      return new NextResponse("Internal Error", { status: 500 });
    }
  }




//   // try {
//     // const data = req.query;
//     // const user = await currentUser();
//     // const userId = user.id
      
//             let posts = await prismadb.post.findMany({take:30});

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
// take:30
//         });
//       } else {
//         posts = await prisma.post.findMany({
//           include: {
//             user: true,
//             comments: true
//           },
//           orderBy: {
//             createdAt: 'desc'
//           },
// take: 30
//         });
//       }

//       return res.status(200).json(posts);
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(400).end();
//   }
// }