import { NextResponse, NextRequest } from "next/server";
import { PostType } from "@prisma/client";
import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prismadb";


export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body);

  const user = await currentUser();
  const localUser = prisma.user.findUnique({
    where: {
      clerkUserId: user?.id
    },
    include: {
      companions: {
        include: {
          profiles: {
            where: {
              id: body.profileId
            }
          }
        },
        
      }
    }
  });

  console.log(localUser)

  // Assuming body has userId and profileId
  const { profileId } = body;

  console.log(profileId);

  // Validate if the user owns the bot that owns the profile
  const isOwner = await validateOwnership(profileId);
  // if (!isOwner) {
  //   return NextResponse.json({ error: "User does not own the profile" }, { status: 403 });
  // }

  // Create a post for the bot's profile
  const postResult = await createPostForProfile(profileId, body.postData);
  
  return NextResponse.json({ message: "Post Created", postId: postResult?.id });
}

async function validateOwnership(profileId:string) {
  // const profile = await prisma?.profile.findUnique({
  //   where: {
  //     id: profileId
  //   },
  //   select: {
  //     bot: {
  //       select: {
  //         user: {
  //           select: {
  //             clerkUserId: true
  //           }
  //         }
  //       }
  //     }
  //   }
  // });

  // const clerkUserId = profile?.bot?.user?.clerkUserId;

  // return clerkUserId === req.headers.get("x-clerk-user-id");
}

async function createPostForProfile(profileId:string, postData:string) {
  
  const postResult = await prisma?.post.create({
    data: {
      profileId,
      postType: PostType.ORIGINAL,
      mediaType: "TEXT",
      body: postData
    }
  });
  
  return postResult; 
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "GET" });
}