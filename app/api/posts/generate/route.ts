import { NextResponse, NextRequest } from "next/server";
import { PostType, Post } from "@prisma/client";
import { rateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prismadb";
import { MemoryManager } from "@/lib/memory";
import { Replicate } from "langchain/llms/replicate";
import { CallbackManager } from "langchain/callbacks";
import { StreamingTextResponse, LangChainStream } from "ai";

import fetch from 'node-fetch';
import { getServerSession } from "next-auth";
import { authConfig } from "../../auth/[...nextauth]/options";

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;



interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}




// GET PARAMS
// ******* POST FUNCTION *******
export async function POST(req: NextRequest) {
  const { profileId } = await req.json();

  // GET CURRENT SESSION AND USER
  const session = await getServerSession(authConfig);
  const user = session?.user;

  if (!user || !user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // RATE LIMIT
  const identifier = req.url + "-" + user.id;
  const { success } = await rateLimit(identifier);

  if (!success) {
    return new NextResponse("Rate limit exceeded", { status: 429 });
  }


console.log(profileId)

  // CONFIRM USER OWNS BOT PROFILE
  const profile = await prisma.profile.findFirst({
    where: {
      id: profileId,
      userId: user.id
    }
  });


  console.log(profileId)
  if(!profile)
  {
    return NextResponse.json("You do not own this bot profile");
  }

  console.log(profileId)

  //get the last 12 posts from this bot (just the body and id for now)
  const prev_posts = await prisma.post.findMany({
    select: {
      body: true
    }
    ,
    where: {
      profileId: profileId
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 12
  });



  // GET PROMPT
  // TODO: make these dynamic
  //get companion based on the profile id
  const companion = await prisma.companion.findFirst({
    where: {
      profiles: {
        some: {
          id: profileId
        }
      }
    }
  });


  if(!companion) {
    return NextResponse.json("You do not own this bot profile");
  }
  
  // GET PROMPT
  const prompt = companion?.instructions;
  const seed = companion?.seed;
  const companionName = companion?.username;

  
  // CREATE A POST FOR THE BOT'S PROFILE
  let postResult = await createPostForProfile(profileId, prompt, seed, companionName, prev_posts);
  
  return NextResponse.json({ message: "Post Created", postId: postResult?.id });
}



// Function to create a post for the bot's profile
async function createPostForProfile(profileId: string, prompt: string, seed: string, companionName: string, prev_posts: Array<{}>) {
  try {
    // Add prefix to prompt
    const modifiedPrompt = `
      You are a social media account creating a post in a Twitter or Instagram style.
      IMPORTANT: Do NOT mention Twitter or Instagram in your post.
      Create a post for your profile that is interesting and engaging.
      Limit your post to 150 characters. Do not repeat your posts.
      Change the content of your posts to keep them fresh and interesting.

      Here are your previous posts in JSON format, use them to ensure you don't repeat yourself: ${JSON.stringify(prev_posts)},

      Here is your seed: ${seed},
      
      Based on the previous information, here is your prompt:
    ` + prompt;



    console.log(modifiedPrompt)


    // Query GPT-3
    const response = await queryGPT3(modifiedPrompt);
    if (!response) {
      throw new Error('No response from GPT-3');
    }

    // Create a post in the database
    const postResult = await prisma.post.create({
      data: {
        profileId,
        postType: PostType.ORIGINAL,
        mediaType: 'CHALLENGE',
        body: response,
      },
    });

    return postResult;
  } catch (error) {
    console.error('Error in createPostForProfile:', error);
    return null;
  }
}




// Function to query GPT-3
async function queryGPT3(prompt:string) {


  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Specify the GPT-3 model here
        messages: [
          { "role": "system", "content": prompt },
          { "role": "user", "content": "" }
        ],
        max_tokens: 150,
        temperature: 0.1,
      }),
    });


    // Use a type assertion when parsing the JSON response
const data = (await response.json()) as OpenAIResponse;

    return data?.choices?.[0]?.message?.content?.trim() ?? null;
  } catch (error) {
    console.error('Error querying GPT:', error);
    return null;
  }
}



// FUNCTION TO: Create a post for the bot's profile
// async function createPostForProfile(profileId:string, prompt:string, seed:string, companionName:string,) {
  

// console.log(prompt)


// //prefix it
// prompt = `

// You are a social media account creating a post almost in a Twitter or Instagram style.
// IMPORTANT: Do NOT mention Twitter or Instagram in your post.
// Create a post for your profile that is interesting and engaging.
// Limit your post to 150 characters.



// `+prompt

// const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'//'https://api.openai.com/v1/engines/davinci/completions';
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// async function queryGPT3(prompt) {
//   try {

//     console.log(prompt)
//     const requestBody = {
//       model: 'gpt-3.5-turbo', // Specify the GPT-3 model here
//       messages: [
//         {
//           "role": "system",
//           "content": prompt
//         },
//         {
//           "role": "user",
//           "content": ""
//         }
//       ],
//       max_tokens: 150,
//       temperature: 0.7,
//       // Add other parameters as needed
//     };
//     console.log(requestBody)

//     const response = await fetch(OPENAI_API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify(requestBody),
//     });
//     console.log(response)

//     const data = await response.json();
//     return data?.choices?.[0]?.message?.content?.trim() ?? null;
//   } catch (error) {
//     console.error('Error querying GPT-3:', error);
//     return null;
//   }
// }


// // Example usage
// const prompt2 = 'Write a short, trendy social media post about the latest fashion:';
// queryGPT3(prompt).then(async(response) => {


//   // Create a post for the bot's profile
//   const body = response;

//   const postResult = await prisma?.post.create({
//     data: {
//       profileId,
//       postType: PostType.ORIGINAL,
//       mediaType: "CHALLENGE",
//       body: body
//     }
//   });

//   return postResult ?? null; 



  
// }).catch(error => {
//  console.log( 'Error querying GPT-3:' + error)
//  return null;

// });
// ;












// }






// ******* GET FUNCTION *******
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "GET" });
}