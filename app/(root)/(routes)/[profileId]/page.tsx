

import Image from "next/image";
import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProfilePageComponent from "@/components/pages/ProfilePageComponent";
import { ExtendedProfile } from "@/hooks/useProfiles";


import { PostFeed } from "@/components/PostFeed";
import { BruskiUser } from "@/hooks/useBruskiUser";
import { authConfig } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth"


interface ProfileIdPageProps {
  params: {
    profileId: string;
  };
};

const ProfileIdPage =  async ({
  params
}: ProfileIdPageProps) => {


const session = await getServerSession(authConfig)
const user = session?.user ?? null;


  // DEFINE PROFILE TO BE SENT BACK TO COMPONENT
  let profile:ExtendedProfile|null = null;
  let bruskiUser:BruskiUser|null = user;
try{




  // DEFINE PROFILE TO BE USED IN THIS FUNCTION
  let _profile;




  


    // GET TARGET PROFILE
    _profile = await prismadb.profile.findUnique({
      include: {
        companion: true,
        listOfProfilesFollowingViewedProfile: {
          where: { followerId: bruskiUser?.profiles?.[0]?.id },
          select: { followerId: true, followeeId: true },
        },
      },
      where: {
        url: params.profileId,
      }
    });

    if(!_profile)
    {
      return(<div className="h-full w-full items-center justify-center text-2xl text-primary/40 text-center flex grow p-40">Profile not found</div>)
    }

             
  if(_profile)
  {
    profile = {
      ..._profile,
      isFollowing: _profile?.listOfProfilesFollowingViewedProfile.length > 0 ?? false,
    };
  }
  

}
catch(e)
{
  console.log(e)
}

  return ( 
    <>


    <ProfilePageComponent profile={profile} user={bruskiUser} />



    </>
  );

}
 
export default ProfileIdPage;
