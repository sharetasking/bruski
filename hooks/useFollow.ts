// /hooks/useFollow.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';
import { useProModal } from "@/hooks/use-pro-modal";
import useBruskiUser from './useBruskiUser';
import useLoginModal from '@/hooks/useLoginModal';
import { string } from 'zod';

const useFollow = ({profileId, following, followersCount}:{profileId: string, following: boolean, followersCount?: number,}) => {
  

  followersCount = followersCount || 0;
  // // const { user: currentUser, isSignedIn } = useUser();
  // const loginModal = useLoginModal();
  const [isFollowing, setIsFollowing] = useState(following);
  const [numFollowers, setNumFollowers] = useState(followersCount);



  // BEGIN TOGGLE FOLLOW
  const toggleFollow = useCallback(async () => {



    // UNFOLLOW
    if (isFollowing) {  

      try {
        setIsFollowing(false);
        setNumFollowers(numFollowers-1)
        
        const res = await unfollow(profileId); 


        if(res?.data?.decrement)
        {
          // do nothing, already done
          toast.success("Success")
        }
        
        else
        {
          // set to original and set is following to false
          setNumFollowers(numFollowers)
          setIsFollowing(true )
          toast.error("Unable to process")
        }

      } catch (error) {

        setIsFollowing(true);
        setNumFollowers(numFollowers)
        toast.error("Error")
        console.error('Failed to unfollow:', error);
      }
    }
    // FOLLOW
    else {


      try {
        setIsFollowing(true);
        setNumFollowers(numFollowers+1)
        const res = await follow(profileId); // Replace with your API call

        if(res.data.following && res.data.increment)
        {
          // do nothing, already done
          toast.success("Success")
        }
        
        else if(res.data.following)
        {
          // was already following, don't increment
          toast.success("Success")
          setNumFollowers(numFollowers)
        }
        else
        {
          // set to original and set is following to false
          setNumFollowers(numFollowers)
          setIsFollowing(false)
          toast.error("Unable to process")

        }

        
        
      } catch (error) {
        // revert
        setNumFollowers(numFollowers)
        setIsFollowing(false);

        toast.error("Error")
        console.error('Failed to follow profile:', error);
      }
    }
  }, [isFollowing, profileId, numFollowers]);




  function follow(profileId: string) {
    
    return axios.post('/api/follows', { profileId });
  //   .then(({data}) => {
  //     console.log(data)
  //     return data;//.num_followers;
  //   }
  //   ).catch((err) => {
  //     console.log(err);
  //     return null;
  //   })
  }
  
  function unfollow(profileId: string) {
    return axios.delete('/api/follows?profileId='+profileId);
  }
  

  // const {data: currentUser, mutate: mutateCurrentUser} = useBruskiUser();
  // const proModal = useProModal();


  // const isFollowing = useMemo(() => {
  //   const list = currentUser?.following || [];

  //   return list.includes(profileId);
  // }, [profileId, currentUser?.following]);
  


  // useEffect(() => {
  //   if (!currentUser || !profileId) return;

  //   const checkFollowingStatus = async () => {
       
  //     if (currentUser && profileId) {
  //       try {

  //         const response = await axios.get(`/api/check-following/${profileId}`); //correct variables sent, testing if correct receivced
  //         setIsFollowing(response.data.isFollowing);
  //       } catch (error) {
  //         console.error('Error checking following status', error);
  //       }
  //     }
  //   };
  
  //   checkFollowingStatus();
  // }, [currentUser, profileId]);

  

  // const toggleFollow = useCallback(async () => {
  //   if (!currentUser) {
  //     loginModal.onOpen();
  //     return;
  //   }

  //   try {
  //     let request;

  //     if (isFollowing) {
  //       request = () => axios.delete(`/api/follow/${profileId}`), {data: {profileId: profileId}};
  //     }
  //     else {
  //       request = () => axios.post('/api/follow', { profileId });
  //     }

  //     const response = await request();

  //     if (response.status === 200) {
  //       mutateCurrentProfile();
  //       mutateFetchedProfile();
  //       toast.success('Success')
  //     }
  //     // const action = isFollowing ? 'delete' : 'post';
  //     // await axios[action]('/api/follow', {
  //     //   userId: currentUser.id,
  //     //   profileId: profileId
  //     // });

  //     // setIsFollowing(!isFollowing);

  //     // toast.success(`Successfully ${isFollowing ? 'unfollowed' : 'followed'} the profile.`);
  //   } catch (error) {
  //     toast.error('Something went wrong.');
  //   }
  // }, [isSignedIn, isFollowing, currentUser, profileId, openLoginModal, mutatedCurrentUser, mutatedFetchedUser]);

  return { isFollowing, toggleFollow };
};

export default useFollow;