import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import { authConfig } from '../auth/[...nextauth]/options';
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authConfig);
  const user = session?.user;

  // GET PARAMS
  const submittedUsername = await req.nextUrl.searchParams.get('username');

  // CHECK IF USERNAME SUBMITTED
  if (!submittedUsername) {
    return new NextResponse("Username required", { status: 400 });
  }

  
  let foundProfile;
  let localUser;

  // IF LOGGED IN, GET THE LOCAL USERNAME
  if (session && user && user.email) {
    localUser = await prisma.user.findUnique({
      where: {
        email: user.email
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