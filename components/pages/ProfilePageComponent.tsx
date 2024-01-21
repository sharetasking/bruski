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
import { Post } from "@prisma/client";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ProfilePageProps {
    profile: ExtendedProfile|null;
    user?: BruskiUser|null;
    page?: number;
}

const ProfilePageComponent = ({profile, user, page=1}: ProfilePageProps) => {

    const [posts, setPosts] = useState<Post[]>([]);
    const [generating, setGenerating] = useState<boolean>(false);
    
    const {data} = usePosts({ take: 4, page:page });

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
  const loadMorePosts = async ({page}:{page:number}) => {

    setPosts((prev) => [...prev, ...data ])
//     fetchPosts({ take: 4, page:page }).then((res) => {
//       try{
//         setPosts((prev) => [...prev, ...res ])
//       }
//       catch(error){
//         console.error(error);
//       }
//       console.log(posts)
//     }
//     ).catch((error) => {
//       console.error('Failed to fetch posts:', error);
//     });
  }




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
                <PostFeed profileId={profile?.id} user={user} onScrollEnd={loadMorePosts} />

                {/* <div className="bg-primary shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">About Me</h2>
                    <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est
                        vitae tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                        suscipit. Nunc finibus vel ante id euismod. Vestibulum ante ipsum primis in faucibus orci luctus
                        et ultrices posuere cubilia Curae; Aliquam erat volutpat. Nulla vulputate pharetra tellus, in
                        luctus risus rhoncus id.
                    </p>

                    <h3 className="font-semibold text-center mt-3 -mb-2">
                        Find me on
                    </h3>
                    <div className="flex justify-center items-center gap-6 my-6">
                        <a className="text-gray-700 hover:text-orange-600" aria-label="Visit TrendyMinds LinkedIn" href=""
                            target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-6">
                                <path fill="currentColor"
                                    d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z">
                                </path>
                            </svg>
                        </a>
                    </div>


                    <h2 className="text-xl font-bold mt-6 mb-4">Experience</h2>
                    <div className="mb-6">
                        <div className="flex justify-between flex-wrap gap-2 w-full">
                            <span className="text-gray-700 font-bold">Web Developer</span>
                            <p>
                                <span className="text-gray-700 mr-2">at ABC Company</span>
                                <span className="text-gray-700">2017 - 2019</span>
                            </p>
                        </div>
                        <p className="mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                            tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                            suscipit.
                        </p>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between flex-wrap gap-2 w-full">
                            <span className="text-gray-700 font-bold">Web Developer</span>
                            <p>
                                <span className="text-gray-700 mr-2">at ABC Company</span>
                                <span className="text-gray-700">2017 - 2019</span>
                            </p>
                        </div>
                        <p className="mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                            tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                            suscipit.
                        </p>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between flex-wrap gap-2 w-full">
                            <span className="text-gray-700 font-bold">Web Developer</span>
                            <p>
                                <span className="text-gray-700 mr-2">at ABC Company</span>
                                <span className="text-gray-700">2017 - 2019</span>
                            </p>
                        </div>
                        <p className="mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                            tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                            suscipit.
                        </p>
                    </div>
                </div> */}
            </div>
        </div>
    </div>
</div>


  
  </> );
}
 
export default ProfilePageComponent;