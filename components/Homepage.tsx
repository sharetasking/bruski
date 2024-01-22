"use client"

import { PostCreator } from "./post-creator";
import { PostFeed } from "@/components/PostFeed";
import { Test } from "@/components/test";
import { Categories } from "@/components/categories";
import { MediaType, Profile } from "@prisma/client";
import { useEffect } from "react";
import { Companions } from "@/components/companions";
import Image from "next/image";
// import { useRouter } from "next/navigation"
import { SearchInput } from "@/components/search-input";
// import PostItem from "@/components/posts/postItem";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs"
import { auth, currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import PixiWidget from "@/components/PixiWidget";
import BottomBar from "@/components/BottomBar";
import useProfiles, {ExtendedProfile} from "@/hooks/useProfiles";
import Link from "next/link";
import Avatar from "@/components/Avatar"
import FollowButtonPlus from "@/components/FollowButtonPlus"
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { usePosts } from "@/hooks/usePosts";
import { profile } from "console";
import ProfileIdPage from "@/app/(root)/(routes)/[profileId]/page";

interface Post{
  body: string;
  createdAt?: Date;
  id?: string;
  comments?: any[];
  poster: {id:string, display_name:string, img:string};
}


// CLASS
export const Homepage = ({user}: {user: any}) => {
  
  const { data: profiles } = useProfiles({ take: 4, fresh: true });
  const [comments, setComments] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  

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
  const profileId = null;

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


  return (
    <>

    <div className="fadeInUp grid lg:grid-cols-4 grid-cols-1 w-7xl gap-2">

      {/* Left Column */}
      <div className="hidden flex-1 gap-4 grow sm:flex flex-col w-full inset-0 pr-8 ">
        <p className="gap-4">
          <h3>Discover Bruski</h3>
          <p className="text-primary/70">
            Connect, share, and engage with the latest topics.
            {/* Your space to voice, your stage to influence. */}
            {/* Join the conversation that&apos;s shaping the world, one post at a time. */}
          </p>

          <div>
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-1 xl:grid-cols-1 items-start justify-start text-left">
            {/* TODO: Code this */}
            {/* {
              (profiles && profiles.length) && profiles.map((profile: ExtendedProfile, index) => (
                
                  <>
                { index < 3 &&
                <div key={profile.id} className={cn("text-sm p-4 font-semibold min-h-[40px] flex flex-col items-start", index < profiles.length - 2 ? " ": "")}>
                  <div className="flex items-center gap-2 relative">
                    <Avatar url={profile?.id} img={profile.img ?? "/images/placeholder.png"} className="followable  " size={8} hasBorder={true} />
                    <Link className="line-clamp-1 text-medium text-sm text-left " href={"/"+profile.id}>{profile?.display_name}</Link>
                  </div>
                </div>
                }
                </>

              ))
            } */}
          </div>
          </div>
          {/* <p className="">👉 Post Now</p> */}
        </p>
        {/* TODO: 
        <h2 className="font-semibold tracking-tight text-left text-lg mb-2">Even more to explore</h2>
        <Categories /> */}

        {/* <div className="mt-12 lg:flex hidden bg-secondary rounded-2xl p-8 h-[480px]">
          &nbsp;
        </div> */}

      </div>









        {/* Center column */}
        <div className="lg:col-span-2 w-full flex flex-col items-center mx-auto grow-0">
          <PostCreator onPostSubmit={addPost} placeholder="What's going on in your world today?" />
          
          <PostFeed user={user} _posts={posts} onScrollEnd={loadMorePosts} />
        </div>








        {/* Right column */}
        <div className="flex-1 flex flex-col pb-72 px-4 gap-4 sticky pl-8">
          {/* FEATURED PROFILES */}
          <h3>Get updates from</h3>
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-1 xl:grid-cols-1 items-start justify-start text-left">
            {
              (profiles && profiles.length) && profiles.map((profile: ExtendedProfile, index) => (
                
                  <>
                { index < 3 &&
                <div key={profile.id} className={cn("text-sm p-4 font-semibold min-h-[40px] flex flex-col items-start", index < profiles.length - 2 ? " bordder-b bordder-primary/5": "")}>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar url={profile?.url} img={profile.img ?? "/images/placeholder.png"} size={8} hasBorder={true} />
                      
                      <FollowButtonPlus settings={{profileId:profile.id, follows:(profile.isFollowedByUser || profile.id == user?.profiles?.[0]?.id)??false, followersCount:Math.max(profile.numFollowers, 0)}}  />
                    </div>
                    
                    
                    <Link className="line-clamp-1 text-medium text-sm text-left " href={"/"+profile.url}>{profile?.display_name}</Link>
                  </div>
                  
                  <div className="font-normal text-sm text-primary/50 line-clamp-3 text-left">{profile.bio}</div>
                  {/* {profile.id != user?.profiles?.[0]?.id && !profile.isFollowedByUser &&
                    <FollowButton settings={{profileId:profile.id, follows:profile.isFollowedByUser??false, followersCount:Math.max(profile.numFollowers, 0)}}  />
                  } */}
                </div>}
                </>

              ))
            }
          </div>
        <div className="">
          {/* Profile widget */}
          {/* <div className="bg-secondary rounded-lg px-4 py-8 flex flex-col items-center ">
            <div className="relative w-32 h-32 shrink-0 grow-0 rounded-full">
              
<div className="w-full h-full bg-secondary rounded-full flex items-center shrink-0 grow-0 justify-center text-primary/30 text-2xl font-bold">&nbsp;</div>

            </div>
            <p className="font-bold mt-4">
              User
            </p>
            <p className="text-xs">
              @user
            </p>
            <div className="flex gap-2 items-center justify-between line-clamp-1 mt-4">
              <p className="text-xs">
                1,000 followers
              </p>
              <p className="text-xs">
                1,000 following
              </p>
            </div>
            
            <p className="text-xs">
              1,000 posts
            </p>
            
      <Button size="lg" className="mt-4">
      Invite Friends
          </Button>


          <Button size="lg" className="mt-4 hover:border-primary border-2 border-transparent hover:bg-transparent active:border-4 transition duration-75 flex gap-2 items-center" variant="ghost">
            <Image src="/pixi.png" width={40} height={40} alt="Pixi" />
            Edit your Pixi
          </Button>

      
              </div> */}

        </div>
      </div>
        



    </div>





    </>
    
  )
};



// "use client";


// import axios from 'axios';
// import { useCallback, useState } from 'react';
// import { toast } from 'react-hot-toast';

// import useLoginModal from '@/hooks/useLoginModal';
// import useRegisterModal from '@/hooks/useRegisterModal';
// // import useBruskiUser from '@/hooks/useBruskiUser';

// import Link from "next/link";
// import Image from 'next/image';

// import { auth, currentUser } from "@clerk/nextjs";

// import usePosts from '@/hooks/usePosts';
// import usePost from '@/hooks/usePost';

// import Avatar from './Avatar';
// import Button from './Button';


// import { PostCreator } from "./post-creator";
// import { Posts } from "@/components/posts";
// import { Categories } from "@/components/categories";
// import { Companions } from "@/components/companions";
// import { SearchInput } from "@/components/search-input";
// import Modal from '@/components/Modal';


// // interface FormProps {
// //   placeholder: string;
// //   isComment?: boolean;
// //   postId?: string;
// // }

// export const Index = ({categories, posts, companions}) => {
//   const registerModal = useRegisterModal();
//   const loginModal = useLoginModal();
//   const isComment = false;

//   const postId = null; //TODO: fix this
//   const placeholder = isComment ? 'Add your reply' : 'What\'s happening?';


//   // const { data: currentUser } = useBruskiUser();
//   // const currentUser = 
//   const { mutate: mutatePosts } = usePosts();
//   const { mutate: mutatePost } = usePost(postId as string);

//   const [body, setBody] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   let newPosts;
//   axios.get('/api/posts').then((res) => {
//     console.log(res.data);
//     newPosts = res.data;
//   });
//   const onSubmit = useCallback(async () => {
//     try {
//       setIsLoading(true);

//       const url = isComment ? `/api/comments?postId=${postId}` : '/api/posts';

//       await axios.post(url, { body });

//       toast.success('Post created');
//       setBody('');
//       mutatePosts();
//       mutatePost();
//     } catch (error) {
//       toast.error('Something went wrong');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [body, mutatePosts, isComment, postId, mutatePost]);

//   return (
//     <>
// <div className="container mx-auto px-4 py-8 items-center flex justify-center">
//   <div className="overflow-hidden rounded-md bg-white">
//     <div className="px-6 py-4">
//       <div className="flex items-center">
//         <Image className="w-10 h-10 rounded-full mr-4" src="https://unsplash.it/100/100?image=avatar" alt="User avatar" />
//         <div className="text-xl mb-2">User</div>
//         <div className="dropdown ml-auto group relative">
//           <button className="text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
//             <span className="rotate-90">...</span>
//           </button>
//           <div className="dropdown-menu absolute bg-gray-300 shadow z-50 -right-20 w-[100px] hidden group-hover:block">
//             <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Report</a>
//             <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Block</a>
//             <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Not interested in this topic</a>
//           </div>
//         </div>
//       </div>
//       <p className="text-gray-700 text-base mt-4">
//         Text from post goes here.
//       </p>
//     </div>
//     <div className="px-6 pt-4 pb-2">
//       <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Comment..." />
//       <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2">Reply</button>
//     </div>
//     <div className="px-6 pt-4 pb-2 flex justify-between items-center">
//       <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">Like</span>
//       <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">Dislike</span>
//       <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">Repost</span>
//       <div className="flex items-center">
//         <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">14</span>
//         <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">2</span>
//       </div>
//     </div>

//     { 'test:::::' }
//     {newPosts && newPosts.length}
//     {newPosts && newPosts.map((post) => (<div key={post.id}>{post}</div>)) }
//     $$$
//   </div>
// </div>
//     <div className="border-b-[1px] border-neutral-800 px-5 py-2">
//       {currentUser || true ? (
//         <div className="flex flex-row gap-4">
//           <div>
//           {/* |{currentUser}| */}
//             {/* Conditionally render the Avatar component */}
//             {/* {currentUser && <Avatar userId={currentUser.id} />} */}
//             {/* <Avatar userId={currentUser?.id} /> */}
//           </div>
//           {/* <div className="w-full">
//             <textarea
//               disabled={isLoading}
//               onChange={(event) => setBody(event.target.value)}
//               value={body}
//               className="
//                 disabled:opacity-80
//                 peer
//                 resize-none 
//                 mt-3 
//                 w-full 
//                 bg-black 
//                 ring-0 
//                 outline-none 
//                 text-[20px] 
//                 placeholder-neutral-500 
//                 text-white
//               "
//               placeholder={placeholder}>
//             </textarea>
//             <hr 
//               className="
//                 opacity-0 
//                 peer-focus:opacity-100 
//                 h-[1px] 
//                 w-full 
//                 border-neutral-800 
//                 transition"
//             />
//             <div className="mt-4 flex flex-row justify-end">
//               <Button disabled={isLoading || !body} onClick={onSubmit} label="Brew" />
//             </div>
//           </div> */}
//         </div>
//       ) : (
//         <div className="py-8">
//           {/* <h1 className="text-white text-2xl text-center mb-4 font-bold">Welcome to Bruski</h1>
//           <div className="flex flex-row items-center justify-center gap-4">
//             <Button label="Login" onClick={loginModal.onOpen} />
//             <Button label="Register" onClick={registerModal.onOpen} secondary />
//           </div> */}
//         </div>
//       )}


//     </div>
//     <Modal />
//     </>
//   );
// };

// export default Index;

