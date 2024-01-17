import { currentUser } from "@clerk/nextjs";

import Image from "next/image";
import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { checkSubscription } from "@/lib/subscription";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProfilePageComponent from "@/components/pages/ProfilePageComponent";
import { ExtendedProfile } from "@/hooks/useProfiles";




// import { ProfilePage } from "./components/profile-page";
import { PostFeed } from "@/components/PostFeed";

interface ProfileIdPageProps {
  params: {
    profileId: string;
  };
};

const ProfileIdPage =  async ({
  params
}: ProfileIdPageProps) => {



  //get the user and the profile
  const user = await currentUser();

  if(!user || !user.id)
    return;

  
  if (!user.id) {
    return redirectToSignIn();
  }

  const localUser = await prismadb.user.findUnique({
    where: {
      clerkUserId: user?.id,
    },
    include: {
      profiles: true,
    },
  });


  //get profile details
  const _profile = await prismadb.profile.findUnique({
    include: {
      listOfProfilesFollowingViewedProfile: {
        where: { followerId: localUser?.profiles[0].id },
        select: { followerId: true, followeeId: true },
      },
    },
    where: {
      id: params.profileId,
    }
  });

  if(!_profile)
    return;

  const profile: ExtendedProfile = {
    ..._profile,
    isFollowing: _profile.listOfProfilesFollowingViewedProfile.length > 0,
  };

  //get the user's profile
  // const followerProfile = await prismadb.profile.findFirst({
  //   where: {
  //     userId: user.id,
  //   }
  // });

  // const validSubscription = await checkSubscription();

  // if (!validSubscription) {
  //   return redirect("/home");
  // }

  // let targetProfile =  await prismadb.profile.findFirst({
  //   where: {
  //     id: params.profileId,
  //   }
  // });


  // //find out if following
  // const isFollowing = await prismadb.follow.findFirst({
  //   where: {
  //     followerId: followerProfile?.id,
  //     followingId: params.profileId,
  //   }
  // });

  return ( 
    <>


    <ProfilePageComponent profile={profile} user={localUser} />








    {/*
    |{isFollowing}|<br/>
    /{toggleFollow}/ */}
    {/* ||{isFollowing} results|| */}
    {/* {user.emailAddresses[0].emailAddress},{user.id}, {user.firstName}, {user.lastName}, {user.username}, {user.phoneNumbers[0].phoneNumber} */}
    {/* <button onClick={toggleFollow}>Follow</button> */}
    {/* <ProfilePage profile={profile} user={user}  /> */}
    </>
  );

  // if(params.profileId != "new")
  //   profile = await prismadb.profile.findUnique({
  //   where: {
  //     id: params.profileId,
  //     userId,
  //   }
  // });

  // const categories = await prismadb.category.findMany();

  // return ( 
  //   <ProfilePage profile={profile}  />
  // );
}
 
export default ProfileIdPage;
