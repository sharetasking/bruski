"use client"

import { PostFeed } from "@/components/PostFeed";
import { MediaType } from "@prisma/client";
import { useEffect } from "react";
import { PostCreator } from "./post-creator";
// import { useRouter } from "next/navigation"
// import PostItem from "@/components/posts/postItem";
import Avatar from "@/components/Avatar";
import FollowButtonPlus from "@/components/FollowButtonPlus";
import useProfiles, { ExtendedProfile } from "@/hooks/useProfiles";
import { cn } from "@/lib/utils";
import mixpanel from "@/utils/mixpanel";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { usePosts } from "@/hooks/usePosts";
import { BruskiPost } from "@/hooks/usePost";
import Following from "./Following";
import TrendingPixis from "./TrendingPixis";
import { Bell } from "lucide-react";

interface Post{
  body: string;
  createdAt?: Date;
  id?: string;
  comments?: any[];
  poster: {id:string, display_name:string, img:string};
}


// CLASS
export const Homepage = ({user}: {user: any}) => {
  
  // PROFILE STATE
  const { data: profiles } = useProfiles({ take: 4, fresh: true });

  // POSTS COMMENT? STATE
  // const [posts, setPosts] = useState<Post[]>([]);
  
  // CURRENT POSTS PAGE STATE
  const [currentPage, setCurrentPage] = useState<number>(1);



  const [num_notifications, setNumNotifications] = useState(user?.num_notifications || 0);
  // ALL POSTS STATE
  const [allPosts, setAllPosts] = useState<BruskiPost[]>([]);


  const [postsLoading, setPostsLoading] = useState(true)

  // FETCH POSTS
  const { data: newPosts, isLoading: loadingNewPosts, isError: isErrorNewPosts } = usePosts({
    take: 10,
    page: currentPage,
  });
  


  // SET UP MIXPANEL
  useEffect(() => {
      // SET MIXPANEL USER
    mixpanel.identify(user?.id);
    mixpanel.people.set({
      $email: user?.email,
      // ... other user properties
    });
    
    mixpanel.track("page_view", {
      // Optionally include properties about the page
      page_name: "Homepage",
      url: window.location.pathname
    });
  });







  function countTo(to: number) {
    let i = num_notifications;
    const interval = setInterval(() => {
      i--;
      setNumNotifications(i);
      if (i === to) clearInterval(interval);
    }, 100);
  }










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

  setPostsLoading(loadingNewPosts)
}, [newPosts, allPosts, loadingNewPosts, isErrorNewPosts]);


// TRIGGER MORE LOADS BY INCREMENTING CURRENT PAGE
const loadMorePosts = () => {
  // Increment current page to fetch next set of posts
  setCurrentPage(prevPage => prevPage + 1);
};



// ************************END INFINITE SCROLL************************

  return (
    <>

    <div className="fadeInUp grid lg:grid-cols-4 grid-cols-1 w-7xl gap-2 no-scrollbar">

      {/* Left Column */}
      <div className="hidden flex-1 gap-4 grow lg:flex flex-col w-full inset-0 pr-8 ">
        <div className="gap-4">
          {/* <h3>Discover Bruski</h3> */}
          {/* <p className="text-primary/70">
            Connect, share, and engage with the latest topics.

          </p> */}

          <div>
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-1 xl:grid-cols-1 items-start justify-start text-left">
            <h3>Trending Pixis</h3>
            <div className="h-36">
              <TrendingPixis take={12}  />
            </div>

            <Following take={4} />

            {/* TODO: Code this */}
            {/* {
              (profiles && profiles.length) && profiles.map((profile: ExtendedProfile, index) => (
                
                  <>
                { index < 3 &&
                <div key={profile.id} className={cn("text-sm p-4 font-semibold min-h-[40px] flex flex-col items-start", index < profiles.length - 2 ? " ": "")}>
                  <div className="flex items-center gap-2 relative">
                    <Avatar url={profile?.id} img={profile.img ?? "/img/placeholder.svg"} className="followable  " size={8} hasBorder={true} />
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
        </div>
        {/* TODO: 
        <h2 className="font-semibold tracking-tight text-left text-lg mb-2">Even more to explore</h2>
        <Categories /> */}

        {/* <div className="mt-12 lg:flex hidden bg-secondary rounded-2xl p-8 h-[480px]">
          &nbsp;
        </div> */}

      </div>









        {/* Center column */}
        <div className="lg:col-span-2 w-full flex flex-col items-center mx-auto grow-0">
          {/* <PostCreator onPostSubmit={addPost} placeholder="What's going on in your world today?" /> */}
          <PostFeed user={user} _posts={allPosts} onScrollEnd={loadMorePosts} loading={postsLoading} />
        </div>








        {/* Right column */}
        <div className="flex-1 flex flex-col pt-12 pb-72 px-4 gap-4 sticky pl-8">
          <h2>Trending Deals</h2>
          <div className="text-sm flex flex-col">
            <span className="font-semibold text-muted-foreground">Want to promote your brand?</span>
            <span className="">Email us at bruski@sharetasking.com</span>
          </div>
          {/* FEATURED PROFILES */}
          <h3>Get updates from</h3>
          <div className="flex flex-col lg:grid lg:grid-cols-1 xl:grid-cols-1 items-start justify-start text-left">
            {
              (profiles && profiles.length) && profiles.map((profile: ExtendedProfile, index) => (
                
                  <>
                { index < 3 &&
                <div key={index} className={cn("text-sm px-4 py-2 font-semibold min-h-[40px] flex flex-col items-start", index < profiles.length - 2 ? " bordder-b bordder-primary/5": "")}>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar url={profile?.url} img={profile.img ?? "/img/placeholder.svg"} size={8} hasBorder={true} />
                      
                      <FollowButtonPlus settings={{profileId:profile.id, follows:(profile.isFollowedByUser || profile.id == user?.profiles?.[0]?.id)??false, followersCount:Math.max(profile.numFollowers, 0)}}  />
                    </div>
                    
                    
                    <Link className="line-clamp-1 text-medium text-sm text-left hover:underline" href={"/"+profile.url}>{profile?.display_name}</Link>
                  </div>
                  
                  <div className="font-normal text-sm text-primary/50 line-clamp-3 text-left">{profile.bio}</div>
                  {/* {profile.id != user?.profiles?.[0]?.id && !profile.isFollowedByUser &&
                    <FollowButton settings={{profileId:profile.id, follows:profile.isFollowedByUser??false, followersCount:Math.max(profile.numFollowers, 0)}}  />
                  } */}
                </div>}
                </>

              ))

            }
            {
              !profiles && Array.from(Array(3).keys()).map((i) => (
                <div key={i} className="bg-primary/5 relative shrink-0 rounded-lg mb-4 h-8 flex items-end justify-center ml-8 grow">
                  
                </div>
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

                <div className="fixed" style={{position:"fixed"}}>

            {user?.id && <Link href="/notifications" onClick={()=>{return countTo(0)}} className="clickable  text-white bg-gradient-to-br from-red-500 via-pink-600 to-orange-700 rounded-full  left-10 bottom-10 z-[4000] flex items-center justify-center h-[3.24rem] w-[3.24rem] mr-2">
              
              <Bell height={24} width={24} />
              {
              parseInt(num_notifications) > 0 && <span className="bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs absolute -top-2 -right-1 z-10">
                    {num_notifications || 0}
                </span>

              }
            </Link> }



            </div>

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

