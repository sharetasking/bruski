"use client"

import { useRouter } from 'next/navigation'; 
import { useCallback, useMemo } from 'react';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineLike, AiOutlineDislike,AiOutlineUserAdd, AiOutlineUserDelete } from 'react-icons/ai';
import { formatDistanceToNowStrict } from 'date-fns';
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar"
import { MoreHorizontal } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


import { cn } from '@/lib/utils';
import Image from 'next/image';
import useLoginModal from '@/hooks/useLoginModal';
import useBruskiUser, { BruskiUser } from '@/hooks/useBruskiUser';
import useLike from '@/hooks/useLike';
import useFollow from '@/hooks/useFollow';
import Link from 'next/link';
import { timeAgo } from '@/lib/utils';

import FollowButtonPlus from '../FollowButtonPlus';

interface PostItemProps {
  data: Record<string, any>;
  user: BruskiUser|null;
  isComment?: boolean;
}

const PostItem: React.FC<PostItemProps> = ({ data = {}, user, isComment =false }) => {

  const signedInUserProfileId = user?.profiles?.[0]?.id;
  
  const profileId = data?.profileId;

  const plurify = (word: string, count: number|string) => {
    return parseInt(count+"") == 1 ? word : word + "s";
  }

  // ROUTER AND MODAL
  const router = useRouter();
  const loginModal = useLoginModal();


  // CURRENT USER AND LIKE HOOKS
  const { data: currentUser } = useBruskiUser();
  const { hasLiked, numLikes, toggleLike } = useLike({ postId: data.id, profileId, liked: !!data.isLiked, likesCount: data.num_likes});
  // const { hasLiked, numLikes, toggleLike } = useEcho({ postId: data.id, profileId, liked: !!data.isLiked, likesCount: data.num_likes});
  const { isFollowing, toggleFollow, } = useFollow({ profileId, following: data.poster?.isFollowed ?? false, followersCount: data.num_follows});

  const goToLink = useCallback((ev: any, link: string) =>
  {
    ev.stopPropagation();
    ev.preventDefault();
    router.push(link)
    return;
    
  }, [router]);

  // CLICKING USER
  const goToUser = useCallback((ev: any) => {
    ev.stopPropagation();
    ev.preventDefault();
    router.push(`/${data?.poster?.url}`)
  }, [router, data?.poster?.url]);

  // CLICKING POST
  const goToPost = useCallback((ev: any) => {
    ev.stopPropagation();
    ev.preventDefault();
    if(!data.saving)
      router.push(`/post/${data.id}`);
  }, [router, data.id, data.saving]);

  // LIKE POST
  const onLike = useCallback(async (ev: any) => {
    
    ev.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }

    toggleLike();
  }, [loginModal, currentUser, toggleLike]);

  

  // ECHO POST
  const onEcho = useCallback(async (ev: any) => {
    
    ev.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }

    // toggleEcho();
  }, [loginModal, currentUser]); //, toggleEcho

  const onFollow = useCallback(async (ev: any) => {
    
    ev.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }

    toggleFollow();
  }, [loginModal, currentUser, toggleFollow]);



  // LIKE ICON
  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;




    

  // TIME AGO
  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }
  
    return timeAgo(data.createdAt)
    // return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data.createdAt])

  
  return (
    <div 
      onClick={goToPost}
      className={cn(`
        p-5 
        cursor-pointer 
        transition
        border-b
        border-primary/5
        duration-200
        wrap-words
        grow
        flex
      `, data?.saving ? "border-2 border-dashed opacity-80": "")}>
      <div className="flex sm:flex-row flex-col items-start gap-3 flex-1">
        {/* <Avatar profileId={data.poster?.id} /> */}
          <div className="flex flex-col gap-1 items-center rounded-full">


            <div className="flex flex-col items-center gap-1">
        <div className='w-10 h-10 flex-0 shrink-0 grow-0 flex relative rounded-full'>

        {/* AVATAR IMAGE */}
        {/* <Avatar img={data.poster?.img ?? "/placeholder.svg"} url={"/"+data.poster.id ?? ""} size={10} hasBorder={false} /> */}
        <div className="relative">
          <Avatar img={data.poster?.img ?? "/placeholder.svg"} url={"/"+data.poster.url ?? ""} size={10} hasBorder={false} />
          
          {/* FOLLOW BUTTON */}
          {(data.poster?.id != signedInUserProfileId) && 
            <FollowButtonPlus settings={{profileId:data.poster?.id, follows:isFollowing??false, followersCount:Math.max(data.numFollowers, 0)}}  />
          }
        </div>

            </div>
        </div>
        {/* {(data.poster.id != signedInUserProfileId) && <button 
             onClick={onFollow}
                className={cn(`
                  flex 
                  flex-row 
                  items-center 
                  -mt-3
                  cursor-pointer 
                  transition 
                  h-8 w-8 grow-0 shrink-0 rounded-full justify-center
                  z-50
                  text-xs
              `, !isFollowing 
                  ? 'bg-gray-100 shadow-md hover:bg-gray-200 dark:bg-gray-800 text-primary/50 hover:text-sky-500'
                  : 'text-primary/20 hover:text-sky-500')}>
                    
               { !isFollowing && <AiOutlineUserAdd size={16} /> }
                
              </button>} */}

          
        </div>
        {/* USER NAME */}
        <div className="flex flex-col flex-1 grow w-full">
          <div className="flex flex-row justify-start grow items-center gap-1">
            <div className="flex gap-2 items-center">
              <p 
                onClick={goToUser} 
                className="user_name">
                  {data.poster?.display_name}
              </p>
            </div>

            
            {/* USERNAME */}
            <span 
              onClick={goToUser} 
              className="
                text-neutral-500
                cursor-pointer
                hover:underline
                hidden
                md:block
            ">
              {data.poster?.username && `@${data.poster?.username}`}
                         

            </span>
            
            {/* TIME AGO */}
            <span className="text-primary/60 text-sm">
              <span className='mr-2 text-xs text-primary/10'>&bull;</span>
              {createdAt}
            </span>






          </div>
          
          {/* {data.originalPostId && <span className="text-xs py-1 font-medium rounded-full w-fit px-4 bg-primary/10">Comment</span>} */}

          {/* POST CONTENTS */}
          {
            data.mediaType == "CHALLENGE"
            && 
          <div className="flex flex-col bg-secondary text-primary rounded-lg w-full min-h-[260px] p-4 lg:p-8 text-xl leading-[21px] mt-1 grow-0 whitespace-pre-line">
            <div className=" min-h-[200px] items-center text-center justify-center flex whitespace-pre-wrap break-words">{data.body}</div>
            <div className="text-xs mt-2 border border-primary/20 text-primary  py-1 px-3 w-fit rounded-2xl"><span className="font-medium">{data.num_comments ?? 0}</span> <span className="opacity-70">{plurify("response", data.num_comments)}</span></div>
            <button className='mt-4 btn active:bg-opacity-90'>Answer</button>
          </div>
          }

          {
            data.mediaType != "CHALLENGE"
            &&
          <div className="text-primary text-[#262f3f] py-4 text-[15px] leading-[21px] mt-1 block grow-0 whitespace-pre-wrap break-words">
            {data.body}
          </div>
          
          }

          
          {data.originalPost?.mediaType == "CHALLENGE" && data.originalPostId && <span className="flex flex-col bg-secondary w-full hover:bg-primary/10 active:bg-primary/20 text-primary rounded-2xl min-h-[260px] p-8 leading-[21px] mt-1 grow-0 whitespace-pre-line">
            <div onClick={(ev) => goToLink(ev, "/post/"+data.originalPost?.id)} >
              {/* {JSON.stringify(data.originalPost)} */}
              <div className="flex gap-2 items-center ">
                <div onClick={(ev) => goToLink(ev, "/"+data.originalPost?.poster?.url)} className=''>

                <Avatar size={6} img={data.originalPost?.poster?.img ?? "/placeholder.svg"} url={"/"+data.originalPost?.poster?.url ?? ""} hasBorder={false} />
                  {/* <div className="relative">
                    <Avatar size={6} img={data.originalPost?.poster?.img ?? "/placeholder.svg"} url={"/"+data.originalPost?.poster?.id ?? ""} hasBorder={false} />
                    <FollowButtonPlus settings={{profileId:data.id, follows:data.isFollowedByUser??false, followersCount:Math.max(data.numFollowers, 0)}}  />
                  </div> */}


                  
                </div>
                <div onClick={(ev) => goToLink(ev, "/"+data.originalPost?.poster?.url)} className='hover:underline text-base font-medium '>{data.originalPost?.poster?.display_name} </div>
              </div>
              <div className='font-normal text-2xl line-clamp-6 text-center items-center justify-center px-4 flex h-grow w-full min-h-[240px] whitespace-pre-wrap break-words'>{data.originalPost?.body}</div>
              <div className="ml-8 text-xs mt-1 border border-primary/10 text-primary/80 py-1 px-3 w-fit rounded-2xl"><span className="font-medium">{data.originalPost?.num_comments ?? 0}</span> <span className="opacity-70">{plurify("response", data.originalPost?.num_comments)}</span></div>

              <button className='mt-4 btn active:bg-opacity-90'>Answer</button>
            </div>
            
          </span>}


          {data.originalPost?.mediaType != "CHALLENGE" && data.originalPostId && <span className="text-sm py-4 font-medium px-4 rounded-2xl hover:bg-primary/5 active:bg-primary/10 active:border-primary/10 hover:border-primary/5 border border-primary/10">
            <div onClick={(ev) => goToLink(ev, "/post/"+data.originalPost?.id)} >
              {/* {JSON.stringify(data.originalPost)} */}
              <div className="flex gap-2 items-center ">
                <div onClick={(ev) => goToLink(ev, "/"+data.originalPost?.poster?.url)} className=''>
                  <Avatar size={6} img={data.originalPost?.poster?.img ?? "/placeholder.svg"} url={"/"+data.originalPost?.poster?.url ?? ""} hasBorder={false} />
                </div>
                <div onClick={(ev) => goToLink(ev, "/"+data.originalPost?.poster?.url)} className='hover:underline text-base'>{data.originalPost?.poster?.display_name} </div>
              </div>
              <div className='ml-8 font-normal text-sm line-clamp-6 opacity-70 whitespace-pre-wrap break-words'>{data.originalPost?.body}</div>
            </div>
            
          </span>}
{/* 
          <div>
            {JSON.stringify(data)}
          </div> */}


          {/* BOTTOM BUTTONS */}
          <div className="flex flex-row justify-between items-center mt-3 gap-10">
            {/* LEFT BUTTONS (BOTTOM) */}
            <div className="flex items-center gap-1">
              {/* Message */}
              <div 
                className="
                  flex 
                  flex-row 
                  items-center 
                  text-neutral-500 
                  gap-1 
                  cursor-pointer 
                  hover:bg-primary/5
                  active:bg-primary/10
                  rounded-full
                  h-14 w-14
                  justify-center
                  transition 
                  hover:text-sky-500
                  text-xs
              ">
                <AiOutlineMessage size={20} />
                <p>
                  {data.comments?.length || 0}
                </p>
              </div>

              {/* Like */}
              <div
                onClick={onLike}
                className="
                  flex 
                  flex-row 
                  items-center 
                  text-neutral-500 
                  gap-1 
                  cursor-pointer 
                  hover:bg-primary/5
                  active:bg-primary/10
                  rounded-full
                  h-14 w-14
                  justify-center
                  transition 
                  hover:text-red-500
              ">
                <LikeIcon color={hasLiked ? 'red' : ''} size={20} />
                <p className="text-xs">
                  {Math.max(numLikes, 0) }
                </p>
              </div>

              {/* Num Echos */}
              {/* <div 
                onClick={onEcho}
                className="
                  flex 
                  flex-row 
                  items-center 
                  text-neutral-500 
                  gap-1 
                  cursor-pointer 
                  hover:bg-primary/5
                  active:bg-primary/10
                  rounded-full
                  h-14 w-14
                  justify-center
                  transition 
                  hover:text-sky-500
                  text-xs
              ">
                
                <p>
                  {data.comments?.length || 0}
                </p>
              </div>
               */}
              </div>

              {/* RIGHT BUTTONS (BOTTOM) */}
              <div 
                className="
                  flex 
                  flex-row 
                  items-center 
                  text-neutral-500 
                  cursor-pointer 
                  transition 
                  
                  rounded-full
                  mt-auto
                  h-12 w-12
                  justify-center
                  grow-0
                  shrink-0
                  hover:text-sky-500
                  text-xs
              ">
                {/* <p>
                  {data.comments?.length || 0}
                </p> */}
                {/* <AiOutlineLike size={20} className="
                  rotate-180 text-primary/20 hover:text-primary" /> */}
                {/* <AiOutlineDislike size={20} /> */}
                
              </div>

            {/* TODO: <div  className="flex items-center ">
              <Button variant="ghost" className="text-sm">Approve</Button>
              <Button variant="ghost" className="text-sm">Disapprove</Button>
              
              <div 
                className="
                  flex 
                  flex-row
                  items-center 
                  text-neutral-500 
                  cursor-pointer 
                  transition 
                  bg-secondary
                  rounded-full
                  mb-auto
                  h-12 w-12
                  justify-center
                  grow-0
                  shrink-0
                  hover:text-sky-500
                  text-xs
                  z-10
                  -ml-2
              ">
                <AiOutlineLike size={20} />
                <p>
                  {data.comments?.length || 0}
                </p>
              </div>
            </div> */}






          </div>
        </div>
      </div>
    </div>
  )
}

export default PostItem;