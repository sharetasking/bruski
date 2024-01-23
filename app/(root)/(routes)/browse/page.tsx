import prisma from "@/lib/prismadb";
import BrowsePageComponent from './BrowsePageComponent';
import { Profile, User } from '@prisma/client';
import { currentUser } from '@clerk/nextjs';
import { BruskiUser } from '@/hooks/useBruskiUser';

const BrowsePage = async () => {


  // get current user
  const user = await currentUser();

  let localUser:BruskiUser|null = null;
  
  if(user)
    localUser = await prisma.user.findUnique({
    where: {
      clerkUserId: user?.id,
    },
    include: {
      profiles: true,
    },
  });

  const profiles = await prisma?.profile.findMany({
    include: {
      listOfProfilesFollowingViewedProfile: {
        select: { followerId: true, followeeId: true },
      },
      listOfProfilesFollowedByViewedProfile: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 30
  });


  // mark if is following
  interface ExtendedProfile extends Profile {
    isFollowedByUser: boolean;
    isFollowingUser: boolean;
  }

  const _profiles: ExtendedProfile[] = profiles.map(profile => {
    const _profile: ExtendedProfile = {
      ...profile,
      isFollowedByUser: profile.listOfProfilesFollowingViewedProfile.some((follow: any) => follow.followerId === localUser?.profiles?.[0]?.id) ? true : false,
      isFollowingUser: profile.listOfProfilesFollowedByViewedProfile.some((follow: any) => follow.followeeId === localUser?.profiles?.[0]?.id) ? true : false
    };
    return _profile;
  });






  return ( 
    <BrowsePageComponent profiles={_profiles} user={localUser}/>
  );
}
 
export default BrowsePage;