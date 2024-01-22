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
import { BruskiUser } from "@/hooks/useBruskiUser";

interface ProfileIdPageProps {
  params: {
    profileId: string;
  };
};

const ProfileIdPage =  async ({
  params
}: ProfileIdPageProps) => {





  // DEFINE PROFILE TO BE SENT BACK TO COMPONENT
  let profile:ExtendedProfile|null = null;
  let bruskiUser:BruskiUser|null = null;
try{

  // GET CLERK USER
  const user = await currentUser();


                // if(!user || !user.id)
                //   return;

                
                // if (!user.id) {
                //   return redirectToSignIn();
                // }



  // DEFINE PROFILE TO BE USED IN THIS FUNCTION
  let _profile;



  // IF CLERK USER EXISTS, GET LOCAL USER AND PROFILE
  if(user && user.id )
  {



    bruskiUser = await prismadb.user.findUnique({
      where: {
        clerkUserId: user?.id,
      },
      include: {
        profiles: true,
      },
    });
  



  }

  

  


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


                    // if(!_profile)
                    // {
                    //   console.log('not found')
                    //   // if not found, search by url
                    //   _profile = await prismadb.profile.findUnique({
                    //     include: {
                    //       companion: {
                    //         select: {
                    //           id: true,
                    //           ownerId: true,
                    //           categoryId: true,
                    //         }
                    //       },
                    //       listOfProfilesFollowingViewedProfile: {
                    //         where: { followerId: bruskiUser?.profiles?.[0]?.id },
                    //         select: { followerId: true, followeeId: true },
                    //       },
                    //     },
                    //     where: {
                    //       url: params.profileId,
                    //     }
                    //   });
                    // }


  // EXTEND PROFILE TO INCLUDE FOLLOWING STATUS
  

  if(_profile)
  {
    profile = {
      ..._profile,
      isFollowing: _profile?.listOfProfilesFollowingViewedProfile.length > 0 ?? false,
    };
  }
  
  console.log(profile)

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

}
catch(e)
{
  console.log(e)
}

  return ( 
    <>


    <ProfilePageComponent profile={profile} user={bruskiUser} />








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
