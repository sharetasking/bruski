import { authMiddleware, redirectToSignIn, currentUser } from "@clerk/nextjs";
import { NextResponse,  } from "next/server";
import prisma from "@/lib/prismadb";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default  authMiddleware({
  publicRoutes: ["/api/webhook", "/"],

  // async afterAuth(auth, req, evt) {
  //   // Handle users who aren't authenticated
  //   if (!auth.userId && !auth.isPublicRoute) {
  //     return redirectToSignIn({ returnBackUrl: req.url });
  //   }
    // Redirect logged in users to organization selection page if they are not active in an organization
    // if (
    //   auth.userId &&
    //   !auth.orgId &&
    //   req.nextUrl.pathname !== "/org-selection"
    // ) {
    //   const orgSelection = new URL("/org-selection", req.url);
    //   return NextResponse.redirect(orgSelection);
    // }



    // If user logged in, but no user account and  profile created, automatically create
    // const localUser = await prisma.user.findFirst({
    //   where: {
    //     clerkUserId: auth.userId,
    //   },
    // });

    // if(!localUser){
    //   await prisma.user.create({
    //     data: {
    //       clerkUserId: auth.userId,
    //       email: auth.userEmail,
    //       name: auth.userFullName,``
    //     },
    //   });
    // }

    // const profile = await prisma.profile.findFirst({
    //   where: {
    //     userId: auth.userId,
    //   },
    // });
    
    // if (!profile) {
    //   await prisma.profile.create({
    //     data: {
    //       userId: auth.userId,
    //       name: auth.userFullName,
    //       email: auth.userEmail,
    //     },
    //   });

    //check if init == true in query string


    //if so, redirect to /a
    // console.log(23423)
    // console.log("mmmmmmmmmm",auth,"lllllllll", req, "qqqqqqq", evt, 'auth, req, evt')


    // firstName,lastName,.emailAddresses[0].emailAddress,.phoneNumbers[0].phoneNumber
    
    // get req.query.init
    // if(req.nextUrl.searchParams.get('init')=="true")
    // {
    //   const key = process.env.BRUSKI_MASTER_API_KEY;
    //   //query the api to generate user and profile if not exists
    //   const res = await fetch(process.env.NEXT_PUBLIC_APP_URL+'/api/init?clerkUserId='+auth.userId+'&key='+key, {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   })
    //   const data = await res.json()
    //   console.log("ressssyy",data)
    //   return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL+'/home')
    //   //then proceed to next page

    // }

    // return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL+'/a?init='+process.env.BRUSKI_MASTER_API_KEY);
      // return NextResponse.next();
    // }

    // firstName,lastName,.emailAddresses[0].emailAddress,.phoneNumbers[0].phoneNumber


    
    // If the user is logged in and trying to access a protected route, allow them to access route
  //   if (auth.userId && !auth.isPublicRoute) {
  //     return NextResponse.next();
  //   }
  //   // Allow users visiting public routes to access them
  //   return NextResponse.next();
  // },


});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

