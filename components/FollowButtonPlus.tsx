"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useFollow from "@/hooks/useFollow";
import { toast } from "react-hot-toast";
import { useCallback, useMemo } from 'react';
import useLoginModal from '@/hooks/useLoginModal';
import useBruskiUser from '@/hooks/useBruskiUser';
import mixpanel from '../utils/mixpanel';
import { cn } from "@/lib/utils";

interface FollowButtonType
{
  profileId: string;
  follows: boolean;
  followersCount?: number;
}

// TODO properly define all the type definitions marked as "any" in the app
const FollowButtonPlus = ({settings}: {settings: FollowButtonType}) => {

    
  
  const { profileId, follows, followersCount } = settings;

  const { isFollowing, toggleFollow } = useFollow({ profileId, following: follows ?? false, followersCount});

  
  const loginModal = useLoginModal();
  const { data: currentUser } = useBruskiUser();


  const handleFollow = useCallback(async (e: any) => {
    e.preventDefault()
    e.stopPropagation()


    // if trying to follow, log in mixpanel
    if (!isFollowing) {
      mixpanel.track("follow", {
        // Optionally include properties about the page
        followed_user: profileId,
        url: window.location.pathname
      });

    }


    // if (!currentUser) {
    //   return loginModal.onOpen();
    // }

    toggleFollow();


    // router.push('/home')
  }, [toggleFollow, isFollowing, profileId]); //loginModal, currentUser, 


  const router = useRouter();
  return ( <div>

    
    {/* <Button className={cn("h-8 mt-2 mr-auto py-1 hover:text-primary-foreground/80 active:ring-2 active:scale-95 ring-offset-0 border-0", !isFollowing ? "btn-follow text-primary-foreground" : " border bg-transparent text-primary")} variant="outline">{isFollowing ? "Unfollow": "Follow"}</Button> */}
    <button onClick={handleFollow} className={cn("absolute -right-2 -top-1 inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 rounded-full hover:bg-secondary active:bg-primary-foreground active:scale-95 border-2 border-solid border-secondary text-primary", !isFollowing ? "bg-gradient-to-br from-orange-400 via-pink-400 to-sky-400 hover:from-orange-500 hover:via-pink-500 hover:to-sky-500 active:from-orange-400 active:via-pink-400 active:to-sky-400 text-secondary" : "bg-secondary text-primary hidden")}>{isFollowing ? "-": "+"}</button>
    
  </div> );
}
 
export default FollowButtonPlus;