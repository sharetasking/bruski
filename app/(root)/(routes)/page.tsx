
import useBruskiUser from "@/hooks/useBruskiUser";
import prisma from "@/lib/prismadb";
import { Profile } from "@prisma/client";

import LandingPageComponent from "./LandingPageComponent";
import { NextResponse } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { getServerSession } from "next-auth";
import { authConfig }  from "@/app/api/auth/[...nextauth]/options";
import { SessionProvider, getProviders } from "next-auth/react";
import HeroComponent from "./components/hero";
import FeaturesComponent from "./components/features";
// import MeetPixi from "./components/meetPixi";
// import YourPixiCan from "./components/yourPixiCan";
// import YourPixiIs from "./components/yourPixiIs";
// import WeAreOnAMission from "./components/WeAreOnAMission";
// import FollowOurJourney from "./components/FollowOurJourney";
// import WantToHelp from "./components/wantToHelp";
import dynamic from 'next/dynamic';

// export async function generateStaticParams() {
//   const profiles = await prisma.profile.findMany({
//     take: 25,
//     orderBy: { createdAt: 'desc' },
//   });

//   return { profiles };
// }




// export async function getStaticProps() {
//   // Fetch general data here, like profiles
//   const profiles = await prisma.profile.findMany({
//     take: 25,
//     orderBy: {
//       createdAt: 'desc'
//     },
//   });

//   // Return the profiles as props
//   return {
//     props: {
//       profiles,
//     },
//     revalidate: 10*60*60*24, // 10 Days
//   };
// }




const SignInPage = async () => {
  

  // GET PROVIDERS FOR USE IN THE LOGIN COMPONENT
  const providers = await getProviders() ?? null;
  // const FeaturesComponent = dynamic(() => import('./components/features'), { ssr: false });
  const MeetPixi = dynamic(() => import('./components/meetPixi'), { ssr: false });
  const YourPixiIs = dynamic(() => import('./components/yourPixiIs'), { ssr: false });
  const YourPixiCan = dynamic(() => import('./components/yourPixiCan'), { ssr: false });
  const WeAreOnAMission = dynamic(() => import('./components/WeAreOnAMission'), { ssr: false });
  const FollowOurJourney = dynamic(() => import('./components/FollowOurJourney'), { ssr: false });
  const WantToHelp = dynamic(() => import('./components/wantToHelp'), { ssr: false });

  
  // GET SESSION
  const session = await getServerSession(authConfig)

  const sessionUser = session?.user ?? null;

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

  if(!user)
  {
    return (
      <div className="w-screen grid grid-cols-1 no-scrollbar">

          <HeroComponent profiles={profiles} />
          <FeaturesComponent />
          <MeetPixi />
          <YourPixiIs />
          <YourPixiCan />
          <WeAreOnAMission />
          <FollowOurJourney />
          <WantToHelp />

          <div className="flex text-sm gap-2">
            <span>Copyright &copy; 2024 Bruski.com</span>
            <span className="block">All rights reserved.</span>
          </div>          
          <div className="md:flex hidden text-sm items-center justify-start gap-4 mb-4">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            &bull;
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>


      </div>
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
