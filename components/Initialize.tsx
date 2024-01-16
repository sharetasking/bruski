"use client"

import Image from "next/image"
import Link from "next/link"
import { MessagesSquare, Router } from "lucide-react";
import { useCompanions } from "@/hooks/useCompanions";
import { useCategories } from "@/hooks/useCategories";
import Loading from "./loading";
import useProfiles from "@/hooks/useProfiles";
import { useRouter } from "next/navigation";

import FollowButton from "./FollowButton";
import { cn } from "@/lib/utils";
import Avatar from "@/components/Avatar";
import { Category } from "@prisma/client";
import useBruskiUser from "@/hooks/useBruskiUser";
import prismadb from "@/lib/prismadb";
import { User } from "@prisma/client";
import { BruskiUser } from "@/hooks/useBruskiUser"


const InitializeComponentPage = ({ user }: { user: BruskiUser }) => {

  console.log(user)
  const router = useRouter();
  const {data: profiles, isLoading} = useProfiles({profileId:"", take:4});
  const {data: categories} = useCategories();
  let filteredProfiles = profiles;

  if(isLoading ) return <Loading color="#33333399" />
  function selectCategory(id: string)
  {
     filteredProfiles = profiles?.filter((item) => item.id === id);
    console.log(filteredProfiles, id);
    
  }

  


  return ( <>
  
  <div className="w-full text-center items-center mt-6 justify-start flex flex-col gap-2 p-4">
      {/* h2 who to follow */}
      <div className="text-left lg:w-[640px]">
        <span className="text-2xl font-bold tracking-tight">Who to follow</span>
        <div className="text-primary/50">Check out the newest profiles to get more popular content</div>
      </div>
      {/* h1 welcome */}
      <div className="text-left lg:w-[640px] flex gap-x-4 gap-y-1 items-start justify-start break-words flex-wrap py-8 px-12 rounded-2xl bg-primary/5">
        {
          categories && categories.length && categories.map((item: Category) => (
            <div key={item.id}>
            
            <a onClick={()=>selectCategory(item.id)} className="font-semibold tracking-tight cursor-pointer hover:underline active:text-accent">{item.name}</a>

            {<span className="text-sm text-primary/30">&bull;</span>}
          </div>

          ))

        }
      </div>
      {/* list of users to follow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 lg:w-[640px] inset-x-0 subpixel-antialiased">
          {
            profiles && profiles.length && profiles.map((item) => (
              <Link href={`/${item.url}`} key={item.id}>
              <div className="bg-primary/5 rounded-md shadow-sm p-4 h-36 flex gap-2">

                {/* <Avatar />? */}
                {/* <Image className="rounded-full h-12 w-12 shrink-0 grow-0" alt="avatar" fill src={item.img} /> */}
                <Avatar img={item.img ?? "/placeholder.svg"} />
                <div className="items-start flex flex-col text-left">
                {/* {item.id}<br/> */}
                
                  <h1 className="line-clamp-1 font-semibold text-primary tracking-tight">{item.display_name ?? ( " ") }</h1>
                  <p className="text-sm mb-4 line-clamp-3 text-primary/80">{item.bio ?? " "}</p>
                  {item.id != user?.profiles?.[0]?.id &&
                    <FollowButton settings={{profileId: item.id, follows:!!item.listOfProfilesFollowingViewedProfile?.length, followersCount:item.numFollowers}} /> 
                  }
                </div>
              </div>
              </Link>
            ))
          }
      </div>
      
    <Link href="/" className="group mt-2 text-sm font-medium mb-36"><span className="group-hover:underline">Skip to homepage</span> &rarr;</Link>
      
    <div className="h-[260px] md:hidden block w-full">
          &nbsp;
    </div>
    </div>
  </> );
}
 
export default InitializeComponentPage;