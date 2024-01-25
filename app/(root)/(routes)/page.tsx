
import useBruskiUser from "@/hooks/useBruskiUser";
import prisma from "@/lib/prismadb";

import LandingPageComponent from "./LandingPageComponent";
import { NextResponse } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { getServerSession } from "next-auth";
import { authConfig }  from "@/app/api/auth/[...nextauth]/options";
import { SessionProvider, getProviders } from "next-auth/react";


const SignInPage = async () => {
  

  // GET PROVIDERS FOR USE IN THE LOGIN COMPONENT
  const providers = await getProviders() ?? null;


  // GET SESSION
  const session = await getServerSession(authConfig)

  const sessionUser = session?.user ?? null;
  console.log(sessionUser)
  let user = null;
  if(sessionUser)
  {
    //find corresponding db user and get their profile
    user = await prisma.user.findFirst({
      where: {
        email: sessionUser.email  //find user by email
      },
      include: {
        profiles: true // Include the related Profile records
      }
    });


  }

    //get profiles
    const profiles = await prisma.profile.findMany({
      take: 25,
      orderBy: {
        createdAt: 'desc'
      },
    });


    console.log(user  )
  if(!user)
  {
    return (
      providers && <LandingPageComponent profiles={profiles ?? []}
      providers={Object.values(providers)} /> 
    )

  }
  else if(user)
  {
   // redirect to home
    redirect('/home');
  }
  else{
    return <div>Refresh to restart</div> 
  }

}
 
export default SignInPage;
