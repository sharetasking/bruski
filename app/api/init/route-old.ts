// import { NextApiRequest, NextApiResponse } from 'next'
// import { NextResponse } from 'next/server'
// import prisma from '@/lib/prismadb'
// import { currentUser } from '@clerk/nextjs'
// import { log } from 'console';


// export async function GET() {


//   try {

//     // get user id and api key from request
//     // check if user exists in db
//     // if not, create user
//     // check if profile exists in db
//     // if not, create profile
//     // return user and profile

//       // Accessing query parameters



//       const clerkUserId = req.nextUrl.searchParams.get('clerkUserId');
//       const key = req.nextUrl.searchParams.get('key')
//       const API_KEY = process.env.BRUSKI_MASTER_API_KEY;

      
//       if(key!=API_KEY)
//       {
//         return new NextResponse(JSON.stringify({ error: 'Invalid key' }), { status: 401 });
//       }

//     let user = await prisma.user.findFirst({
//       where: {
//         clerkUserId: clerkUserId,
//       },
//     });
//     if (!user) {
//       user = await prisma.user.create({
//         data: {
//           clerkUserId: clerkUserId,
//         },
//       });
//     }
//     let profile = await prisma.profile.findFirst({
//       where: {
//         userId: user.id,
//       },
//     });

//     if (!profile) {
//       profile = await prisma.profile.create({
//         data: {
//           userId: user.id,
//           url: user.id,
//           display_name: ""
//         },
//       });
//     }
//     return new NextResponse(JSON.stringify({ user, profile }), { status: 200 });
    
//   }
//   catch (error) {
//   }

// }
