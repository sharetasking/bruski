import prisma from "@/lib/prismadb"
import { truncateSync } from "fs";
import { NextResponse, NextRequest } from "next/server"
import { undefined } from "zod";
export async function POST(req: NextRequest) {
  
  
  const BRUSKI_MASTER_API_KEY = await req.nextUrl.searchParams.get("BRUSKI_MASTER_API_KEY")
  let results;
  
  // CONFIRM API KEY CORRECT
  if (BRUSKI_MASTER_API_KEY != process.env.BRUSKI_MASTER_API_KEY) {return new NextResponse(JSON.stringify({error: "Invalid API Key"}), { status: 401 })}


  // results = await getPostTags();
  // results = await getUsers();
  // results = await getProfiles();
  results = await getPosts();

  return new NextResponse(JSON.stringify(results), { status: 200 })
}

async function getPosts(){
  

  try {
  return await prisma.post.findMany({
    select: {
      id: true,
      body: true,
      date_deleted: true,
      
    },
    where: {
      NOT: [
        {
        
          date_deleted: null
        
        },
      ]
    },
    take: 30,
  });

  } catch (error) {
    console.log(error)
  }
  
  return await prisma.post.findMany({
    select: {
      id: true,
      body: true,
      date_deleted: true,
      
    },
    where: {
      NOT: {
        date_deleted: null
      }
    },
    take: 30,
  });
  

}

async function getPostTags(){
  return await prisma.postTag.findMany({
    select: {
      post: true,
      initiator: true,
      target: true,
      }
    })

}
async function getUsers(){
  return await prisma.user.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      profiles: {
        select: {
          display_name: true,
        }
      }
    },
    take: 30

  })
}


async function getProfiles(){
  return await prisma.profile.findMany({
    select: {
      id: true,
      display_name: true,
      url: true,
      username: true,
      user: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
        }
      }
    },
    take: 30

  })
}