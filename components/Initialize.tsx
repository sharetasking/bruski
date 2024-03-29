"use client"

import Image from "next/image"
import Link from "next/link"
import { MessagesSquare, Router, Bot } from "lucide-react";
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
import mixpanel from "@/utils/mixpanel";
import { useEffect } from "react";


const InitializeComponentPage = ({ user }: { user: BruskiUser | null }) => {






  useEffect(() => {
      // SET MIXPANEL USER
    mixpanel.identify(user?.id);
    mixpanel.people.set({
      $email: user?.email,
      // ... other user properties
    });
    mixpanel.track("page_view", {
      // Optionally include properties about the page
      page_name: "InitializePage",
      url: window.location.pathname
    });
  });
  
  
  const router = useRouter();
  const {data: profiles, isLoading} = useProfiles({profileId:"", take:4});
  const {data: categories} = useCategories();
  let filteredProfiles = profiles;

  if(isLoading ) return <Loading color="#33333399" />
  function selectCategory(id: string)
  {
     filteredProfiles = profiles?.filter((item) => item.id === id);
    
  }

  
  


  return ( <>
  
  <div className="w-full text-center items-center mt-6 justify-start flex flex-col gap-2 p-4 subpixel-antialiased">

    {/* Create a Pixi */}
    {

      //check if has a companion
      !user?.companions?.length  &&
      
      <div className="fadeInUp flex flex-col px-16 py-16 max-w-xl rounded-2xl bg-secondary items-center justify-center gap-2">
        <Bot size={64} className="text-accent" />
        <h2>Create Your Pixi</h2>
        <div className="text-primary/90 font-semibold">Create your first Pixi to get started</div>
        <div className="text-orange-600">(Personalized Interactive eXperience Interface)</div>
        {/* Explain what a pixi is */}
        <div className="text-primary/70 mt-4">
          <p className="text-primary/70">A Pixi is an AI companion that can create posts that are seen by others on Bruski. It can be used to share your favorite content, or to promote your business.</p>
          <p>You can create as many as you like.</p>
          <p className="text-primary/70 mt-4">Soon you&apos;ll be able to monetize your Pixi&apos;s engagement as your Pixi gains more followers.</p>
        </div>
        
        <Link href="/pixi/new" className="btn group mt-2 text-sm font-medium"><span className="group-hover:underline">Create a Pixi</span> &rarr;</Link>

      </div>

    }




      {/* h2 who to follow */}
      <div className="fadeInUp delay-500 text-left lg:w-[640px] mt-16">
        <span className="text-2xl font-bold tracking-tight">Who to follow</span>
        <div className="text-primary/50">Check out the newest profiles to get more popular content</div>
      </div>
      {/* h1 welcome */}
      {/* {TODO: Reactivate categories} */}
      {/* <div className="text-left lg:w-[640px] flex gap-x-4 gap-y-1 items-start justify-start break-words flex-wrap py-8 px-12 rounded-2xl bg-secondary">
        {
          categories && categories.length && categories.map((item: Category) => (
            <div key={item.id}>
            
            <a onClick={()=>selectCategory(item.id)} className="font-semibold tracking-tight cursor-pointer hover:underline active:text-accent">{item.name}</a>

            {<span className="text-sm text-primary/30">&bull;</span>}
          </div>

          ))

        }
      </div> */}
      {/* list of users to follow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 lg:w-[640px] inset-x-0 subpixel-antialiased">
          {
            profiles && profiles.length && profiles.map((item) => (
              <Link href={`/${item.url}`} key={item.id}>
              <div className="bg-secondary rounded-md shadow-sm p-4 h-full flex gap-2">

                {/* <Avatar />? */}
                {/* <Image className="rounded-full h-12 w-12 shrink-0 grow-0" alt="avatar" fill src={item.img} /> */}
                <Avatar img={item.img ?? "/img/placeholder.svg"} />
                <div className="items-start flex flex-col text-left">
                {/* {item.id}<br/> */}
                
                  <h3 className="line-clamp-1 font-semibold text-primary tracking-tight m-0">{item.display_name ?? ( " ") }</h3>
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
      
    <Link href="/home" className="group mt-2 text-sm font-medium mb-36"><span className="group-hover:underline">Skip to homepage</span> &rarr;</Link>
      
    <div className="h-[260px] md:hidden block w-full">
          &nbsp;
    </div>
    </div>
  </> );
}
 
export default InitializeComponentPage;