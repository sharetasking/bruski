"use client"

import Avatar from "@/components/Avatar";
import { Reply } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai';
import { MessageCircle } from 'lucide-react';


import useBruskiUser, { BruskiUser } from '@/hooks/useBruskiUser';
import useFollow from '@/hooks/useFollow';
import useLike from '@/hooks/useLike';
import useLoginModal from '@/hooks/useLoginModal';
import { cn, timeAgo } from '@/lib/utils';

import { BruskiPost } from '@/hooks/usePost';
import FollowButtonPlus from '../FollowButtonPlus';
import LikeButton from '../LikeButton';
import MoreOptionsPosts from "../MoreOptionsPosts";

interface PostItemProps {
  data: BruskiPost & {saving?: false};
  user: BruskiUser|null;
  isComment?: boolean;
}

const PostItem: React.FC<PostItemProps> = ({ data, user, isComment =false }) => {


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
  const { isFollowing, toggleFollow, } = useFollow({ profileId, following: data.poster?.isFollowed ?? false, followersCount: data.poster?.num_followers});

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
        cursor-pointer 
        transition
        border-b
        mb-4
        border-primary/5
        duration-200
        wrap-words
        grow
        flex
      `, data?.saving ? "border-2 border-dashed opacity-80": "")}>
      <div className="flex sm:flex-row items-start gap-2 flex-1">
          <div className="flex flex-col gap-1 items-center rounded-full mt-2">


            <div className="flex flex-col items-center gap-1">
        <div className='w-8 h-8 flex-0 shrink-0 grow-0 flex relative rounded-full'>

        {/* AVATAR IMAGE */}
        <div className="relative">
          <Avatar img={data.poster?.img ?? "/img/placeholder.svg"} url={"/"+data.poster?.url ?? ""} size={8} hasBorder={false} />
          
          {/* FOLLOW BUTTON */}
          {(data.poster?.id != signedInUserProfileId) && 
            <FollowButtonPlus settings={{profileId:data.poster?.id, follows:isFollowing??false, followersCount:Math.max(data.poster?.num_followers, 0)}}  />
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
              <div 
                onClick={goToUser} 
                className="user_name">
                  {data.poster?.display_name}
              </div>
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




{ (data.poster?.id == signedInUserProfileId || data.poster?.userId == user?.id) && 
            <span className="ml-4 text-sm text-primary/40"><MoreOptionsPosts post={data} user={user} /></span>
          }
          </div>
          
          {/* {data.originalPostId && <span className="text-xs py-1 font-medium rounded-full w-fit px-4 bg-primary/10">Comment</span>} */}

          {/* POST CONTENTS */}
          {
            data.mediaType == "CHALLENGE"
            && 
          <div className="flex flex-col bg-secondary text-primary rounded-3xl w-full min-h-[260px] p-4 lg:p-8 text-lg leading-[21px] mt-1 grow-0 whitespace-pre-line">
            <div className=" min-h-[200px] items-center text-center justify-center flex whitespace-pre-wrap break-words">{data.body}</div>
            <div className="text-xs mt-2 border border-primary/20 text-primary  py-1 px-3 w-fit rounded-2xl"><span className="font-medium">{data.num_comments ?? 0}</span> <span className="opacity-70">{plurify("response", data.num_comments)}</span></div>
            <button className='mt-4 btn bg-transparent hover:bg-transparent active:text-primary hover:scale-[1.2]  border hover:border-transparent active:border-transparent  border-muted-foreground/90 text-primary active:bg-opacity-90 flex items-center gap-2 justify-center'><Reply size={16}/>Answer</button>
          </div>
          }

          {
            data.mediaType != "CHALLENGE"
            &&
          <div className="text-primary text-[#262f3f] pb-4 text-[15px] leading-[21px] mt-1 block grow-0 whitespace-pre-wrap break-words">
            {data.body}
          </div>
          
          }

          
          {data.originalPost?.mediaType == "CHALLENGE" && data.originalPostId &&
          
          <span className="flex flex-col bg-secondary hover:bg-primary/10 active:bg-primary/20 text-primary rounded-3xl min-h-[60px] lg:w-4/5 px-4 py-6 lg:p-8 leading-[21px] mt-1 grow-0 whitespace-pre-line">
            <div onClick={(ev) => goToLink(ev, "/post/"+data.originalPost?.id)} >
              
              
              <div className='font-normal text-sm line-clamp-6 text-left items-center justify-center px-4 py-4 flex h-grow w-full min-h-[60px] whitespace-pre-wrap break-words'>{data.originalPost?.body}</div>
              <div className="text-xs bordder border-primary/10 text-primary/80 py-1 text-right w-full rounded-2xl"><span className="font-medium">{data.originalPost?.num_comments ?? 0}</span> <span className="opacity-70">{plurify("response", data.originalPost?.num_comments)}</span></div>
              <div className="flex flex-wrap items-center justify-between gap-4 mt-4 ">


{data.originalPost && 
              <div className="flex flex-wrap gap-2 items-center ">
                <div onClick={(ev) => goToLink(ev, "/"+data.originalPost?.poster?.url)} className=''>

                <Avatar size={6} img={data.originalPost?.poster?.img ?? "/img/placeholder.svg"} url={"/"+data.originalPost?.poster?.url ?? ""} hasBorder={false} />
                  {/* <div className="relative">
                    <Avatar size={6} img={data.originalPost?.poster?.img ?? "/img/placeholder.svg"} url={"/"+data.originalPost?.poster?.id ?? ""} hasBorder={false} />
                    <FollowButtonPlus settings={{profileId:data.id, follows:data.isFollowedByUser??false, followersCount:Math.max(data.numFollowers, 0)}}  />
                  </div> */}


                  
                </div>
                <div onClick={(ev) => goToLink(ev, "/"+data.originalPost?.poster?.url)} className='hover:underline text-base font-medium '>{data.originalPost?.poster?.display_name} </div>
              </div>
            }


                
                

                  <div className="flex flex-col items-center gap-1">
                  
                    <button className='btn bg-transparent hover:bg-transparent active:text-primary hover:scale-[1.2]  border hover:border-transparent active:border-transparent border-muted-foreground/90 text-primary active:bg-opacity-90 opacity-100 flex items-center justify-center gap-2 w-fit'><Reply size={16}/>Answer</button>
                    
                  </div>
                


              </div>
            </div>
            
          </span>}


          {data.originalPost?.mediaType != "CHALLENGE" && data.originalPostId && <span className="text-sm py-4 font-medium px-4 rounded-2xl hover:bg-primary/5 active:bg-primary/10 active:border-primary/10 hover:border-primary/5 border border-primary/10">
            <div onClick={(ev) => goToLink(ev, "/post/"+data.originalPost?.id)} >
              {/* {JSON.stringify(data.originalPost)} */}

              
              <div className="flex gap-2 items-center ">
                <div onClick={(ev) => goToLink(ev, "/"+data.originalPost?.poster?.url)} className=''>
                  <Avatar size={6} img={data.originalPost?.poster?.img ?? "/img/placeholder.svg"} url={"/"+data.originalPost?.poster?.url ?? ""} hasBorder={false} />
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
          <div className="flex flex-row justify-between items-center gap-10">
            {/* LEFT BUTTONS (BOTTOM) */}
            <div className="flex items-center gap-1">




              {/* Like */}
              <LikeButton post={data} user={user} />
              

              {/* Message */}
              <div 
                className="
                  flex 
                  flex-row 
                  items-center 
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
                  {data.num_comments || 0}
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