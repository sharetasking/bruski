"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useFollow from "@/hooks/useFollow";
import { toast } from "react-hot-toast";
import { useCallback, useMemo } from 'react';
import useLoginModal from '@/hooks/useLoginModal';
import useBruskiUser from '@/hooks/useBruskiUser';
import { cn } from "@/lib/utils";

interface FollowButtonType
{
  profileId: string;
  follows: boolean;
  followersCount?: number;
}

// TODO properly define all the type definitions marked as "any" in the app
const FollowButton = ({settings}: {settings: FollowButtonType}) => {

    
  
  const { profileId, follows, followersCount } = settings;

  const { isFollowing, toggleFollow } = useFollow({ profileId, following: follows ?? false, followersCount});

  
  const loginModal = useLoginModal();
  const { data: currentUser } = useBruskiUser();
  const handleFollow = useCallback(async (e: any) => {
    e.preventDefault()
    e.stopPropagation()



    // if (!currentUser) {
    //   return loginModal.onOpen();
    // }

    toggleFollow();


    // router.push('/home')
  }, [toggleFollow]); //loginModal, currentUser, 


  const router = useRouter();
  return ( <div>

    {/* <Button onClick={handleFollow} className={cn("h-8 mt-2 mr-auto border-transparent hover:text-primary/80 active:ring-2 active:scale-95 ring-offset-0 hover:border-primary", !isFollowing ? "btn-beautified text-primary-foreground" : "bg-transparent text-primary")} variant="outline">{isFollowing ? "Unfollow": "Follow"}</Button> */}
    <Button onClick={handleFollow} className={cn("h-8 mt-2 mr-auto py-1 hover:text-primary-foreground/80 active:ring-2 active:scale-95 ring-offset-0 border-0", !isFollowing ? "btn-follow text-primary-foreground" : " border bg-transparent text-primary")} variant="outline">{isFollowing ? "Unfollow": "Follow"}</Button>
    
    
  </div> );
}
 
export default FollowButton;