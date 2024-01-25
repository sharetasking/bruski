import prisma from "@/lib/prismadb";
import BrowsePageComponent from './BrowsePageComponent';
import { Profile, User } from '@prisma/client';
import { BruskiUser } from '@/hooks/useBruskiUser';
import { authConfig } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

const BrowsePage = async () => {


  const session = await getServerSession(authConfig)
  const sessionUser = session?.user;

  let localUser:BruskiUser|null = null;
  
  if(sessionUser)
    localUser = await prisma.user.findUnique({
    where: {
      email: sessionUser.email ?? ""
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