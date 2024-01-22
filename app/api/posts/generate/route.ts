import { NextResponse, NextRequest } from "next/server";
import { PostType, Post } from "@prisma/client";
import { currentUser } from "@clerk/nextjs";
import { rateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prismadb";
import { MemoryManager } from "@/lib/memory";
import { Replicate } from "langchain/llms/replicate";
import { CallbackManager } from "langchain/callbacks";
import { StreamingTextResponse, LangChainStream } from "ai";

import fetch from 'node-fetch';

// ******* POST FUNCTION *******
export async function POST(req: NextRequest) {
  
  // GET PARAMS
  const {profileId} = await req.json();

  // GET CURRENT USER
  const user = await currentUser();

  if (!user || !user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // RATE LIMIT
  const identifier = req.url + "-" + user.id;
  const { success } = await rateLimit(identifier);

  if (!success) {
    return new NextResponse("Rate limit exceeded", { status: 429 });
  }

  // GET LOCAL USER
  const localUser = await prisma.user.findUnique({
    where: {
      clerkUserId: user?.id
    },
    include: {
      companions: {
        where: {
          profiles: {
            some: {
              id: profileId
            }
          }
        }
        // include: {
        //   profiles: {
        //     where: {
        //       id: profileId
        //     }
        //   }
        // },
        
      }
    }
  });

  console.log(localUser)


  // CONFIRM USER OWNS BOT PROFILE
  if(!localUser?.companions?.length) {
    return NextResponse.json("You do not own this bot profile");
  }


  // GET PROMPT
  // TODO: make these dynamic
  const prompt = localUser?.companions?.[0]?.instructions;
  const seed = localUser?.companions?.[0]?.seed;
  const companionName = localUser?.companions?.[0]?.username;

  
  // CREATE A POST FOR THE BOT'S PROFILE
  let postResult = <Post|null> null;
  postResult = await createPostForProfile(profileId, prompt, seed, companionName);
  
  return NextResponse.json({ message: "Post Created", postId: postResult?.id });
}


// FUNCTION TO: Create a post for the bot's profile
async function createPostForProfile(profileId:string, prompt:string, seed:string, companionName:string,) {
  

console.log(prompt)


//prefix it
prompt = `

You are a social media account creating a post almost in a Twitter or Instagram style.
IMPORTANT: Do NOT mention Twitter or Instagram in your post.
Create a post for your profile that is interesting and engaging.
Limit your post to 150 characters.



`+prompt

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'//'https://api.openai.com/v1/engines/davinci/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function queryGPT3(prompt) {
  try {

    console.log(prompt)
    const requestBody = {
      model: 'gpt-3.5-turbo', // Specify the GPT-3 model here
      messages: [
        {
          "role": "system",
          "content": prompt
        },
        {
          "role": "user",
          "content": ""
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
      // Add other parameters as needed
    };
    console.log(requestBody)

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });
    console.log(response)

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim();
  } catch (error) {
    console.error('Error querying GPT-3:', error);
    return null;
  }
}


// Example usage
const prompt2 = 'Write a short, trendy social media post about the latest fashion:';
queryGPT3(prompt).then(async(response) => {


  // Create a post for the bot's profile
  const body = response;

  const postResult = await prisma?.post.create({
    data: {
      profileId,
      postType: PostType.ORIGINAL,
      mediaType: "CHALLENGE",
      body: body
    }
  });

  return postResult ?? null; 



  
}).catch(error => {
 console.log( 'Error querying GPT-3:' + error)
 return null;
 
});
;












}






// ******* GET FUNCTION *******
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "GET" });
}