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


interface ProfilePageProps {
    profile: ExtendedProfile|null;
    user?: BruskiUser|null;
    page?: number;
}


interface Post{
    body: string;
    createdAt?: Date;
    id?: string;
    comments?: any[];
    poster: {id:string, display_name:string, img:string};
  }
  

const ProfilePageComponent = ({profile, user, page=1}: ProfilePageProps) => {

    const [posts, setPosts] = useState<Post[]>([]);
    const [generating, setGenerating] = useState<boolean>(false);
    
    const {data} = usePosts({ take: 4, page:page });
    console.log(data)
    const generatePost = () =>
    {
        setGenerating(true)
        toast.success(`Right away, ${user?.first_name}!\nI'll be done in a few mins.`)
        axios.post('/api/posts/generate', {profileId: profile?.id})
        .then((res) => {
           toast.success("Post generated") 
           setGenerating(false)
        }).catch((error) => {
            console.error('Failed to generate post:', error);
            setGenerating(false)
          });
    }
    
  // FUNCTION: LOAD MORE POSTS
//   const loadMorePosts = async ({page}:{page:number}) => {

//     setPosts((prev) => [...prev, ...data ])
// //     fetchPosts({ take: 4, page:page }).then((res) => {
// //       try{
// //         setPosts((prev) => [...prev, ...res ])
// //       }
// //       catch(error){
// //         console.error(error);
// //       }
// //       console.log(posts)
// //     }
// //     ).catch((error) => {
// //       console.error('Failed to fetch posts:', error);
// //     });
//   }










  // FUNCTION: ADD COMMENT 
  const addPost = async (newComment:string, mediaType:MediaType) => {
    const tempId = new Date().getTime().toString();

    let comment = {
        id: tempId,
        body: newComment,
        mediaType: mediaType,
        poster: user?.profiles?.[0], //TODO: fix this
        saving: true,
      };
    
    if(comment.poster)
      comment.poster.isFollowed = false;


    setPosts(prevComments => [comment, ...prevComments]);


    try {
      // Replace this with your actual API call logic to submit the comment
      const response = await fetch(`/api/posts?media_type=${mediaType}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: newComment, poster: user?.profiles?.[0] }),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Update the state with the permanent ID received from the server
      setPosts(prevComments => prevComments.map(comment => 
          comment.id === tempId ? { ...comment, id: data.id, saving:false } : comment
      ));
  } catch (error) {
      console.error('Failed to submit comment:', error);
      toast.error('Failed to submit comment');
      // Optionally remove the temporary comment from the state
      setPosts(prevComments => prevComments.filter(comment => comment.id !== tempId));
  }
    
  };


  // FUNCTION: LOAD MORE POSTS
  const loadMorePosts = ({page}:{page:number}) => {
    fetchPosts({ take: 4, page:page }).then((res) => {
      try{
        setPosts((prev) => [...prev, ...res ])
      }
      catch(error){
        console.error(error);
      }
      console.log(posts)
    }
    ).catch((error) => {
      console.error('Failed to fetch posts:', error);
    });
  }

  
// function: fetch posts
const fetchPosts = async ({ take, page=1 }:{ take:number, page?:number }) => {
  const profileId = profile?.id;

  setLoading(true);
  page = page <= 0 ? 1 : page;

  const url = profileId ? `/api/posts?page=${page}&size=${4}&profileId=${profileId}` : `/api/posts?page=${page}&size=${4}`;
  console.log(url)
  const response = await fetch(url);
  const data = await response.json();
  setLoading(false);
  return data;
};


// INITIAL FETCH
useEffect(() => {
  fetchPosts({ take: 4 }).then((res) => {
    try{
      setPosts(res);
    }
    catch(error){
      console.error(error);
    }
  }).catch((error) => {
    console.error('Failed to fetch posts:', error);
  });
}, []); 














    //   const [user, setUser] = useState<User>();
//   const [profile, setProfile] = useState<Profile>();
  const [following, setFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

//   const profile = useProfile(profile?.id);
  
  return ( <>
  





<div className="">
    <div className="container mx-auto py-8">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
                <div className="bg-secondary rounded-2xl p-6">
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
                            
                            {(profile && profile?.id != user?.profiles?.[0].id) && <FollowButton settings={{profileId: profile?.id, follows:!!profile?.listOfProfilesFollowingViewedProfile?.length, followersCount:profile?.num_followers}} /> }
                            
                            {(profile?.companion?.ownerId == user?.id ) && <button className="btn-beautified" onClick={generatePost}>{!generating ? "Generate Post" :"Generating..."}</button>}
                            
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
                <PostFeed profileId={profile?.id} _posts={posts} user={user} onScrollEnd={loadMorePosts} />

                
            </div>
        </div>
    </div>
</div>


  
  </> );
}
 
export default ProfilePageComponent;