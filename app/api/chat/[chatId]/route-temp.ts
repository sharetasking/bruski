// // No need to import 'dotenv' as Next.js automatically loads environment variables.
// // import dotenv from "dotenv";
// import { StreamingTextResponse, LangChainStream } from "ai";

// import { auth, currentUser } from "@clerk/nextjs";
// import { Replicate } from "langchain/llms/replicate";
// import { CallbackManager } from "langchain/callbacks";
// import { NextResponse } from "next/server";

// import { MemoryManager } from "@/lib/memory";
// import { rateLimit } from "@/lib/rate-limit";
// import prismadb from "@/lib/prismadb";

// // dotenv.config({ path: `.env` }); // Next.js automatically loads .env files.

// export async function POST(
//   request: Request,
//   { params }: { params: { chatId: string } }
// ) {
//   try {
//     // GET PROMPT
//     const { prompt } = await request.json();


//     // GET CURRENT USER
//     const user = await currentUser();

//     if (!user || !user.firstName || !user.id) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }


//     // GET COMPANION
//     const identifier = request.url + "-" + user.id;
//     const { success } = await rateLimit(identifier);

//     if (!success) {
//       return new NextResponse("Rate limit exceeded", { status: 429 });
//     }


//         // First, you would update the Companion
//     const updatedCompanion = await prismadb.companion.update({
//       where: { id: params.chatId },
//       data: {
//         // Any updates to the Companion go here
//       },
//     });

//     // Then, assuming the `user.id` is the ID of a Profile, create a Message associated with that Profile
//     const newMessage = await prismadb.message.create({
//       data: {
//         content: prompt,
//         role: "user",
//         sender: {
//           connect: { id: user.id },
//         },
//         // You need to connect this message to a receiver, which should be a profile as well.
//         receiver: {
//           connect: { id: receiverProfileId }, // You need to provide the receiver's profile ID
//         },
//         // Additional fields as necessary
//       },
//     });



//     // const companion = await prismadb.companion.update({
//     //   where: { id: params.chatId },
//     //   data: {
//     //     messages: {
//     //       create: {
//     //         content: prompt,
//     //         role: "user",
//     //         userId: user.id,
//     //       },
//     //     },
//     //   },
//     // });

//     if (!companion) {
//       return new NextResponse("Companion not found", { status: 404 });
//     }

//     // ... (rest of the code remains unchanged until the streaming part) ...

//     const name = companion.id;
//     const companion_file_name = name + ".txt";

//     const companionKey = {
//       companionName: name!,
//       userId: user.id,
//       modelName: "llama2-13b",
//     };
//     const memoryManager = await MemoryManager.getInstance();

//     const records = await memoryManager.readLatestHistory(companionKey);
//     if (records.length === 0) {
//       await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
//     }
//     await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);

//     // Query Pinecone

//     const recentChatHistory = await memoryManager.readLatestHistory(companionKey);

//     // Right now the preamble is included in the similarity search, but that
//     // shouldn't be an issue

//     const similarDocs = await memoryManager.vectorSearch(
//       recentChatHistory,
//       companion_file_name
//     );

//     let relevantHistory = "";
//     if (!!similarDocs && similarDocs.length !== 0) {
//       relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
//     }
//     const { handlers } = LangChainStream();
//     // Call Replicate for inference
//     const model = new Replicate({
//       model:
//         "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
//       input: {
//         max_length: 2048,
//       },
//       apiKey: process.env.REPLICATE_API_TOKEN,
//       callbackManager: CallbackManager.fromHandlers(handlers),
//     });

//     // Turn verbose on for debugging
//     model.verbose = true;

//     const resp = String(
//       await model
//         .call(
//           `
//         ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.username}: prefix. 

//         ${companion.instructions}

//         Below are relevant details about ${companion.username}'s past and the conversation you are in.
//         ${relevantHistory}


//         ${recentChatHistory}\n${companion.username}:`
//         )
//         .catch(console.error)
//     );

//     const cleaned = resp.replaceAll(",", "");
//     const chunks = cleaned.split("\n");
//     const response = chunks[0];

//     await memoryManager.writeToHistory("" + response.trim(), companionKey);
//     var Readable = require("stream").Readable;

//     let s = new Readable();
//     s.push(response);
//     s.push(null);




//     // Assuming the response from the model.call() is correct:
//     const responseText = response.trim();

//     if (responseText && responseText.length > 1) {
//       await memoryManager.writeToHistory(responseText, companionKey);

//       await prismadb.companion.update({
//         where: { id: params.chatId },
//         data: {
//           messages: {
//             create: {
//               content: responseText,
//               role: "system",
//               userId: user.id,
//             },
//           },
//         },
//       });

//       // Create a web standard ReadableStream for the response body
//       const stream = new ReadableStream({
//         start(controller) {
//           const encoder = new TextEncoder();
//           const uint8array = encoder.encode(responseText);
//           controller.enqueue(uint8array);
//           controller.close();
//         },
//       });

//       // Return the stream wrapped in a Response object
//       return new Response(stream, {
//         headers: { 'Content-Type': 'text/plain' },
//       });
//     } else {
//       // Handle cases where responseText is empty or too short
//       return new NextResponse("No content", { status: 204 });
//     }
//   } catch (error) {
//     // Make sure to log the actual error for debugging purposes
//     console.error(error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }
