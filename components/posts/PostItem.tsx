"use client"

import { useRouter } from 'next/navigation'; 
import { useCallback, useMemo } from 'react';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineRetweet, AiOutlineLike, AiOutlineDislike,AiOutlineUserAdd, AiOutlineUserDelete } from 'react-icons/ai';
import { formatDistanceToNowStrict } from 'date-fns';
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar"

import { cn } from '@/lib/utils';
import Image from 'next/image';
import useLoginModal from '@/hooks/useLoginModal';
import useBruskiUser, { BruskiUser } from '@/hooks/useBruskiUser';
import useLike from '@/hooks/useLike';
import useFollow from '@/hooks/useFollow';
import Link from 'next/link';

interface PostItemProps {
  data: Record<string, any>;
  user: BruskiUser|null;
  isComment?: boolean;
}

const PostItem: React.FC<PostItemProps> = ({ data = {}, user, isComment =false }) => {

  const signedInUserProfileId = user?.profiles?.[0]?.id;
  
  const profileId = data?.profileId;

  // ROUTER AND MODAL
  const router = useRouter();
  const loginModal = useLoginModal();


  // CURRENT USER AND LIKE HOOKS
  const { data: currentUser } = useBruskiUser();
  const { hasLiked, numLikes, toggleLike } = useLike({ postId: data.id, profileId, liked: !!data.isLiked, likesCount: data.num_likes});
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
    router.push(`/${data?.poster?.id}`)
  }, [router, data?.poster?.id]);

  // CLICKING POST
  const goToPost = useCallback((ev: any) => {
    ev.stopPropagation();
    ev.preventDefault();
    router.push(`/post/${data.id}`);
  }, [router, data.id]);

  // LIKE POST
  const onLike = useCallback(async (ev: any) => {
    
    ev.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }

    toggleLike();
  }, [loginModal, currentUser, toggleLike]);


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
  
    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data.createdAt])

  
  return (
    <div 
      onClick={goToPost}
      className="
        p-5 
        cursor-pointer 
        rounded-2xl
        hover:bg-[#66666607]
        active:bg-[#66666617]
        transition
        duration-200
        w-full
        flex
      ">
      <div className="flex flex-row items-start gap-3 flex-1">
        {/* <Avatar profileId={data.poster?.id} /> */}
          <div className="flex flex-col gap-1 items-center rounded-full">
        <div className='w-10 h-10 flex-0 shrink-0 grow-0 flex relative rounded-full'>

        {/* AVATAR IMAGE */}
        <Avatar img={data.poster?.img} url={"/"+data.poster.id ?? ""} size={10} hasBorder={false} />
       
        </div>


        {/* FOLLOW BUTTON */}
        {/* Confirm user isn't the one being viewed */}
        {(data.profileId != signedInUserProfileId) && <button 
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
                {/* TODO: Code */}
               { !isFollowing && <AiOutlineUserAdd size={16} /> }
                
              {isFollowing && <AiOutlineUserDelete size={16} />}
              </button>}

          
        </div>
        {/* USER NAME */}
        <div className="flex flex-col w-full flex-1 grow">
          <div className="flex flex-row justify-between grow items-center gap-2">
            <div className="flex gap-2 items-center">
            <p 
              onClick={goToUser} 
              className="user_name">
              
              {data.poster?.display_name}

            </p>


            {/* TIME AGO */}
            <span className="text-primary/40 text-xs">
            {createdAt}
          </span>
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
          </div>
          
          {/* {data.originalPostId && <span className="text-xs py-1 font-medium rounded-full w-fit px-4 bg-primary/10">Comment</span>} */}

          {/* POST CONTENTS */}
          <div className="text-primary text-[#262f3f] py-4 text-[15px] leading-[21px] mt-1 block grow-0 whitespace-pre-line">
            {data.body}
          </div>

          {data.originalPostId && <span className="text-sm py-2 font-medium px-4 rounded-2xl hover:bg-primary/5 active:bg-primary/10 active:border-primary/10 hover:border-primary/5 border border-primary/10">
            <div onClick={(ev) => goToLink(ev, "/post/"+data.originalPost?.id)} >
              {/* {JSON.stringify(data.originalPost)} */}
              <div className="flex gap-2 items-center ">
                <div onClick={(ev) => goToLink(ev, "/"+data.originalPost?.poster?.id)} className=''>
                  <Avatar size={6} img={data.originalPost?.poster?.img} url={"/"+data.originalPost?.poster?.id ?? ""} hasBorder={false} />
                </div>
                <div onClick={(ev) => goToLink(ev, "/"+data.originalPost?.poster?.id)} className='hover:underline'>{data.originalPost?.poster?.display_name} </div>
              </div>
              <div className='ml-8 font-normal'>{data.originalPost?.body}</div>
            </div>
            
          </span>}
{/* 
          <div>
            {JSON.stringify(data)}
          </div> */}


          {/* BOTTOM BUTTONS */}
          <div className="flex flex-row justify-between items-center mt-3 gap-10">
            {/* LEFT BUTTONS (BOTTOM) */}
            <div className="flex items-center gap-4">
              <div 
                className="
                  flex 
                  flex-row 
                  items-center 
                  text-neutral-500 
                  gap-1 
                  cursor-pointer 
                  transition 
                  hover:text-sky-500
                  text-xs
              ">
                <AiOutlineMessage size={20} />
                <p>
                  {data.comments?.length || 0}
                </p>
              </div>
              <div
                onClick={onLike}
                className="
                  flex 
                  flex-row 
                  items-center 
                  text-neutral-500 
                  gap-1 
                  cursor-pointer 
                  transition 
                  hover:text-red-500
              ">
                <LikeIcon color={hasLiked ? 'red' : ''} size={20} />
                <p className="text-xs">
                  {numLikes }
                </p>
              </div>
              {/* Num Echos */}
              {/* <div 
                className="
                  flex 
                  flex-row 
                  items-center 
                  text-neutral-500 
                  gap-1 
                  cursor-pointer 
                  transition 
                  hover:text-sky-500
                  text-xs
              ">
                <AiOutlineRetweet size={20} />
                <p>
                  {data.comments?.length || 0}
                </p>
              </div> */}
              
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
                  bg-primary/5
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