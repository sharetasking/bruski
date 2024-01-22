import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import { currentUser } from '@clerk/nextjs';

export async function GET(req: NextRequest) {

  // GET PARAMS
  const submittedUsername = await req.nextUrl.searchParams.get('username');

  // CHECK IF USERNAME SUBMITTED
  if (!submittedUsername) {
    return new NextResponse("Username required", { status: 400 });
  }

  // CHECK IF LOGGED IN
  const clerkUser = await currentUser();
  
  let foundProfile;
  let localUser;

  // IF LOGGED IN, GET THE LOCAL USERNAME
  if (clerkUser) {
    localUser = await prisma.user.findUnique({
      where: {
        clerkUserId: clerkUser.id
      },
      include: {
        profiles: true
      }
    });


  // IF FOUND, CHECK IF THE USERNAME IS THE SAME AS THE LOGGED IN USER PROFILE

    // CHECK IF USERNAME EXISTS
    foundProfile = await prisma.profile.findUnique({
      where: {
        url: submittedUsername ?? ""
      }
    });


  }
  return new NextResponse(foundProfile?.url, { status: 200 });

    // IF FOUND AND NOT BELONGS TO THIS USER, RETURN CONFLICT
    if (foundProfile && localUser?.profiles[0].id?.toLowerCase() !== foundProfile.id?.toLowerCase()) {
      return new NextResponse("Username already exists", { status: 409 });
    }

    // else if(foundProfile && user?.profiles[0].id === foundProfile.id) {
    //   {

    //   }

    // ELSE (NOT FOUND OR BELONGS TO CURRENT USER), RETURN OK
    return new NextResponse("Username available", { status: 200 });

}