import { NextResponse, NextRequest } from "next/server";
import { PostType } from "@prisma/client";
import { currentUser } from "@clerk/nextjs";
import { rateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prismadb";
import { MemoryManager } from "@/lib/memory";
import { Replicate } from "langchain/llms/replicate";
import { CallbackManager } from "langchain/callbacks";
import { StreamingTextResponse, LangChainStream } from "ai";


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
        include: {
          profiles: {
            where: {
              id: profileId
            }
          }
        },
        
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
  const prompt = "You are a cat that specializes in a specific type of magic. Give a random trivia (different each time) to engage your users. Create a post with 2 sentences. Only give one thought. Do not repeat what was said before. "
  const seed = `
    EXAMPLE 1: If you were a magical cat and you could do any type of magic, what would it be?
    EXAMPLE 2: Who remenbers the ingredients for the cauldron in Macbeth?
    EXAMPLE 3: What is your favorite time of year?
    EXAMPLE 4: What is your favorite magical animal?
  `
  const companionName = "Cat"
  const companionInstructions = "You are a cat that specializes in a specific type of magic. Give a random trivia (different each time) to engage your users.Create a 250 character max post. Only give one thought. Do not repeat what was said before. "


  // CREATE A POST FOR THE BOT'S PROFILE
  const postResult = await createPostForProfile(profileId, prompt, seed, companionName, companionInstructions);
  
  return NextResponse.json({ message: "Post Created", postId: postResult?.id });
}


// FUNCTION TO: Create a post for the bot's profile
async function createPostForProfile(profileId:string, prompt:string, seed:string, companionName:string, companionInstructions:string) {
  













  // QUERY THE LLM 
  const name = profileId;
  const companion_file_name = name + "2.txt"; //create file name based on profileId

  // CREATE THE COMPANION KEY
  const companionKey = {
    companionName: name+"1"!,
    profileId: profileId,
    modelName: "mistralai/mixtral",//"llama2-13b",
  };


  // CREATE A MEMORY MANAGER INSTANCE
  const memoryManager = await MemoryManager.getInstance();
  const records = await memoryManager.readLatestHistory(companionKey);

  // IF NO RECORDS, SEED THE CHAT HISTORY
  if (records.length === 0)
    await memoryManager.seedChatHistory(seed, "\n\n", companionKey);
  await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);

  
  // GET THE RECENT CHAT HISTORY (Query Pinecone)
  const recentChatHistory = await memoryManager.readLatestHistory(companionKey);

  // Right now the preamble is included in the similarity search, but that
  // shouldn't be an issue

  // GET SIMILAR DOCS
  const similarDocs = await memoryManager.vectorSearch(
    recentChatHistory,
    companion_file_name
  );

  // CREATE RELEVANT HISTORY
  let relevantHistory = "";
  if (!!similarDocs && similarDocs.length !== 0) {
    relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
  }

  // CREATE HANDLERS
  const { handlers } = LangChainStream();

  // CALL REPLICATE FOR INFERENCE
  const model = new Replicate({
    model:"a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
    // model:"meta/llama-2-70b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
    // model:"mistralai/mixtral-8x7b-instruct-v0.1:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
    input: {
      max_length: 2048,
    },
    apiKey: process.env.REPLICATE_API_TOKEN,
    callbackManager: CallbackManager.fromHandlers(handlers),
  });

  // Turn verbose on for debugging
  model.verbose = true;

  

  // GET THE RESPONSE
  let completeCallDetails = `

  ${companionInstructions}
  Do not duplicate posts. It should be different each time.



  ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companionName}: prefix. 
  `;


  // TODO - REINSTATE THIS
  completeCallDetails = `
  Prompt:
- Character Name: ICU Ivy
- URL: ICUIvy
- Companion ID: ivy.id
- Bio: "Are you smarter than a medical practitioner? Let's find out :)"
- Image Reference: [An intelligent, approachable female figure, with a friendly demeanor, dressed in medical attire. The image conveys expertise and approachability.]
- Type: Companion (AI)
- Theme: Medical knowledge, friendly challenge, engaging and informative
- Objective: Create a short post that invites interaction and tests the reader's medical knowledge in a fun, engaging way.

Generate a short social media-style post for ICU Ivy that embodies her playful, challenging persona. The post should be educational about a medical topic, contain a question or a fun fact to engage the audience, and invite responses. Keep the tone light-hearted and friendly, encouraging interaction and learning.


`;
  // completeCallDetails += `${relevantHistory} "\n\n"
  // Below are relevant details about ${companionName}'s past posts that were made. 
  //`; //TODO: Reinstate


  // completeCallDetails += `${recentChatHistory} \n${companionName}:`//TODO: Reinstate


  console.log(completeCallDetails)
  const resp = String(
    await model
      .call(
        completeCallDetails
      )
      .catch(console.error)
  );

  // CLEAN THE RESPONSE
  const cleaned = resp.replaceAll(",", "");
  const chunks = cleaned.split("\n");
  const response = chunks[0];

  // WRITE THE RESPONSE TO HISTORY
  await memoryManager.writeToHistory("" + response.trim(), companionKey);
  var Readable = require("stream").Readable;

  let s = new Readable();

  // PUSH THE RESPONSE TO THE STREAM
  s.push(response);

  // END THE STREAM
  s.push(null);




  // TRIM RESPONSE: Assuming the response from the model.call() is correct:
  const responseText = response.trim();

  // WRITE THE RESPONSE TO HISTORY
  if (responseText && responseText.length > 1) {
    await memoryManager.writeToHistory(responseText, companionKey);
  }

















  // Create a post for the bot's profile
  const body = responseText;
  const postResult = await prisma?.post.create({
    data: {
      profileId,
      postType: PostType.ORIGINAL,
      mediaType: "CHALLENGE",
      body: body
    }
  });


  console.log(body)
  
  return postResult; 
}






// ******* GET FUNCTION *******
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "GET" });
}