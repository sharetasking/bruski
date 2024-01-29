"use client"

import Image from "next/image"
import { usePosts } from "@/hooks/usePosts";
import { HashLoader } from "react-spinners";
import PostItem from "./posts/PostItem";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { BruskiUser } from "@/hooks/useBruskiUser";
import { BruskiPost } from "@/hooks/usePost";

interface Post{
  body: string;
  createdAt?: Date;
  id?: string;
  comments?: any[];
  poster: {id:string, display_name:string, img:string};
}

interface PostFeedProps {
  user?: BruskiUser|null,
  profileId?: string
  _posts?: BruskiPost[],
  onScrollEnd: ({ page }: { page: number }) => void;
  loading: boolean
}



export const PostFeed:React.FC<PostFeedProps> = ({user, profileId,_posts, onScrollEnd, loading}) => {


  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  

  // const [loading, setLoading] = useState(true);
  // const [hasMore, setHasMore] = useState(true);
  // const num_per_page = 10;


  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
        // setLoading(true);
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          onScrollEnd({ page: nextPage });
          return nextPage;
        });
      }
    };
  
    window.addEventListener("scroll", handleScroll);
  
    // Initial load
    if (page === 0) {
      setPage(1); // Start loading from page 1
    }
  
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onScrollEnd, page]);

  
  


    return(
      <>
      {/* SHOW POSTS IF AVAILABLE */}
      {_posts && _posts.map((post: BruskiPost, index) => (
          
          <div key={post.id} className="fadeInUp gap-2 flex break-words break-all max-w-xl grow w-full 
          subpixel-antialiased text-[16px] ">
            
              <PostItem
                data={post}
                user={user ?? null}
                />


                  {/* Render the <hr> if it's not the last post */}
                  {index < posts.length - 1 && <hr className="mt-4 text-primary bg-primary border-primary"/>}
            </div>   

          )
        )
      }
      {
        ((!_posts || !_posts.length) && loading) && Array.from(Array(3).keys()).map((i) =>
        <div className="lg:w-[88%] w-full flex justify-center gap-2" key={i}>
          <div className="w-10 h-10 shrink-0 grow-0 flex bg-primary/5 rounded-full ml-auto "></div>
          <div className="w-full flex flex-col gap-2 justify-left mb-24">
            <div className="animate-pulse flex w-full rounded-3xl items-center h-8 border border-transparent bg-primary/5"></div>
            <div className="animate-pulse flex w-full rounded-3xl items-center h-80 border border-transparent bg-primary/5">
            </div>
          </div>
        </div>
        )
        
        
      }
      {/* <div className="h-24 flex items-center justify-center">{ loading && <HashLoader color="#63636366" />}</div> */}
      {
        ((!posts || posts.length <= 0)) &&

        <div className="pt-10 flex flex-col items-center justify-center space-y-3">
          <div className="relative w-60 h-60">
                <Image
                  fill
                  sizes="60"
                  className="grayscale"
                  src="/empty.png"
                  alt="Empty"
                />
              </div>
              <p className="text-sm text-muted-foreground">Let&apos;s brew up some convo!</p>
            </div>


       
      }

      </>
    );
}
