"use client"
//TEST FOR POST FEED MODULE
import { usePosts } from "@/hooks/usePosts";
import { use } from "react";
import { useSession } from "next-auth/react";

interface PostFeedProps {
  // just gets the user id
  userId?: string;
}


export const Test:React.FC<PostFeedProps> = ({ userId })=> {
  
  const session = useSession();
  console.log(session)
  return ( <>{JSON.stringify(session)}</> );
}