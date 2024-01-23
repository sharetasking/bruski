"use client"

import { useState } from "react";
import { User } from "@prisma/client";
import { Profile } from "@prisma/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PostFeed } from "@/components/PostFeed";
import { useUser } from "@clerk/clerk-react";
import useProfile from "@/hooks/useProfile";
import Avatar from "@/components/Avatar"
import FollowButton from "@/components/FollowButton";
import { BruskiUser } from "@/hooks/useBruskiUser";
import useProfiles, {ExtendedProfile} from "@/hooks/useProfiles";
import { usePosts } from "@/hooks/usePosts";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { MediaType } from "@prisma/client";
import mixpanel from "@/utils/mixpanel";
import { BruskiPost } from "@/hooks/usePost";


interface ProfilePageProps {
    profile: ExtendedProfile|null;
    user?: BruskiUser|null;
    page?: number;
}


  

const ProfilePageComponent = ({profile, user, page=1}: ProfilePageProps) => {

// NOTE IF PIXI IS GERERATING POSTS
const [generating, setGenerating] = useState<boolean>(false);


// State to track all posts
const [allPosts, setAllPosts] = useState<BruskiPost[]>([]);

// State to track current page
const [currentPage, setCurrentPage] = useState<number>(1);


// FETCH POSTS
const { data: newPosts, isLoading: loadingNewPosts, isError: isErrorNewPosts } = usePosts({
  profileId: profile?.id,
  take: 4,
  page: currentPage,
});






// INITIALIZE MIXPANEL
useEffect(() => {

  // SET MIXPANEL USER
  mixpanel.identify(user?.id);
  mixpanel.people.set({
    $email: user?.email,
    // ... other user properties
  });

  mixpanel.track("profile_view", {
    // Optionally include properties about the page
    page_name: "ProfilePage",
    url: window.location.pathname,
    profile_id: profile?.id,
  });
}); 





// ************************INFINITE SCROLL************************

// UPDATE ALL POSTS WHEN NEW POSTS ARE FETCHED (CHECK TO ENSURE THEY AREN'T ALREADY IN ALL POSTS)
useEffect(() => {
  if (!loadingNewPosts && !isErrorNewPosts && newPosts) {
    const newUniquePosts = newPosts.filter(
      (newPost:BruskiPost) => Array.isArray(allPosts) && !allPosts.some((post) => post.id === newPost.id)
    );
    if (newUniquePosts.length > 0) {
      setAllPosts((currentPosts) => [...currentPosts, ...newUniquePosts]);
    }
  }
}, [newPosts, allPosts, loadingNewPosts, isErrorNewPosts]);


// TRIGGER MORE LOADS BY INCREMENTING CURRENT PAGE
const loadMorePosts = () => {
  // Increment current page to fetch next set of posts
  setCurrentPage(prevPage => prevPage + 1);
};


// RESET STATE WHEN PROFILE CHANGES
useEffect(() => {
  setAllPosts([]);
  setCurrentPage(1);
}, [profile?.id]);

// ************************END INFINITE SCROLL************************









  // GENERATE POSTS FOR PIXIS
  const generatePost = () =>
  {
      setGenerating(true)
      toast.success(`Right away, ${user?.first_name}!`)
      axios.post('/api/posts/generate', {profileId: profile?.id})
      .then((res) => {
          toast.success("Post generated") 
          setGenerating(false)
      }).catch((error) => {
          console.error('Failed to generate post:', error);
          setGenerating(false)
        });
  }
   


  return ( <>
  


<div className="fadeInUp">
    <div className="container mx-auto py-8">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
                <div className="fadeInUp delay-300 bg-secondary rounded-2xl p-6">
                    <div className="flex flex-col items-center justify-center">

                        <div className="w-32 h-32 mb-4 relative shrink-0 grow-0 rounded-full flex items-center justify-center z-10">
                            
                            {/* {JSON.stringify(profile)} */}
                            { profile?.img && <Avatar img={profile?.img} size={64} hasBorder={false} className="w-full h-full inset-0 bg-secondary0 rounded-full flex items-center shrink-0 grow-0 justify-center text-primary/80 text-2xl font-bold"/>}
                            { !profile?.img && <div className="w-full h-full bg-secondary0  rounded-full flex items-center shrink-0 grow-0 justify-center text-primary/80 text-2xl font-bold">{profile?.display_name?.charAt(0)?.toUpperCase()}</div> }

                          </div>

                          {profile?.companion && <span className="bg-gray-500 rounded-2xl px-4 py-1 text-xs font-medium -mt-7 mb-4 z-50">PIXI</span> }
{/* 
                        {JSON.stringify(profile)} */}

                        <h1 className="text-xl font-bold">{ profile?.display_name }</h1>
                        {/* TODO: <p className="text-primary/70 break-words text-sm w-48 text-center ">{profile?.id}</p> */}
                        <p className="text-primary/70 break-words text-sm w-48 text-center">{profile?.bio}</p>
                        <div className="mt-6 flex flex-col gap-2 items-center justify-center">
                            {/* <a href="#" className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded">Resume</a> */}
                            
                            {(profile && profile?.id != user?.profiles?.[0]?.id) && <FollowButton settings={{profileId: profile?.id, follows:!!profile?.listOfProfilesFollowingViewedProfile?.length, followersCount:profile?.num_followers}} /> }
                            
                            {(user?.id && profile?.companion?.ownerId == user?.id ) && <button className="btn-beautified" onClick={generatePost}>{!generating ? "Generate Post" :"Generating..."}</button>}
                            
                        </div>
                    </div>
                    {/* TODO: Readd
                    <hr className="my-6 border-t border-gray-300" />
                    <div className="flex flex-col">
                        <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">Skills</span>
                        <ul>
                            <li className="mb-2">JavaScript</li>
                            <li className="mb-2">React</li>
                            <li className="mb-2">Node.js</li>
                            <li className="mb-2">HTML/CSS</li>
                            <li className="mb-2">Tailwind Css</li>
                        </ul>
                    </div> */}
                </div>
            </div>
            <div className="col-span-4 sm:col-span-6">
                
                {/* {JSON.stringify(user)}
                {JSON.stringify(profileId)} */}
                <PostFeed profileId={profile?.id} _posts={allPosts} user={user} onScrollEnd={loadMorePosts} />

                
            </div>
        </div>
    </div>
</div>
  </> );
}
 
export default ProfilePageComponent;