// import { NextRequest, NextResponse,  } from 'next/server';
// import { withAuth } from '@clerk/nextjs/api';
// import type { NextApiRequestWithAuth } from '@clerk/nextjs/api';
// import crypto from 'crypto';
// import prismadb from "@/lib/prismadb";

// const clerkWebhookSecret = "whsec_0wcMvOXxv856nJszfdP7ExSbuGbGQiJ4";

// const handlePost = async (req: NextApiRequestWithAuth, res: NextResponse) => {
//   // Note: With the NextRequest object, you should use `req.headers.get()`
//   const signature = req.headers.get('clerk-signature');
//   const hash = crypto
//     .createHmac('sha256', clerkWebhookSecret)
//     .update(JSON.stringify(req.body))
//     .digest('hex');

//   if (!signature || hash !== signature) {
//     return new NextResponse('Invalid signature', { status: 401 });
//   }

//   // Extract the event data from the request body
//   const { eventType } = await req.body.json();

//   // Handle the specific event type (e.g., user.created)
//   if (eventType === 'user.created') {
//     // Your logic to handle the user.created event
//     // Example: Adding the user to your local database
//   }

//   // End the response or continue your logic as needed
//   return new NextResponse(JSON.stringify({ message: 'Event processed successfully' }), { status: 200 });
// }

// export const POST = withAuth(handlePost);
